# Design notes

## Goal

Make the qBittorrent WebUI pleasant and readable at a glance, without losing a
single feature of the stock WebUI and without becoming a fork that is hard to
update.

## Look

- Base *Acrylic*: translucent panels (`backdrop-filter`) over a near-black
  backdrop with soft colour blobs and a faint dot grid.
- *Hazard* accents: uppercase, letter-spaced labels; glow only where there is
  live data.
- Two colours with fixed roles: **amber = actions and focus** (buttons, selected
  tab, hovered controls), **cyan = data** (progress, selection, pieces).
- Always dark: the theme remaps the stock CSS variables for both the light and
  the dark scheme.

## How it is built

| | Approach | Trade-off |
|---|---|---|
| **Chosen** | Official WebUI + appended stylesheet + minimal patches | Every feature keeps working; the patches need a check on each qBittorrent release, and `tools/build.sh` fails loudly when one no longer applies |
| Rejected | New UI from scratch on the Web API | Full freedom, but everything has to be rewritten (Options alone has hundreds of fields) |
| Rejected | Re-skin an existing alternative UI | Inherits features, but fights someone else's design and release cycle |

## Rules

1. **No geometry in the stylesheet.** MochaUI sizes columns and panels in
   JavaScript and gives any leftover height to the tallest panel. A theme that
   changes padding, borders, font sizes or `display` made the properties panel
   open covering the whole list (or vanish). Colours, backgrounds, shadows and
   `clip-path` only.
2. **Specificity, not `!important`.** Everything after the tokens is nested in
   `:root { }`, because `Layout.css`, `Window.css` and `Tabs.css` load after
   `style.css`.
3. **Patches stay tiny** and are marked `Hazard Glass` in the code, with a
   description at the top of each patch file.
4. **Nothing external.** No web fonts, CDNs or images, so the stock
   `Content-Security-Policy` keeps working (see the README).

## Things that were tried and dropped

- Properties in a wide **right-hand column**: the torrent list lost most of its
  columns and the Content tab hid the priority. The stock bottom panel stays.
- A **summary strip** on top (speeds, ratio, free space, counts): it repeated
  the status bar and cost about five rows of the list.

## Not done yet

- Login page (`public/`) keeps the stock look.
- Compiled translations: an alternative WebUI reads
  `translations/webui_<locale>.qm`, which the build does not produce yet
  (needs `lrelease`). English works out of the box.
- Narrow screens / phones.
