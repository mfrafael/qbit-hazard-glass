# Backlog

**Pronto (1.0)** = a WebUI do dia a dia rodando o Hazard Glass (visual B, faixa Pulse,
detalhes no painel de baixo) sem perder nenhuma função da original, com o CSP reposto
por cabeçalho, e o `tools/build.sh` capaz de remontar sobre uma versão nova do qBittorrent.

## Agora (0.x)
- [x] Primeiro teste real: Pulse com dados; coluna da direita testada e descartada
- [ ] Conferir painel de baixo (abas, recolher, arrastar a divisória)
- [ ] Passar por todas as telas: diálogos (adicionar torrent, renomear, mover, categorias,
      tags), menus de contexto, Opções, Search, RSS, Log, Estatísticas
- [ ] Barras de peças/disponibilidade (canvas com cores fixas no piecesbar.js) → ciano/âmbar
- [ ] Ícones da toolbar/filtros: avaliar se combinam ou se trocamos por um conjunto próprio
- [x] Repor CSP/COOP/Referrer-Policy por cabeçalho customizado na instalação

## Depois
- [ ] Tela de login (public/) com o tema (hoje fica a padrão; LAN/Tailscale nem vê)
- [ ] Traduções: a WebUI alternativa lê `translations/webui_<locale>.qm`; hoje não
      geramos os `.qm` (precisa do `lrelease`). Só importa para quem não usa inglês
- [ ] Layout em tela estreita / celular
- [ ] Aproveitar ideias do Pulse Dashboard (cards que expandem, gráficos maiores)

## Ideias soltas
- Ícones Material Round do Nightseed (MIT/Apache-2.0) mapeiam 78/87 nomes da WebUI
