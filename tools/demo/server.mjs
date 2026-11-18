#!/usr/bin/env node
// Demo server: serves dist/webui with a fake qBittorrent Web API (Linux ISOs
// only), for screenshots and for working on the theme without a real client.
//
//   tools/build.sh && node tools/demo/server.mjs
//   PORT=8099 HOST=0.0.0.0 node tools/demo/server.mjs   (reachable from the LAN)
//
// Read-only and stateless: actions such as "pause" answer OK and change nothing.
// No dependencies; Node 18+.

import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { CATEGORIES, TAGS, TORRENTS } from "./data.mjs";
import { PREFERENCE_KEYS } from "./preference-keys.mjs";

const HOST = process.env.HOST ?? "127.0.0.1";
const PORT = Number(process.env.PORT ?? 8099);
const WEBUI = resolve(fileURLToPath(new URL("../../dist/webui", import.meta.url)));
const GiB = 1024 ** 3;
const START = Math.floor(Date.now() / 1000);

// ---------- fake data ----------

const hashOf = (name) => createHash("sha1").update(name).digest("hex");
const wave = (seed, min, max) => {
    const t = Date.now() / 4000 + seed;
    return Math.round(min + ((Math.sin(t) + Math.sin(t * 2.3) * 0.4 + 1.4) / 2.8) * (max - min));
};

const torrents = TORRENTS.map(([name, sizeGiB, category, tags, state, progress, ratio, tracker], i) => {
    const size = Math.round(sizeGiB * GiB);
    const pieceSize = 4 * 1024 * 1024;
    return {
        i, name, size, category, tags, state, progress, ratio,
        hash: hashOf(name),
        tracker: `https://${tracker}/announce`,
        pieceSize,
        piecesNum: Math.ceil(size / pieceSize),
        addedOn: START - ((i * 7 + 3) * 86400) - i * 3571
    };
});
const byHash = new Map(torrents.map((t) => [t.hash, t]));

const speeds = (t) => {
    const dl = (t.state === "downloading") ? wave(t.i, 2e6, 14e6) : 0;
    const up = ["downloading", "uploading"].includes(t.state) ? wave(t.i + 9, 1e5, 2.5e6) : 0;
    return { dl, up };
};

const torrentInfo = (t) => {
    const { dl, up } = speeds(t);
    const done = Math.round(t.size * t.progress);
    const seeds = 12 + ((t.i * 37) % 300);
    const leechs = 2 + ((t.i * 11) % 40);
    return {
        added_on: t.addedOn, amount_left: t.size - done, auto_tmm: true,
        availability: (t.progress < 1) ? 4.2 : -1, category: t.category, comment: "",
        completed: done, completion_on: (t.progress >= 1) ? t.addedOn + 1800 : -1,
        connections_count: dl || up ? 18 : 0, connections_limit: 100,
        content_path: `/downloads/${t.category}/${t.name}`, created_by: "", creation_date: t.addedOn - 86400,
        dl_limit: 0, dlspeed: dl, download_path: "", downloaded: done, downloaded_session: dl ? done / 3 : 0,
        eta: dl ? Math.round((t.size - done) / dl) : 8640000, f_l_piece_prio: false, force_start: false,
        has_metadata: true, has_other_announce_error: false, has_tracker_error: false, has_tracker_warning: false,
        inactive_seeding_time_limit: -2, infohash_v1: t.hash, infohash_v2: "",
        last_activity: START - (t.i * 600), magnet_uri: `magnet:?xt=urn:btih:${t.hash}`,
        max_inactive_seeding_time: -1, max_ratio: -1, max_seeding_time: -1, name: t.name,
        num_complete: seeds, num_incomplete: leechs, num_leechs: up ? 3 : 0, num_seeds: dl ? 14 : 0,
        piece_size: t.pieceSize, pieces_have: Math.round(t.piecesNum * t.progress), pieces_num: t.piecesNum,
        popularity: Number((t.ratio * 1.3).toFixed(2)), priority: (t.state === "queuedDL") ? 1 : 0, private: false,
        progress: t.progress, ratio: t.ratio, ratio_limit: -2, reannounce: 1200, root_path: "",
        save_path: `/downloads/${t.category}`, seeding_time: (t.progress >= 1) ? 86400 * (t.i + 2) : 0,
        seeding_time_limit: -2, seen_complete: START - 60, seq_dl: false, share_limit_action: "Default",
        share_limits_mode: "Default", size: t.size, state: t.state, super_seeding: false,
        tags: t.tags.join(", "), time_active: 86400 * (t.i + 3), total_size: t.size, total_wasted: 0,
        tracker: (t.state.startsWith("stopped") || t.state === "queuedDL") ? "" : t.tracker,
        trackers_count: 1, up_limit: 0, uploaded: Math.round(t.size * t.ratio), uploaded_session: up ? t.size / 10 : 0,
        upspeed: up
    };
};

