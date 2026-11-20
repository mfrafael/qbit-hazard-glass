// Fake library for the demo server: Linux ISOs only.
// [name, size GiB, category, tags, state, progress, ratio, tracker host]

export const CATEGORIES = ["Desktop", "Server", "Rolling", "ARM"];
export const TAGS = ["LTS", "GNOME", "KDE", "Xfce", "netinst", "live"];

export const TORRENTS = [
    ["ubuntu-24.04.3-desktop-amd64.iso", 5.9, "Desktop", ["LTS", "GNOME"], "downloading", 0.62, 0.08, "torrent.ubuntu.com"],
    ["Fedora-Workstation-Live-43-1.6.x86_64.iso", 2.3, "Desktop", ["GNOME", "live"], "stalledDL", 0.31, 0.02, "torrent.fedoraproject.org"],
    ["archlinux-2025.11.01-x86_64.iso", 1.4, "Rolling", ["live"], "downloading", 0.87, 0.11, "archlinux.org"],
    ["debian-13.2.0-amd64-netinst.iso", 0.75, "Server", ["netinst"], "uploading", 1, 4.21, "bttracker.debian.org"],
    ["linuxmint-22.2-cinnamon-64bit.iso", 2.9, "Desktop", ["LTS"], "uploading", 1, 2.87, "torrents.linuxmint.com"],
    ["kubuntu-24.04.3-desktop-amd64.iso", 4.4, "Desktop", ["LTS", "KDE"], "stalledUP", 1, 1.64, "torrent.ubuntu.com"],
    ["debian-live-13.2.0-amd64-kde.iso", 3.4, "Desktop", ["KDE", "live"], "stalledUP", 1, 1.12, "bttracker.debian.org"],
    ["Fedora-KDE-Desktop-Live-43-1.6.x86_64.iso", 2.8, "Desktop", ["KDE", "live"], "stalledUP", 1, 0.93, "torrent.fedoraproject.org"],
    ["ubuntu-24.04.3-live-server-amd64.iso", 3.1, "Server", ["LTS"], "uploading", 1, 3.40, "torrent.ubuntu.com"],
    ["openSUSE-Tumbleweed-DVD-x86_64-Snapshot20251110-Media.iso", 4.6, "Rolling", ["KDE"], "stalledUP", 1, 0.78, "tracker.opensuse.org"],
    ["manjaro-kde-25.0.10-251103-linux612.iso", 4.2, "Rolling", ["KDE"], "stalledUP", 1, 1.35, "tracker.manjaro.org"],
    ["EndeavourOS_Mercury-2025.11.03.iso", 2.8, "Rolling", ["KDE", "live"], "stalledUP", 1, 0.66, "tracker.endeavouros.com"],
    ["xubuntu-24.04.3-desktop-amd64.iso", 3.9, "Desktop", ["LTS", "Xfce"], "stoppedUP", 1, 1.02, "torrent.ubuntu.com"],
    ["Rocky-10.0-x86_64-dvd1.iso", 8.6, "Server", [], "stalledUP", 1, 0.54, "tracker.rockylinux.org"],
    ["AlmaLinux-10.0-x86_64-boot.iso", 0.9, "Server", ["netinst"], "stalledUP", 1, 2.15, "tracker.almalinux.org"],
    ["kali-linux-2025.3-installer-amd64.iso", 4.1, "Desktop", ["Xfce"], "stalledUP", 1, 0.47, "tracker.kali.org"],
    ["pop-os_24.04_amd64_intel_23.iso", 2.6, "Desktop", ["LTS"], "stoppedUP", 1, 0.85, "tracker.pop-os.org"],
    ["elementaryos-8.0-stable.20250314rc.iso", 3.0, "Desktop", [], "metaDL", 0, 0, "tracker.elementary.io"],
    ["nixos-graphical-25.05-x86_64-linux.iso", 3.5, "Rolling", ["GNOME", "live"], "queuedDL", 0, 0, "tracker.nixos.org"],
    ["Zorin-OS-17.3-Core-64-bit.iso", 3.6, "Desktop", ["GNOME"], "stalledUP", 1, 0.71, "tracker.zorin.com"],
    ["MX-23.6_x64.iso", 2.1, "Desktop", ["Xfce", "live"], "stalledUP", 1, 1.88, "tracker.mxlinux.org"],
    ["alpine-standard-3.22.2-x86_64.iso", 0.3, "Server", ["netinst"], "uploading", 1, 6.32, "tracker.alpinelinux.org"],
    ["2025-10-01-raspios-trixie-arm64.img.xz", 1.2, "ARM", [], "stalledUP", 1, 1.27, "tracker.raspberrypi.com"],
    ["ubuntu-24.04.3-preinstalled-server-arm64+raspi.img.xz", 1.1, "ARM", ["LTS"], "stoppedUP", 1, 0.64, "torrent.ubuntu.com"],
    ["tails-amd64-7.2.img", 1.5, "Desktop", ["live"], "stoppedDL", 0.12, 0, "tracker.tails.net"],
    ["debian-13.2.0-arm64-netinst.iso", 0.6, "ARM", ["netinst"], "stalledUP", 1, 0.97, "bttracker.debian.org"],
    ["Solus-4.7-Budgie-Release-2025-01-26.iso", 2.4, "Desktop", ["live"], "forcedDL", 0.44, 0.05, "tracker.getsol.us"],
    ["install-amd64-minimal-20251109T170053Z.iso", 0.7, "Rolling", ["netinst"], "checkingDL", 0.53, 0, "tracker.gentoo.org"],
    ["slackware64-15.0-install-dvd.iso", 3.7, "Server", [], "forcedUP", 1, 3.02, "tracker.slackware.com"],
    ["void-live-x86_64-20250202-xfce.iso", 1.0, "Rolling", ["Xfce", "live"], "queuedUP", 1, 0.88, "tracker.voidlinux.org"],
    ["Qubes-R4.2.4-x86_64.iso", 6.4, "Desktop", [], "error", 0.73, 0.01, "tracker.qubes-os.org"],
    ["CentOS-Stream-10-latest-x86_64-dvd1.iso", 7.9, "Server", [], "missingFiles", 1, 0.42, "tracker.centos.org"],
    ["Mageia-9-x86_64.iso", 4.2, "Desktop", ["KDE"], "moving", 1, 1.1, "tracker.mageia.org"],
];
