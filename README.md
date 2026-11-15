# Hazard Glass

Tema para a WebUI do qBittorrent: vidro fosco (Acrylic) com toques de console sci-fi
(Hazard), uma faixa "Pulse" no topo com velocidades, ratio, espaço livre e contagem de
torrents, e o painel de detalhes do torrent numa coluna à direita.

Não é uma WebUI nova: é a WebUI oficial da versão alvo do qBittorrent com o tema por cima.
Todas as funções da original continuam lá (adicionar torrent, menus, categorias/tags,
Opções, RSS, busca, log, traduções).

## Como funciona

```
WebUI oficial (tag do qBittorrent, em QBT_TAG)
  + patches/*.patch          ajustes mínimos no HTML/JS (coluna à direita, ganchos da Pulse)
  + theme/private/**         arquivos novos (scripts/hazard-glass.js)
  + theme/hazard-glass.css   anexado ao fim do style.css (vale nos diálogos também)
  = dist/webui/              pasta pronta para "Use alternative WebUI"
```

## Montar

```sh
tools/build.sh                 # usa a tag em QBT_TAG
tools/build.sh release-5.4.0   # outra versão do qBittorrent
```

Requisitos: `git`, `patch`, `bash`.

## Instalar

1. Copie `dist/webui/` para uma pasta que o usuário do qBittorrent consiga ler.
2. Em **Tools → Options → WebUI**, marque **Use alternative WebUI** e aponte para essa pasta
   (ou, no `qBittorrent.conf`: `WebUI\AlternativeUIEnabled=true` e `WebUI\RootFolder=<pasta>`).
3. Recarregue a página (Ctrl+F5).

**Voltar à WebUI padrão:** desmarque a opção. Se a pasta sumir ou estiver sem `index.html`,
o `qbittorrent-nox` volta sozinho para a WebUI padrão.

### Segurança

Com uma WebUI alternativa o qBittorrent **deixa de enviar** o cabeçalho
`Content-Security-Policy` (e `Cross-Origin-Opener-Policy`/`Referrer-Policy`). Para manter a
mesma proteção da WebUI padrão, ative **Add custom HTTP headers** com:

```
Content-Security-Policy: default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; script-src 'self' 'unsafe-inline'; object-src 'none'; form-action 'self'; frame-src 'self' blob:; frame-ancestors 'self';
Cross-Origin-Opener-Policy: same-origin
Referrer-Policy: same-origin
```

## Atualizar para uma versão nova do qBittorrent

1. `tools/build.sh <nova-tag>`.
2. Se um patch não aplicar, o build para e diz qual: refaça só aquele trecho.
3. Teste (lista, painel da direita, diálogos, Opções) e só então troque `QBT_TAG`.

## Licença

GPL-2.0-or-later, como a WebUI do qBittorrent da qual deriva (ver `LICENSE`).