const serverState = () => {
    const total = torrents.map(speeds).reduce((a, s) => ({ dl: a.dl + s.dl, up: a.up + s.up }), { dl: 0, up: 0 });
    return {
        alltime_dl: 12.4 * 1024 * GiB, alltime_ul: 31.7 * 1024 * GiB, average_time_queue: 0,
        connection_status: "connected", dht_nodes: 412, dl_info_data: 38 * GiB, dl_info_speed: total.dl,
        dl_rate_limit: 0, free_space_on_disk: 1.8 * 1024 * GiB, global_ratio: "2.55",
        last_external_address_v4: "203.0.113.42", last_external_address_v6: "", queued_io_jobs: 0,
        queued_tracker_announces: 0, queueing: true, read_cache_hits: "0", read_cache_overload: "0",
        refresh_interval: 1500, request_latency: 0, session_state: "running", total_buffers_size: 0,
        total_peer_connections: 57, total_queued_size: 0, total_wasted_session: 0, up_info_data: 96 * GiB,
        up_info_speed: total.up, up_rate_limit: 0, use_alt_speed_limits: false, write_cache_overload: "0"
    };
};

let rid = 0;
const maindata = () => {
    const trackers = {};
    for (const t of torrents)
        (trackers[t.tracker] ??= []).push(t.hash);
    return {
        rid: ++rid, full_update: true,
        torrents: Object.fromEntries(torrents.map((t) => [t.hash, torrentInfo(t)])),
        categories: Object.fromEntries(CATEGORIES.map((name) => [name, {
            name, savePath: `/downloads/${name}`, download_path: "", ratio_limit: -2, seeding_time_limit: -2,
            inactive_seeding_time_limit: -2, share_limit_action: "Default", share_limits_mode: "Default"
        }])),
        tags: TAGS, trackers, server_state: serverState()
    };
};

const properties = (t) => {
    const info = torrentInfo(t);
    return {
        addition_date: t.addedOn, availability: info.availability, comment: "", completion_date: info.completion_on,
        created_by: "", creation_date: info.creation_date, dl_limit: 0, dl_speed: info.dlspeed, dl_speed_avg: info.dlspeed,
        download_path: "", eta: info.eta, has_metadata: true, hash: t.hash, infohash_v1: t.hash, infohash_v2: "",
        is_private: false, last_seen: START - 60, name: t.name, nb_connections: info.connections_count,
        nb_connections_limit: 100, peers: info.num_leechs, peers_total: info.num_incomplete,
        piece_size: t.pieceSize, pieces_have: info.pieces_have, pieces_num: t.piecesNum, popularity: info.popularity,
        private: false, progress: t.progress, reannounce: 1200, save_path: info.save_path,
        seeding_time: info.seeding_time, seeds: info.num_seeds, seeds_total: info.num_complete,
        share_ratio: t.ratio, time_elapsed: info.time_active, total_downloaded: info.downloaded,
        total_downloaded_session: info.downloaded_session, total_size: t.size, total_uploaded: info.uploaded,
        total_uploaded_session: info.uploaded_session, total_wasted: 0, up_limit: 0, up_speed: info.upspeed,
        up_speed_avg: info.upspeed
    };
};

