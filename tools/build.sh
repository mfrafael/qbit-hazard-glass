#!/usr/bin/env bash
# Monta a WebUI do Hazard Glass: WebUI oficial de uma versão do qBittorrent
# + arquivos do tema (theme/) + patches (patches/*.patch).
#
# Uso: tools/build.sh [tag]        (padrão: a tag em QBT_TAG)
# Saída: dist/webui/  (pasta pronta para o "Use alternative WebUI")
set -euo pipefail

QBT_TAG_DEFAULT="$(cat "$(dirname "$0")/../QBT_TAG")"
TAG="${1:-$QBT_TAG_DEFAULT}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CACHE="$ROOT/.cache/qbittorrent-$TAG"
OUT="$ROOT/dist/webui"

# 1. WebUI oficial (sparse clone, só src/webui/www), em cache por tag
if [[ ! -d "$CACHE/src/webui/www/private" ]]; then
    rm -rf "$CACHE"
    git clone -q --depth 1 --branch "$TAG" --filter=blob:none --sparse \
        https://github.com/qbittorrent/qBittorrent.git "$CACHE"
    git -C "$CACHE" sparse-checkout set src/webui/www >/dev/null
fi

# 2. Cópia limpa
rm -rf "$OUT"
mkdir -p "$OUT"
cp -r "$CACHE/src/webui/www/public" "$CACHE/src/webui/www/private" "$OUT/"

# 3. Patches (falha alto se a versão nova do qBit mudou o trecho)
shopt -s nullglob
for p in "$ROOT"/patches/*.patch; do
    if ! patch -s -d "$OUT" -p1 --no-backup-if-mismatch < "$p"; then
        echo "ERRO: patch $(basename "$p") não aplicou em $TAG — revisar o patch." >&2
        exit 1
    fi
done

# 4. Arquivos do tema por cima
#    - theme/private/** (se existir) é copiado por cima
#    - o CSS do tema é ANEXADO ao style.css: os diálogos são iframes que
#      carregam só o style.css, então assim todas as janelas pegam o tema
if [[ -d "$ROOT/theme/private" ]]; then
    cp -r "$ROOT/theme/private/." "$OUT/private/"
fi
cat "$ROOT/theme/hazard-glass.css" >> "$OUT/private/css/style.css"

# 5. Marca de versão
VERSION="$(cat "$ROOT/VERSION")"
printf 'Hazard Glass %s sobre qBittorrent %s\n' "$VERSION" "$TAG" > "$OUT/HAZARD_GLASS"

echo "OK: $OUT  (Hazard Glass $VERSION, $TAG)"
