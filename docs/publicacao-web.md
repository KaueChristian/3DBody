# Publicação como site (web e celular)

**Decisão (2026-10-07):** o caminho para Android, HarmonyOS e qualquer outro sistema é **publicar o atlas como site/PWA**, e
não empacotá-lo como app nativo (APK/HAP). O `.exe` do Windows continua existindo para uso offline com atualização automática.
Revisitar só se as medições em aparelhos reais (abaixo) mostrarem que o WebGL do navegador não dá conta.

## Por quê
- Um único código (`index.html` + `dist/`) serve desktop, Android, HarmonyOS, iOS e tablets; sem lojas, sem revisão, sem
  versões diferentes por sistema.
- O HarmonyOS NEXT não roda APK; um app nativo exigiria uma segunda casca (ArkTS/`.hap`) a manter. O navegador do aparelho
  já resolve os dois.
- Um app empacotado em WebView tem as **mesmas** limitações de desempenho do navegador (é o mesmo WebGL), só com mais trabalho.
- A atualização é instantânea para todos, no padrão do que o `.exe` já faz.

## Hospedagem: GitHub Pages
- Gratuita para repositório público (`KaueChristian/3DBody` é público), sem cartão e sem conta nova.
- O workflow `.github/workflows/pages.yml` já monta e publica o site; os caminhos do projeto são relativos, então funcionam
  em `https://kauechristian.github.io/3DBody/`.
- Alternativas gratuitas (Vercel, Netlify, Cloudflare Pages) também servem arquivos estáticos; o plano gratuito da Vercel é
  de uso não comercial e a conta de estudante vem pelo GitHub Student Developer Pack. Não há ganho que justifique trocar
  (o projeto não tem backend). Confira os termos atuais de cada serviço antes de decidir.

## O que já existe
- `manifest.webmanifest` e `sw.js` (PWA instalável e offline), ícones 192/512, `meta viewport` e tema.
- Layout responsivo e interface por toque (pinça e arrasto do OrbitControls; botão "Remover" no lugar do clique direito).
- Workflow de Pages e testes de fumaça (`npm test`, também por `file://`).

## O que foi ajustado para publicar
- `pages.yml` agora grava a versão (`major.minor.<execução>`) em `dist/version.js` e **versiona o cache do service worker**
  (`CACHE_NAME`) a cada deploy. Antes o nome era fixo, e o cache antigo só era trocado por acaso.

## Situação (2026-10-07)
- Site publicado em **https://body3d.app** (também `https://kauechristian.github.io/3DBody/`). O Pages usa *Source: GitHub Actions* e o
  domínio fica guardado nas configurações do Pages (não precisa de arquivo `CNAME`).
- Domínio `body3d.app` registrado na Name.com (primeiro ano gratuito pelo GitHub Student Developer Pack; **renovação ≈ US$ 26,99/ano**,
  com renovação automática no cartão salvo: decidir se mantém). DNS: 4 registros `A` do domínio raiz (`185.199.108–111.153`) e `CNAME`
  `www` → `kauechristian.github.io`; o `www` redireciona para o domínio raiz. Certificado HTTPS emitido pelo GitHub.
- O nome Body3D ainda é provisório: se mudar, o domínio perde o sentido.
- Para republicar o site sem gerar release: `gh workflow run pages.yml --ref main` (o push na `main` também gera a release do `.exe`).

## O que ainda falta (passos manuais e pendências)
1. **Ativar o Pages** (uma vez): no GitHub, *Settings → Pages → Build and deployment → Source: GitHub Actions*.
2. **Disparar o deploy.** O workflow roda em push na `main` (e `workflow_dispatch`). **Atenção:** o push na `main` também
   gera a release do `.exe` para todos os usuários (`agents.md` §9). Só faça com o `dev` aprovado.
3. **Medir em aparelhos reais** (Android e Huawei/HarmonyOS), abrindo o site e anotando em `docs/desempenho.md`: tempo até a
   primeira imagem, fps ao girar, RAM e se a carga do corpo termina. Meta do roteiro: primeira imagem < 3 s e ≥ 30 fps.
4. **Passe de usabilidade em tela pequena:** lista de estruturas, ficha e modais; toque em estruturas finas (nervos);
   download de backup e de PNG em navegadores móveis.
5. Se faltar desempenho: decimar mais as malhas, carregar o corpo sob demanda e reduzir a resolução do renderizador
   (`setPixelRatio`) em telas pequenas.
6. Ícones "maskable" separados (os atuais servem como `any maskable` e podem ser cortados em alguns launchers).

## Limitações conhecidas do formato web
- O WebGL depende do navegador/WebView do aparelho; aparelhos antigos podem ficar lentos ou sem WebGL 2.
- Dados do estudante ficam no `localStorage` do navegador daquele aparelho; use o backup JSON para levar a outro.
- O sistema pode apagar dados do site sob pouco espaço; instalar como PWA reduz o risco.
- A primeira abertura baixa ≈ 12 MB (depois fica em cache e funciona offline).
