/**
 * Aba "Listas": listas de estudo personalizadas (F1.10), que alimentam o quiz pelo filtro "Minhas listas".
 */
import { esc, norm } from './util.js';

export class ListsPanel {
  /** @param {import('./ui.js').StudyController} ctl */
  constructor(ctl) {
    this.ctl = ctl;
    this.app = ctl.app;
    this.userData = ctl.userData;
    this.root = document.getElementById('listsPanel');
    this.nameInput = document.getElementById('newListName');
    this.createBtn = document.getElementById('btnCreateList');
    if (!this.root) return;

    // opções de nome usadas por todos os campos "adicionar por nome"
    this.datalist = document.createElement('datalist');
    this.datalist.id = 'studyNames';
    document.body.appendChild(this.datalist);

    this.createBtn?.addEventListener('click', () => this.create());
    this.nameInput?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); this.create(); } });
    this.root.addEventListener('click', (e) => this.onClick(e));
    this.root.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.matches('.list-add input')) {
        e.preventDefault();
        this.addByName(e.target.closest('.list-card').dataset.id, e.target);
      }
    });
  }

  fillDatalist() {
    if (this.datalist.childElementCount) return;
    const names = this.app.catalogItems.filter((i) => i.id !== 'pele' && i.kind !== 'fascia').map((i) => i.name);
    this.datalist.innerHTML = [...new Set(names)].sort((a, b) => a.localeCompare(b, 'pt-BR')).map((n) => `<option value="${esc(n)}"></option>`).join('');
  }

  create() {
    const name = (this.nameInput?.value ?? '').trim();
    if (!name) { this.ctl.toast('Dê um nome para a lista.'); this.nameInput?.focus(); return; }
    const list = this.userData.createCustomList(name, []);
    this.nameInput.value = '';
    this.render(list.id);
    this.ctl.toast(`Lista “${list.name}” criada. Adicione estruturas abaixo.`);
  }

  /** Procura a estrutura pelo nome ou nome em latim digitado (exato; ou o único que começa com o texto). */
  findByName(text) {
    const t = norm(text).trim();
    if (!t) return null;
    const items = this.app.catalogItems.filter((i) => i.id !== 'pele' && i.kind !== 'fascia');
    const exact = items.find((i) => norm(i.name) === t || norm(i.latin) === t);
    if (exact) return exact;
    const partial = items.filter((i) => norm(i.name).startsWith(t));
    return partial.length === 1 ? partial[0] : null;
  }

  addByName(listId, input) {
    const item = this.findByName(input.value);
    if (!item) { this.ctl.toast('Não achei essa estrutura. Escolha uma da lista de sugestões.'); return; }
    const added = this.userData.addToList(listId, [item.id]);
    this.ctl.toast(added ? `“${item.name}” adicionada.` : `“${item.name}” já está na lista.`);
    this.render(listId);
  }

  onClick(e) {
    const btn = e.target.closest('[data-act]');
    if (!btn) return;
    const card = btn.closest('.list-card');
    const id = card?.dataset.id;
    const list = id && this.userData.getList(id);
    const act = btn.dataset.act;

    if (act === 'add-name') this.addByName(id, card.querySelector('.list-add input'));
    else if (act === 'add-selected') {
      const sel = this.app.state.selected;
      if (!sel) { this.ctl.toast('Selecione uma estrutura no modelo ou na lista lateral primeiro.'); return; }
      const added = this.userData.addToList(id, [sel]);
      this.ctl.toast(added ? 'Estrutura selecionada adicionada.' : 'Ela já está nesta lista.');
      this.render(id);
    } else if (act === 'add-favs') {
      const favs = this.userData.getFavorites();
      if (!favs.length) { this.ctl.toast('Você ainda não tem favoritos.'); return; }
      const added = this.userData.addToList(id, favs);
      this.ctl.toast(`${added} favorito${added === 1 ? '' : 's'} adicionado${added === 1 ? '' : 's'}.`);
      this.render(id);
    } else if (act === 'remove') {
      this.userData.removeFromList(id, btn.dataset.sid);
      this.render(id);
    } else if (act === 'go') {
      if (this.app.M.has(btn.dataset.sid)) { this.ctl.closeModal(); this.app.select(btn.dataset.sid); }
      else this.ctl.toast('Essa estrutura ainda está carregando ou fica em outra região.');
    } else if (act === 'study' && list) {
      if (!list.ids.length) { this.ctl.toast('A lista está vazia.'); return; }
      this.ctl.openQuiz(`list:${list.id}`);
    } else if (act === 'delete' && list) {
      if (window.confirm(`Excluir a lista “${list.name}”? As estruturas não são apagadas.`)) {
        this.userData.deleteCustomList(id);
        this.render();
      }
    }
  }

  /** @param {string} [focusId] lista cujo campo de nome deve receber o foco depois de redesenhar */
  render(focusId) {
    if (!this.root) return;
    this.fillDatalist();
    const lists = this.userData.getCustomLists();
    if (!lists.length) {
      this.root.innerHTML = '<p class="empty-view">Nenhuma lista ainda. Crie uma acima (ex.: “Prova de membro superior”) e use o botão Estudar para treinar só com ela.</p>';
      return;
    }
    this.root.innerHTML = lists.map((l) => `
      <section class="list-card" data-id="${esc(l.id)}">
        <div class="list-card-head">
          <h4>${esc(l.name)}</h4>
          <span class="tour-steps-count">${l.ids.length} estrutura${l.ids.length === 1 ? '' : 's'}</span>
        </div>
        <div class="list-card-actions">
          <button type="button" class="primary" data-act="study">Estudar esta lista</button>
          <button type="button" class="btn" data-act="add-selected">＋ Seleção atual</button>
          <button type="button" class="btn" data-act="add-favs">＋ Favoritos</button>
          <button type="button" class="btn danger" data-act="delete">Excluir</button>
        </div>
        <div class="list-add">
          <input type="text" list="studyNames" placeholder="Adicionar pelo nome (ex.: Deltoide)…" aria-label="Adicionar estrutura à lista ${esc(l.name)}" autocomplete="off">
          <button type="button" class="btn" data-act="add-name">Adicionar</button>
        </div>
        <ul class="list-chips">
          ${l.ids.map((sid) => {
            const it = this.app.catalog.get(sid);
            const name = it ? it.name : sid;
            return `<li class="list-chip"><button type="button" class="chip-go" data-act="go" data-sid="${esc(sid)}" title="Ver no modelo">${esc(name)}</button><button type="button" class="chip-x" data-act="remove" data-sid="${esc(sid)}" aria-label="Remover ${esc(name)} da lista">×</button></li>`;
          }).join('') || '<li class="empty-view">Lista vazia.</li>'}
        </ul>
      </section>`).join('');
    if (focusId) this.root.querySelector(`.list-card[data-id="${CSS.escape(focusId)}"] .list-add input`)?.focus();
  }
}
