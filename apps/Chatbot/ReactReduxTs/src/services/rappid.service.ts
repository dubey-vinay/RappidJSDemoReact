/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { dia, ui } from '@clientio/rappid';

import { Controller } from 'src/rappid/controller';
import { createPlugins } from 'src/rappid/plugins';
import { RappidController, KeyboardController } from 'src/rappid/controllers';
import { actionCreator } from '../redux/helpers/actionCreator';
import { STORE_RAPPID } from '../redux/helpers/actionTypes';

const RAPPID_SCOPE_CLASS_NAME = 'rappid-scope';

export class RappidService {

    public controllers: { rappid: Controller, keyboard: Controller };
    public graph: dia.Graph;
    public history: dia.CommandManager;
    public keyboard: ui.Keyboard;
    public paper: dia.Paper;
    public selection: dia.Cell[] = [];
    public scroller: ui.PaperScroller;
    public stencil: ui.Stencil;
    public toolbar: ui.Toolbar;
    public tooltip: ui.Tooltip;

    constructor(
        private scopeElement: Element,
        paperElement: Element,
        stencilElement: Element,
        toolbarElement: Element,
        public readonly dispatch: Function,
    ) {
        scopeElement.classList.add(RAPPID_SCOPE_CLASS_NAME);
        Object.assign(this, createPlugins(scopeElement, paperElement, stencilElement, toolbarElement));
        this.controllers = {
            rappid: new RappidController(this),
            keyboard: new KeyboardController(this)
        };
        this.dispatch(actionCreator(STORE_RAPPID, this));
    }

    public destroy(): void {
        const { paper, scroller, stencil, toolbar, tooltip, controllers, scopeElement } = this;
        paper.remove();
        scroller.remove();
        stencil.remove();
        toolbar.remove();
        tooltip.remove();
        Object.keys(controllers).forEach(name => controllers[name].stopListening());
        scopeElement.classList.remove(RAPPID_SCOPE_CLASS_NAME);
    }
}

export default RappidService;
