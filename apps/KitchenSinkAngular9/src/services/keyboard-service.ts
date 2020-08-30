/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import * as joint from '@clientio/rappid';
import * as _ from 'lodash';

export class KeyboardService {

    keyboard: joint.ui.Keyboard;

    constructor() {
        this.keyboard = new joint.ui.Keyboard();
    }

    create(
        graph: joint.dia.Graph,
        clipboard: joint.ui.Clipboard,
        selection: joint.ui.Selection,
        paperScroller: joint.ui.PaperScroller,
        commandManager: joint.dia.CommandManager
    ) {

        this.keyboard.on({

            'ctrl+c': () => {

                // Copy all selected elements and their associated links.
                clipboard.copyElements(selection.collection, graph);
            },

            'ctrl+v': () => {

                const pastedCells = clipboard.pasteCells(graph, {
                    translate: { dx: 20, dy: 20 },
                    useLocalStorage: true
                });

                const elements = _.filter(pastedCells, cell => cell.isElement());

                // Make sure pasted elements get selected immediately. This makes the UX better as
                // the user can immediately manipulate the pasted elements.
                selection.collection.reset(elements);
            },

            'ctrl+x shift+delete': () => {
                clipboard.cutElements(selection.collection, graph);
            },

            'delete backspace': (evt: JQuery.Event) => {
                evt.preventDefault();
                graph.removeCells(selection.collection.toArray());
            },

            'ctrl+z': () => {
                commandManager.undo();
                selection.cancelSelection();
            },

            'ctrl+y': () => {
                commandManager.redo();
                selection.cancelSelection();
            },

            'ctrl+a': () => {
                selection.collection.reset(graph.getElements());
            },

            'ctrl+plus': (evt: JQuery.Event) => {
                evt.preventDefault();
                paperScroller.zoom(0.2, { max: 5, grid: 0.2 });
            },

            'ctrl+minus': (evt: JQuery.Event) => {
                evt.preventDefault();
                paperScroller.zoom(-0.2, { min: 0.2, grid: 0.2 });
            },

            'keydown:shift': (evt: JQuery.Event) => {
                paperScroller.setCursor('crosshair');
            },

            'keyup:shift': () => {
                paperScroller.setCursor('grab');
            }
        });
    }
}
