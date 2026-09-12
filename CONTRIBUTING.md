# Contributing

## Developement setup

Install [devenv](https://devenv.sh/) (you don't need it, but it is helpful)

Run `devenv shell` to activate the envinronment.

Devenv adds the following wrappers to your path:

- `run-gnome` - runs nested GNOME session for debugging.
- `link-extension` - adds a link from local source to the place GNOME expects extensions to be.
- `unlink-extension` - reverts `link-extension`
- `compile-schemas` - recompiles schema for dconf

## Contributing guidelines

- Follow [GNOME guidelines for extensions](https://gjs.guide/extensions/review-guidelines/review-guidelines.html)
- Use conventional commits
- Test your changes before submitting
- If not using devenv, format your code with `prettier`
