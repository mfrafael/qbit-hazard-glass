# Changelog

## 1.1.0

### Added
- Purple variant: deep purple with a blue → magenta → red glow along the bottom. Each release now has a Blue and a Purple zip.
- Idle torrents (stalled, stopped, queued) are greyed out in the list.

### Fixed
- The sort arrow no longer repeats across the sorted column header.
- Drop-down lists (like the category picker) are readable.

### Minor changes
- No more dot grid on the page background.
- Demo mode shows torrents in every state and can serve both variants at once.

## 1.0.0

First public release, for qBittorrent 5.3.0.

### Added
- Dark frosted-glass theme for the whole WebUI, dialogs included.
- Pieces and availability bars in the theme colours.
- `tools/build.sh` builds the theme for any qBittorrent release and packs a zip.
- Demo mode (`tools/demo/server.mjs`): the themed WebUI with fake Linux ISO data, no qBittorrent needed.

### Fixed
- The properties panel no longer opens covering the whole torrent list.
- Menu bar drop-downs open above the panels.
