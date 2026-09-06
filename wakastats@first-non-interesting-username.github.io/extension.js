/* extension.js
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

import GObject from "gi://GObject";
import St from "gi://St";
import Clutter from "gi://Clutter";
import Soup from "gi://Soup?version=3.0";
import GLib from "gi://GLib";

import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const session = new Soup.Session();

async function getToday(baseUrl, apiKey) {
  // Create a request
  const message = Soup.Message.new(
    "GET",
    `${baseUrl}/users/my/statusbar/today?api_key=${apiKey}`,
  );

  const bytes = await session.send_and_read_async(
    message,
    GLib.PRIORITY_DEFAULT,
    null,
  );

  // Error on non ok http response codes
  if (message.get_status() !== Soup.Status.OK)
    throw new Error(`HTTP ${message.get_status()}`);

  // Convert bytes to json
  const text = new TextDecoder().decode(bytes.get_data());
  const json = JSON.parse(text);
  // https://wakatime.com/developers#status_bar or https://hackatime.hackclub.com/api-docs#tag/wakatime-compatibility/GET/api/hackatime/v1/users/{id}/statusbar/today
  return json.data.grand_total.text;
}

// Postion on the top bar
function getPosition(positionInt) {
  if (positionInt === 0) {
    return {
      // Rightmost on the left side
      position: "left",
      index: -1,
    };
  } else if (positionInt === 1) {
    return {
      // Leftmost on the center
      position: "center",
      index: 0,
    };
  } else if (positionInt === 2) {
    return {
      // Leftmost on the right side
      position: "right",
      index: 0,
    };
  }
}

// Check if the file has some key
function hasKey(keyFile, group, key) {
  try {
    keyFile.get_value(group, key);
    return true;
  } catch (e) {
    return false;
  }
}

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init(settings) {
      super._init(0.0, _("Wakastats indicator"));

      this._settings = settings;
      this._label = new St.Label({
        // Displayed before first fetch
        text: "Loading...",
        // Align to the center of the box
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
      });

      this.add_child(this._label);
      this.refresh();
    }
    // Refresh panel
    async refresh() {
      try {
        // Get ~/.wakatime.cfg
        const home = GLib.get_home_dir();
        const configFile = new GLib.KeyFile();
        const filePath = `${home}/.wakatime.cfg`;

        // Load ~/.wakatime.cfg
        let haveFile = true;
        try {
          configFile.load_from_file(filePath, GLib.KeyFileFlags.NONE);
        } catch (e) {
          haveFile = false;
        }

        let apiKey, baseUrl;

        // Assign api key
        if (haveFile && hasKey(configFile, "settings", "api_key")) {
          apiKey = configFile.get_string("settings", "api_key");
        } else {
          apiKey = this._settings.get_string("api-key");
        }

        // Asign base url
        if (haveFile && hasKey(configFile, "settings", "api_url")) {
          baseUrl = configFile.get_string("settings", "api_url");
        } else {
          baseUrl = this._settings.get_string("base-url");
        }

        // Get today stats
        const text = await getToday(baseUrl, apiKey);
        this._label.set_text(text);
      } catch (e) {
        console.error(this.uuid, e);
        // Display that message when there's no connection to the server or api key/base url is declared in a wrong way
        // Might be unhelpful
        this._label.set_text("Server unavailable");
      }
    }
  },
);

export default class IndicatorExampleExtension extends Extension {
  // Restart (or enable) the timer that refreshes the data
  _restartTimer() {
    if (this._timer) {
      GLib.source_remove(this._timer);
      this._timer = null;
    }
    if (!this._settings || !this._indicator) return;

    const interval = this._settings.get_int("refresh-interval");
    this._timer = GLib.timeout_add_seconds(
      GLib.PRIORITY_DEFAULT,
      interval,
      () => {
        this._indicator?.refresh();
        return GLib.SOURCE_CONTINUE;
      },
    );
  }

  // Add the indicator to the panel
  _reposition() {
    if (!this._indicator || !this._settings) return;
    this._indicator.get_parent()?.remove_child(this._indicator);

    const { position, index } = getPosition(this._settings.get_int("position"));
    Main.panel.addToStatusArea(this.uuid, this._indicator, index, position);
  }

  enable() {
    this._settings = this.getSettings();

    // Refresh things when dconf is changed
    this._handlerIds = [
      this._settings.connect("changed::api-key", () =>
        this._indicator?.refresh(),
      ),
      this._settings.connect("changed::base-url", () =>
        this._indicator?.refresh(),
      ),
      this._settings.connect("changed::refresh-interval", () =>
        this._restartTimer(),
      ),
      this._settings.connect("changed::position", () => this._reposition()),
    ];

    this._indicator = new Indicator(this._settings);

    this._reposition();

    this._restartTimer();
  }

  disable() {
    // Delete the timer
    if (this._timer) {
      GLib.source_remove(this._timer);
      this._timer = null;
    }

    this._indicator.destroy();
    this._indicator = null;
    // Close the process that refreshes things in reaction to dconf changes
    for (const id of this._handlerIds) this._settings.disconnect(id);
    this._handlerIds = [];
    this._settings = null;
    session.abort();
  }
}
