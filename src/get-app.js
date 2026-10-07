/**
 * Aviso "Baixar para Windows (.exe)" no canto inferior direito do site.
 *
 * Só aparece no site publicado (https, fora de localhost): o `.exe` abre o atlas por `file://` e nunca o mostra, e no
 * celular, no Mac e no Linux o executável não serve. Quem dispensa (×) não o vê de novo neste navegador.
 */
const KEY = 'body3d.getapp.dismissed';

export function showDesktopDownload() {
  const box = document.getElementById('getApp');
  if (!box) return false;

  const onWeb = window.location.protocol === 'https:' && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  const ua = navigator.userAgent || '';
  const onWindows = /Windows NT/i.test(ua) && !/Mobile|Android/i.test(ua);
  const installed = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  let dismissed = false;
  try { dismissed = window.localStorage.getItem(KEY) === '1'; } catch { /* sem armazenamento: mostra sempre */ }
  if (!onWeb || !onWindows || installed || dismissed) return false;

  box.hidden = false;
  document.getElementById('getAppClose')?.addEventListener('click', () => {
    box.hidden = true;
    try { window.localStorage.setItem(KEY, '1'); } catch { /* ignora */ }
  });
  return true;
}
