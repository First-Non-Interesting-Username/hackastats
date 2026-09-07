{ pkgs, ... }:

{
  git-hooks.hooks = {
    prettier.enable = true;
  };

  scripts = {
    "run-gnome".exec = "dbus-run-session -- gnome-shell --devkit";
    "link-extension".exec = ''
      ln -sfn \
        "$PWD/wakastats@first-non-interesting-username.github.io" \
        "$HOME/.local/share/gnome-shell/extensions/wakastats@first-non-interesting-username.github.io"
    '';
    "compile-schemas".exec = "glib-compile-schemas wakastats@first-non-interesting-username.github.io/schemas/";
  };
  packages = with pkgs; [
    glib
  ];
}
