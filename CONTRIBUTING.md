# Contributing

## Development setup

Install [devenv](https://devenv.sh/) (you don't need it, but it is helpful)

Run `devenv shell` to activate the environment.

Devenv adds the following wrappers to your path:

- `run-gnome` - runs nested GNOME session for debugging.
- `link-extension` - adds a link from local source to the place GNOME expects extensions to be.
- `unlink-extension` - reverts `link-extension`.
- `compile-schemas` - recompiles schema for dconf (required for local testing).
- `package-extension` - create .zip file ready to submit to EGO.

## Contributing guidelines

- Follow [GNOME guidelines for extensions](https://gjs.guide/extensions/review-guidelines/review-guidelines.html)
- Use conventional commits
- Test your changes before submitting
- If not using devenv, format your code with `prettier`

Test workflow (standard commands in brackets):

- Make your changes
- `compile-schemas` (`glib-compile-schemas hackastats@first-non-interesting-username.github.io/schemas/`), compile dconf schema.
- `link-extension` (`ln -sfn $PWD/hackastats@first-non-interesting-username.github.io $HOME/.local/share/gnome-shell/extensions/hackastats@first-non-interesting-username.github.io`), link the extension to where GNOME expects it.
- `run-gnome` (`dbus-run-session -- gnome-shell --devkit`), run nested session of GNOME.
- Test the extension manually, especially newly introduced changes.
- `unlink-extension` (`rm ~/.local/share/gnome-shell/extensions/hackastats@first-non-interesting-username.github.io`), remove the link.
