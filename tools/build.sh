#!/usr/bin/env bash
# Builds the Hazard Glass WebUI:
#   official qBittorrent WebUI (from a release tag)
#   + patches/*.patch        (small JS fixes)
#   + theme/hazard-glass.css (appended to style.css)
#   + theme/variants/<variant>.css, unless the variant is "blue"
#
# Usage:   [VARIANT=blue|purple] tools/build.sh [tag]
#          default variant: blue; default tag: the one in QBT_TAG
# Output:  dist/webui/                folder for "Use alternative WebUI"
#          dist/hazard-glass-<version>-<variant>-<tag>.zip  (same folder, zipped)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TAG="${1:-$(<"$ROOT/QBT_TAG")}"
VERSION="$(<"$ROOT/VERSION")"
VARIANT="${VARIANT:-blue}"

# The tag becomes part of a path that is deleted with rm -rf: accept only
# plain release names such as release-5.3.0.
if [[ ! "$TAG" =~ ^[A-Za-z0-9][A-Za-z0-9._-]*$ ]]; then
    echo "error: invalid tag '$TAG' (expected something like release-5.3.0)" >&2
    exit 1
fi

if [[ ! "$VARIANT" =~ ^[a-z0-9-]+$ ]] || [[ "$VARIANT" != blue && ! -f "$ROOT/theme/variants/$VARIANT.css" ]]; then
    echo "error: unknown variant '$VARIANT' (blue, or a file in theme/variants/)" >&2
    exit 1
fi

for tool in git patch; do
    command -v "$tool" >/dev/null || { echo "error: '$tool' is required" >&2; exit 1; }
done

CACHE="$ROOT/.cache/qbittorrent-$TAG"
DIST="$ROOT/dist"
OUT="$DIST/webui"

# 1. Official WebUI sources (sparse clone of src/webui/www), cached per tag
if [[ ! -d "$CACHE/src/webui/www/private" ]]; then
    rm -rf "$CACHE"
    git clone -q --depth 1 --branch "$TAG" --filter=blob:none --sparse \
        https://github.com/qbittorrent/qBittorrent.git "$CACHE"
    git -C "$CACHE" sparse-checkout set src/webui/www >/dev/null
fi

# 2. Clean copy
rm -rf "$OUT"
mkdir -p "$OUT"
cp -r "$CACHE/src/webui/www/public" "$CACHE/src/webui/www/private" "$OUT/"

# 3. Patches: fail loudly if a newer qBittorrent changed the patched code
shopt -s nullglob
for p in "$ROOT"/patches/*.patch; do
    if ! patch -s -d "$OUT" -p1 --no-backup-if-mismatch < "$p"; then
        echo "error: $(basename "$p") does not apply to $TAG; the patch needs updating" >&2
        exit 1
    fi
done

# 4. Theme. Appended to style.css instead of linked from index.html because
#    the dialogs are iframes that load style.css only.
cat "$ROOT/theme/hazard-glass.css" >> "$OUT/private/css/style.css"
if [[ "$VARIANT" != blue ]]; then
    cat "$ROOT/theme/variants/$VARIANT.css" >> "$OUT/private/css/style.css"
fi
printf 'Hazard Glass %s (%s) for qBittorrent %s\n' "$VERSION" "$VARIANT" "$TAG" > "$OUT/HAZARD_GLASS"

# 5. Release zip (zip or python3; skipped if neither is installed)
ZIP="$DIST/hazard-glass-$VERSION-$VARIANT-$TAG.zip"
rm -f "$ZIP"
if command -v zip >/dev/null; then
    (cd "$DIST" && zip -qr "$ZIP" webui)
elif command -v python3 >/dev/null; then
    (cd "$DIST" && python3 -m zipfile -c "$ZIP" webui)
fi
if [[ -f "$ZIP" ]]; then
    echo "OK: $OUT and $(basename "$ZIP")"
else
    echo "OK: $OUT (no zip or python3, release archive skipped)"
fi
