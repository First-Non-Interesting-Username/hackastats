{ pkgs, ... }:

{
  git-hooks.hooks = {
    prettier.enable = true;
  };

  scripts = {
    # Run nested GNOME session
    "run-gnome".exec = "dbus-run-session -- gnome-shell --devkit";
    # Link the extension for development
    "link-extension".exec = ''
      ln -sfn \
        "$PWD/hackastats@first-uninteresting-username.github.io" \
        "$HOME/.local/share/gnome-shell/extensions/hackastats@first-uninteresting-username.github.io"
    '';
    # Revert linking
    "unlink-extension".exec = "rm ~/.local/share/gnome-shell/extensions/hackastats@first-uninteresting-username.github.io";
    # Compile schemas
    "compile-schemas".exec = "glib-compile-schemas hackastats@first-uninteresting-username.github.io/schemas/";
    # Package the extension to the format expected in
    "package-extension".exec = ''
      rm -f hackastats@first-uninteresting-username.github.io.shell-extension.zip &&
      rm -f hackastats@first-uninteresting-username.github.io/gschemas.compiled &&
      gnome-extensions pack --force --out-dir $PWD hackastats@first-uninteresting-username.github.io
    '';
  };
  packages = with pkgs; [
    glib
  ];
}