// A small release folder per torrent so the Content tab has a tree to show.
const files = (t) => {
    const base = t.name.replace(/\.(iso|img|img\.xz)$/, "");
    const list = [
        [`${base}/${t.name}`, t.size - 4096],
        [`${base}/SHA256SUMS`, 2048],
        [`${base}/SHA256SUMS.sign`, 2048]
    ];
    let first = 0;
    return list.map(([name, size], index) => {
        const pieces = Math.max(1, Math.ceil(size / t.pieceSize));
        const range = [first, first + pieces - 1];
        first += pieces;
        return {
            index, name, size, progress: (index === 0) ? t.progress : 1, priority: 1,
            is_seed: t.progress >= 1, piece_range: range, availability: (t.progress < 1) ? 4.2 : 1
        };
    });
};

const trackers = (t) => [
    { url: "** [DHT] **", status: 2, tier: -1, num_peers: 31, num_seeds: 212, num_leeches: 9, num_downloaded: 0, msg: "" },
    { url: "** [PeX] **", status: 2, tier: -1, num_peers: 4, num_seeds: 18, num_leeches: 2, num_downloaded: 0, msg: "" },
    { url: "** [LSD] **", status: 0, tier: -1, num_peers: 0, num_seeds: 0, num_leeches: 0, num_downloaded: 0, msg: "" },
    { url: t.tracker, status: 2, tier: 0, num_peers: 5, num_seeds: 82, num_leeches: 6, num_downloaded: 1904, msg: "" }
];

const pieceStates = (t) => {
    const have = Math.round(t.piecesNum * t.progress);
    return Array.from({ length: t.piecesNum }, (_, i) => (i < have) ? 2 : (i < have + 12 && t.progress < 1) ? 1 : 0);
};

const peers = (t) => {
    if (!speeds(t).dl && !speeds(t).up)
        return {};
    const clients = ["qBittorrent/5.1.2", "Transmission 4.0.6", "Deluge 2.1.1", "libtorrent (Rasterbar) 2.0.11"];
    return Object.fromEntries(clients.map((client, i) => {
        const ip = `198.51.100.${20 + i * 13}`;
        return [`${ip}:${51000 + i}`, {
            client, connection: "BT", country: "", country_code: "", dl_speed: wave(i, 2e5, 3e6), downloaded: 0,
            files: "", flags: "D", flags_desc: "", ip, peer_id_client: "", port: 51000 + i, progress: (i % 2) ? 1 : 0.41,
            relevance: 1, up_speed: (i === 3) ? wave(i, 1e5, 6e5) : 0, uploaded: 0
        }];
    }));
};

const preferences = () => {
    const prefs = { scan_dirs: {} };
    for (const k of PREFERENCE_KEYS.bool) prefs[k] = false;
    for (const k of PREFERENCE_KEYS.int) prefs[k] = 0;
    for (const k of PREFERENCE_KEYS.str) prefs[k] = "";
    return Object.assign(prefs, {
        locale: "en", save_path: "/downloads", temp_path: "/downloads/incomplete", web_ui_port: PORT,
        refresh_interval: 1500, queueing_enabled: true, max_active_downloads: 3, max_active_torrents: 5,
        max_active_uploads: 3, dht: true, pex: true, lsd: true, listen_port: 6881
    });
};

// ---------- HTTP ----------

const json = (body) => ({ type: "application/json", body: JSON.stringify(body) });
const text = (body) => ({ type: "text/plain; charset=UTF-8", body });

