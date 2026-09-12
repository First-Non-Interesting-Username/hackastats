/* prefs.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import Adw from "gi://Adw";
import Gtk from "gi://Gtk";

import {
  ExtensionPreferences,
  gettext as _,
} from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class MyExtensionPreferences extends ExtensionPreferences {
  fillPreferencesWindow(window) {
    const settings = this.getSettings();

    window.set_default_size(660, 720);
    window.set_search_enabled(true);

    const page = new Adw.PreferencesPage({
      title: _("Settings"),
      icon_name: "preferences-system-symbolic",
    });
    window.add(page);

    const wakatime = new Adw.PreferencesGroup({
      title: _("Wakatime"),
      description: _(
        "Settings related to wakatime connection. Overwritten by `~/.wakatime.cfg`.",
      ),
    });
    page.add(wakatime);

    const apiKey = new Adw.EntryRow({
      title: _("Wakatime API key"),
    });
    wakatime.add(apiKey);

    const baseUrl = new Adw.EntryRow({
      title: _("Wakatime base URL"),
    });
    wakatime.add(baseUrl);

    apiKey.set_text(settings.get_string("api-key"));
    apiKey.connect("notify::text", () => {
      settings.set_string("api-key", apiKey.get_text());
    });

    baseUrl.set_text(settings.get_string("base-url"));
    baseUrl.connect("notify::text", () => {
      settings.set_string("base-url", baseUrl.get_text());
    });

    const appearance = new Adw.PreferencesGroup({
      title: _("Appearance"),
    });
    page.add(appearance);

    const position = new Adw.ComboRow({
      title: _("Panel position"),
      model: new Gtk.StringList({
        strings: [_("Left"), _("Center"), _("Right")],
      }),
    });
    appearance.add(position);

    position.set_selected(settings.get_int("position"));
    position.connect("notify::selected", () => {
      settings.set_int("position", position.selected);
    });

    const misc = new Adw.PreferencesGroup({
      title: _("Misc"),
    });
    page.add(misc);

    const refreshInterval = new Adw.SpinRow({
      title: _("Refresh interval (seconds)"),
      adjustment: new Gtk.Adjustment({
        lower: 5,
        upper: 3600,
        step_increment: 5,
        page_increment: 30,
        value: settings.get_int("refresh-interval"),
      }),
    });
    misc.add(refreshInterval);

    refreshInterval.connect("notify::value", () => {
      settings.set_int(
        "refresh-interval",
        Math.round(refreshInterval.get_value()),
      );
    });
  }
}
