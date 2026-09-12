# hackastats

![Image of GNOME shell with hackastats extension enabled](assets/hackastats.png)

A simple GNOME shell extension displaying today data for [hackatime](https://github.com/hackclub/hackatime) compatible coding time trackers.

> [!IMPORTANT]
> The only officially supported server is [official hackatime instance](https://hackatime.hackclub.com/).
> If your server doesn't work, feel free to submit a PR adding compatibility with it.

## Installations

This extension supports only GNOME 50+
Check your GNOME version with

```bash
gnome-shell --version
```

<!-- I'm waiting for this extension to be approved on https://extensions.gnome.org/ -->

## Configuration

You can configure this extension using dconf. Preferences page is also available, but it's self explantory (duh, no it's not).

All settings live under `/org/gnome/shell/extensions/hackastats` path. Here are the keys:

- `/org/gnome/shell/extensions/hackastats/api-key` - an API key for your hackatime server. Overwritten by `~/.wakatime.cfg`.
- `/org/gnome/shell/extensions/hackastats/base-url` - the base API URL for your hackatime server. Overwritten by `~/.wakatime.cfg`.
- `/org/gnome/shell/extensions/hackastats/position` - position on the GNOME panel, 0 is left, 1 is center and 2 is right. Defaults to 2 (on the right).
- `/org/gnome/shell/extensions/hackastats/refresh-interval` - how often should the data refresh, in seconds. Defaults to 30.

## Usage

Configure base url and api key (in dconf or by setting them in `~/.wakatime.cfg`).
If the displayed text says `Server unavailable`, the extension cannot access the server.
This usually means that you don't have network access or your base url is wrong.

## Developement setup

The developement setup is explained in [CONTRIBUTING.md](/CONTRIBUTING.md)

(tldr: use devenv)

## Disclaimer

This project is not affiliated with [Wakatime](https://wakatime.com/) in any way

## License

This project is licensed under the GNU General Public License v2.0 or later (SPDX: `GPL-2.0-or-later`).
See [LICENSE](/LICENSE) for the full text.
