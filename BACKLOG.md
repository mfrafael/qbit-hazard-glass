# Backlog

**Pronto (1.0)** = a WebUI do dia a dia rodando o Hazard Glass (visual B, layout
original) sem perder nenhuma função da original, com o CSP reposto
por cabeçalho, e o `tools/build.sh` capaz de remontar sobre uma versão nova do qBittorrent.

## Agora (0.x)
- [x] Primeiro teste real: coluna da direita testada e descartada (0.2.0)
- [x] Faixa Pulse removida (0.4.0): repetia a barra de status
- [x] Conferir painel de baixo (abas, Content com prioridade)
- [x] Menus de contexto (botão direito) e diálogo de adicionar torrent — ok no uso real
- [ ] Conferir o resto quando usar: Opções, renomear/mover, Search, RSS, Log, Estatísticas
- [x] Barras de peças/disponibilidade (patch 0002): âmbar baixando, ciano completo
- [ ] Ícones da toolbar/filtros: avaliar se combinam ou se trocamos por um conjunto próprio
- [x] Repor CSP/COOP/Referrer-Policy por cabeçalho customizado na instalação

## Depois
- [ ] Tela de login (public/) com o tema (hoje fica a padrão; LAN/Tailscale nem vê)
- [ ] Traduções: a WebUI alternativa lê `translations/webui_<locale>.qm`; hoje não
      geramos os `.qm` (precisa do `lrelease`). Só importa para quem não usa inglês
- [ ] Layout em tela estreita / celular

## Ideias soltas
- Ícones Material Round do Nightseed (MIT/Apache-2.0) mapeiam 78/87 nomes da WebUI
