/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { dia } from '@clientio/rappid';

import RappidService from 'src/services/rappid.service';
import { Controller } from 'src/rappid/controller';
import * as actions from 'src/rappid/actions';

export class KeyboardController extends Controller {

    startListening() {

        const { keyboard } = this.service;

        this.listenTo(keyboard, {
            'escape': onEscape,
            'delete backspace': onDelete,
            'ctrl+0': onCtrlZero,
            'ctrl+plus': onCtrlPlus,
            'ctrl+minus': onCtrlMinus,
            'ctrl+z': onCtrlZ,
            'ctrl+y': onCtrlY,
            'ctrl+e': onCtrlE,
        });
    }
}

function onEscape(service: RappidService): void {
    actions.setSelection(service, []);
}

function onDelete(service: RappidService): void {
    actions.removeSelection(service);
}

function onCtrlPlus(service: RappidService,  evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomIn(service);
}

function onCtrlMinus(service: RappidService, evt: dia.Event): void {
    evt.preventDefault();
    actions.zoomOut(service);
}

function onCtrlZero(service: RappidService): void {
    actions.zoomToFit(service);
}

function onCtrlZ(service: RappidService): void {
    actions.undoAction(service);
}

function onCtrlY(service: RappidService): void {
    actions.redoAction(service);
}

function onCtrlE(service: RappidService): void {
    actions.exportToPNG(service);
}
