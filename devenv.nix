{ pkgs, ... }:

{
  git-hooks.hooks = {
    prettier.enable = true;
  };

  scripts = {
    # Run nested GNOME session
    "run-gnome".exec = "dbus-run-session -- gnome-shell --devkit";
    # Link the extension for developement
    "link-extension".exec = ''
      ln -sfn \
        "$PWD/hackastats@first-non-interesting-username.github.io" \
        "$HOME/.local/share/gnome-shell/extensions/hackastats@first-non-interesting-username.github.io"
    '';
    # Revert linking
    "unlink-extension".exec = "rm ~/.local/share/gnome-shell/extensions/hackastats@first-non-interesting-username.github.io";
    # Compile schemas
    "compile-schemas".exec = "glib-compile-schemas hackastats@first-non-interesting-username.github.io/schemas/";
    # Package the extension to the format expected in
    "package-extension".exec = ''
      rm hackastats@first-non-interesting-username.github.io.shell-extension.zip &&
      rm hackastats@first-non-interesting-username.github.io/gschemas.compiled &&
      gnome-extensions pack --force --out-dir $PWD
    '';
  };
  packages = with pkgs; [
    glib
  ];
}
