/*
 * Hazard Glass — faixa "Pulse" no topo da WebUI.
 * Só lê dados: escuta os eventos que o patch 0001 dispara no client.js
 *   - hazardglass:serverstate  (velocidades, ratio, disco, DHT…)
 *   - hazardglass:statuscounts (contagem por filtro de status)
 * Não chama a API sozinho.
 */

"use strict";

(() => {
    const root = document.getElementById("hgPulse");
    if (!root)
        return;

    const SAMPLES = 60;
    const history = { dl: [], up: [] };

    const fmt = (bytes, isSpeed) => {
        const misc = window.qBittorrent?.Misc;
        return misc ? misc.friendlyUnit(bytes, isSpeed) : `${bytes} B`;
    };
    // "22.6 MiB/s" -> ["22.6", "MiB/s"]
    const split = (text) => {
        const i = text.indexOf(" ");
        return (i < 0) ? [text, ""] : [text.slice(0, i), text.slice(i + 1)];
    };

    root.innerHTML = `
        <div class="hg-tile" id="hgDl">
            <div class="hg-label">Download</div>
            <div class="hg-big"><span data-v>–</span><small data-u></small></div>
            <div class="hg-sub" data-s>&nbsp;</div>
            <svg class="hg-spark" viewBox="0 0 300 46" preserveAspectRatio="none" aria-hidden="true"></svg>
        </div>
        <div class="hg-tile" id="hgUp">
            <div class="hg-label">Upload</div>
            <div class="hg-big"><span data-v>–</span><small data-u></small></div>
            <div class="hg-sub" data-s>&nbsp;</div>
            <svg class="hg-spark" viewBox="0 0 300 46" preserveAspectRatio="none" aria-hidden="true"></svg>
        </div>
        <div class="hg-tile" id="hgRatio">
            <div class="hg-label">Global ratio</div>
            <div class="hg-big"><span data-v>–</span></div>
            <div class="hg-sub" data-s>&nbsp;</div>
        </div>
        <div class="hg-tile" id="hgDisk">
            <div class="hg-label">Free space</div>
            <div class="hg-big"><span data-v>–</span><small data-u></small></div>
            <div class="hg-sub" data-s>&nbsp;</div>
        </div>
        <div class="hg-tile" id="hgCount">
            <div class="hg-label" data-t>Torrents</div>
            <div class="hg-bar" data-bar></div>
            <div class="hg-legend" data-l></div>
        </div>`;

    const tile = (id) => {
        const el = document.getElementById(id);
        return {
            el,
            v: el.querySelector("[data-v]"),
            u: el.querySelector("[data-u]"),
            s: el.querySelector("[data-s]"),
            svg: el.querySelector("svg")
        };
    };
    const T = {
        dl: tile("hgDl"), up: tile("hgUp"), ratio: tile("hgRatio"), disk: tile("hgDisk"), count: tile("hgCount")
    };

    const setSpeed = (t, bytes) => {
        const [v, u] = split(fmt(bytes, true));
        t.v.textContent = v;
        t.u.textContent = u;
    };

    const spark = (svg, data, color) => {
        const max = Math.max(...data, 1);
        const step = 300 / (SAMPLES - 1);
        const offset = SAMPLES - data.length;
        const pts = data.map((d, i) => `${((offset + i) * step).toFixed(1)},${(44 - (d / max) * 38).toFixed(1)}`);
        if (pts.length < 2) {
            svg.innerHTML = "";
            return;
        }
        const line = `M${pts.join(" L")}`;
        const first = pts[0].split(",")[0];
        svg.innerHTML = `
            <path d="${line} L300,46 L${first},46 Z" fill="${color}" fill-opacity="0.12"/>
            <path d="${line}" fill="none" stroke="${color}" stroke-width="1.6"
                  vector-effect="non-scaling-stroke" style="filter:drop-shadow(0 0 4px ${color})"/>`;
    };

    const push = (arr, v) => {
        arr.push(Number(v) || 0);
        if (arr.length > SAMPLES)
            arr.shift();
    };

    window.addEventListener("hazardglass:serverstate", (e) => {
        const s = e.detail;

        push(history.dl, s.dl_info_speed);
        push(history.up, s.up_info_speed);
        setSpeed(T.dl, s.dl_info_speed);
        setSpeed(T.up, s.up_info_speed);
        spark(T.dl.svg, history.dl, "#22e1ff");
        spark(T.up.svg, history.up, "#ffd23f");

        const dlLimit = (s.dl_rate_limit > 0) ? fmt(s.dl_rate_limit, true) : "∞";
        const upLimit = (s.up_rate_limit > 0) ? fmt(s.up_rate_limit, true) : "∞";
        T.dl.s.textContent = `session ${fmt(s.dl_info_data, false)} · limit ${dlLimit}`;
        T.up.s.textContent = `session ${fmt(s.up_info_data, false)} · limit ${upLimit}`;

        if (s.global_ratio !== undefined)
            T.ratio.v.textContent = s.global_ratio;
        if (s.alltime_dl !== undefined)
            T.ratio.s.textContent = `↓ ${fmt(s.alltime_dl, false)} · ↑ ${fmt(s.alltime_ul, false)}`;

        if (s.free_space_on_disk !== undefined) {
            const [v, u] = split(fmt(s.free_space_on_disk, false));
            T.disk.v.textContent = v;
            T.disk.u.textContent = u;
        }
        const conn = { connected: ["#3ddc97", "Connected"], firewalled: ["#ffd23f", "Firewalled"], disconnected: ["#ff5c6c", "Disconnected"] }[s.connection_status];
        if (conn)
            T.disk.s.innerHTML = `<span class="hg-dot" style="background:${conn[0]};box-shadow:0 0 6px ${conn[0]}"></span>${conn[1]} · DHT ${s.dht_nodes ?? 0}`;
    });

    window.addEventListener("hazardglass:statuscounts", (e) => {
        const c = e.detail;
        const all = c.all || 0;
        const groups = [
            ["downloading", "downloading", "#22e1ff"],
            ["seeding", "seeding", "#3ddc97"],
            ["stopped", "stopped", "#5c6580"],
            ["errored", "errored", "#ff5c6c"]
        ];
        T.count.el.querySelector("[data-t]").textContent = `Torrents · ${all}`;
        T.count.el.querySelector("[data-bar]").innerHTML = all
            ? groups.map(([k, , col]) => `<span style="width:${((c[k] || 0) / all) * 100}%;background:${col}"></span>`).join("")
            : "";
        T.count.el.querySelector("[data-l]").innerHTML = groups
            .filter(([k]) => (k !== "errored") || (c[k] > 0))
            .map(([k, label, col]) => `<span><i style="background:${col}"></i><b>${c[k] || 0}</b> ${label}</span>`)
            .join("");
    });

    // a faixa muda a altura do topo: o MochaUI precisa recalcular as colunas
    window.addEventListener("load", () => {
        window.MochaUI?.Desktop?.setDesktopSize?.();
    });
})();
