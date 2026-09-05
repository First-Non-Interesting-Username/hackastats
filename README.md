# wakatime-gnome

A simple gnome shell extension displaying wakatime data

## Disclaimer

This project is not affiliated with [Wakatime](https://wakatime.com/) in any way

## Useful commands

```bash
# Link the extension
ln -sfn "$PWD/wakatime-gnome@first-non-interesting-username.github.io" "$HOME/.local/share/gnome-shell/extensions/wakatime-gnome@first-non-interesting-username.github.io"
# Compile the GSettings schemas (required after changing schemas/*.xml)
nix shell nixpkgs#glib.dev -c glib-compile-schemas wakatime-gnome@first-non-interesting-username.github.io/schemas/
# Launch a separate gnome session
dbus-run-session -- gnome-shell --devkit
```
