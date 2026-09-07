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
        "$PWD/wakastats@first-non-interesting-username.github.io" \
        "$HOME/.local/share/gnome-shell/extensions/wakastats@first-non-interesting-username.github.io"
    '';
    # Revert linking
    "unlink-extension".exec = "rm ~/.local/share/gnome-shell/extensions/wakastats@first-non-interesting-username.github.io";
    # Compile schemas
    "compile-schemas".exec = "glib-compile-schemas wakastats@first-non-interesting-username.github.io/schemas/";
  };
  packages = with pkgs; [
    glib
  ];
}