const api = (path, params) => {
    const t = byHash.get(params.get("hash") ?? "");
    switch (path) {
        case "app/version": return text("v5.3.0");
        case "app/webapiVersion": return text("2.16.2");
        case "app/buildInfo": return json({ bitness: 64, boost: "1.92.0", libtorrent: "2.1.2.0", openssl: "4.1.0", platform: "linux", qt: "6.12.0", zlib: "1.3.2" });
        case "app/preferences": return json(preferences());
        case "clientdata/load": return json({});
        case "sync/maindata": return json(maindata());
        case "sync/torrentPeers": return json({ rid: ++rid, full_update: true, show_flags: false, peers: t ? peers(t) : {} });
        case "transfer/info": {
            const s = serverState();
            return json(Object.fromEntries(Object.entries(s).filter(([k]) => k in { connection_status: 1, dht_nodes: 1, dl_info_data: 1, dl_info_speed: 1, dl_rate_limit: 1, last_external_address_v4: 1, last_external_address_v6: 1, up_info_data: 1, up_info_speed: 1, up_rate_limit: 1 })));
        }
        case "transfer/speedLimitsMode": return text("0");
        case "torrents/info": return json(torrents.map(torrentInfo));
        case "torrents/categories": return json(maindata().categories);
        case "torrents/tags": return json(TAGS);
        case "torrents/properties": return t ? json(properties(t)) : null;
        case "torrents/files": return t ? json(files(t)) : null;
        case "torrents/trackers": return t ? json(trackers(t)) : null;
        case "torrents/webseeds": return json([]);
        case "torrents/pieceStates": return t ? json(pieceStates(t)) : null;
        case "torrents/pieceAvailability": return t ? json(pieceStates(t).map((s, i) => 1 + ((i * 7) % 9))) : null;
        case "log/main":
        case "log/peers":
        case "search/plugins": return json([]);
        case "rss/items":
        case "rss/rules": return json({});
        default: return text("");   // actions (start, stop, setCategory…) do nothing
    }
};

const MIME = {
    ".html": "text/html; charset=UTF-8", ".js": "text/javascript; charset=UTF-8",
    ".css": "text/css; charset=UTF-8", ".svg": "image/svg+xml", ".png": "image/png",
    ".gif": "image/gif", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain"
};
// Same substitutions qBittorrent does on the fly (English, no translation files)
const TR = /QBT_TR\((([^)]|\)(?!QBT_TR))+)\)QBT_TR\[CONTEXT=[a-zA-Z_][a-zA-Z0-9_]*\]/g;
const translate = (s) => s.replace(TR, (_, src) => src.replaceAll("\"", "&#34;"))
    .replaceAll("${LANG}", "en").replaceAll("${CACHEID}", String(START));

const staticFile = async (urlPath) => {
    const rel = normalize(decodeURIComponent(urlPath === "/" ? "/index.html" : urlPath));
    for (const dir of ["private", "public"]) {
        const root = join(WEBUI, dir);
        const file = resolve(root, `.${rel}`);
        if (!file.startsWith(root + sep))    // no path traversal
            return null;
        try {
            if (!(await stat(file)).isFile())
                continue;
        }
        catch {
            continue;
        }
        const type = MIME[extname(file)] ?? "application/octet-stream";
        const data = await readFile(file);
        return { type, body: /^text\//.test(type) ? translate(data.toString("utf8")) : data };
    }
    return null;
};

createServer(async (req, res) => {
    const url = new URL(req.url, "http://demo");
    let reply = null;
    if (url.pathname.startsWith("/api/v2/")) {
        let params = url.searchParams;
        if (req.method === "POST") {
            let body = "";
            for await (const chunk of req)
                body += chunk;
            if ((req.headers["content-type"] ?? "").includes("application/x-www-form-urlencoded"))
                params = new URLSearchParams(body);
        }
        reply = api(url.pathname.slice(8), params);
    }
    else {
        reply = await staticFile(url.pathname);
    }
    if (!reply) {
        res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
        return;
    }
    res.writeHead(200, { "content-type": reply.type, "cache-control": "no-store" }).end(reply.body);
}).listen(PORT, HOST, () => {
    console.log(`Hazard Glass demo: http://${HOST}:${PORT}/  (fake data, read-only)`);
});
