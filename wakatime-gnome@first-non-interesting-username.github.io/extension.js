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
import Gio from 'gi://Gio';


import {
  Extension,
  gettext as _,
} from "resource:///org/gnome/shell/extensions/extension.js";
import * as PanelMenu from "resource:///org/gnome/shell/ui/panelMenu.js";
import * as PopupMenu from "resource:///org/gnome/shell/ui/popupMenu.js";

import * as Main from "resource:///org/gnome/shell/ui/main.js";

const session = new Soup.Session();

async function getToday(baseUrl, apiKey) {
  const message = Soup.Message.new(
    "GET",
    `${baseUrl}/users/my/statusbar/today?api_key=${apiKey}`,
  );

  const bytes = await session.send_and_read_async(
    message,
    GLib.PRIORITY_DEFAULT,
    null,
  );

  if (message.get_status() !== Soup.Status.OK)
    throw new Error(`HTTP ${message.get_status()}`);

  const text = new TextDecoder().decode(bytes.get_data());
  const json = JSON.parse(text);
  return json.data.grand_total.text;
}

function getPosition(positionInt) {
  if (positionInt === 0) {
    return {
      position: 'left',
      index: -1
    }
  } else if (positionInt === 1) {
    return {
      position: 'center',
      index: 0
    }
  } else if (positionInt === 2) {
    return {
      position: 'right',
      index: 0
    }
  }

}

const Indicator = GObject.registerClass(
  class Indicator extends PanelMenu.Button {
    _init(settings) {
      super._init(0.0, _("Wakatime gnome indicator"));

      this._settings = settings;
      this._label = new St.Label({
        text: "Loading...",
        x_align: Clutter.ActorAlign.CENTER,
        y_align: Clutter.ActorAlign.CENTER,
      });

      this.add_child(this._label);
      this.refresh();
    }
    async refresh() {
      try {
        const baseUrl = this._settings.get_string('base-url');
        const apiKey = this._settings.get_string('api-key');
        const text = await getToday(baseUrl, apiKey);
        this._label.set_text(text);
      } catch (e) {
        console.error(this.uuid, e);
        this._label.set_text("Server unavailable");
      }
    }
  },
);

export default class IndicatorExampleExtension extends Extension {
  enable() {
    this._settings = this.getSettings();

    this._handlerIds = [
       this._settings.connect('changed::api-key', () => this._indicator?.refresh()),
       this._settings.connect('changed::base-url', () => this._indicator?.refresh()),
       this._settings.connect('changed::refresh-interval', () => this._restartTimer()),
       this._settings.connect('changed::position', () => this._reposition()),
     ];

    this._indicator = new Indicator(this._settings);

    const positionInt = this._settings.get_int('position');
    const { position, index } = getPosition(positionInt);

    const interval = this._settings.get_int('refresh-interval');

    Main.panel.addToStatusArea(this.uuid, this._indicator, index, position);
    this._timer = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, interval, () => {
      this._indicator?.refresh();
      return GLib.SOURCE_CONTINUE;
    });
  }

  disable() {
    if (this._timer) {
      GLib.source_remove(this._timer);
      this._timer = null;
    }

    this._indicator.destroy();
    this._indicator = null;
    for (const id of this._handlerIds)
      this._settings.disconnect(id);
    this._handlerIds = [];
    this._settings = null;
    session.abort();
  }
}
