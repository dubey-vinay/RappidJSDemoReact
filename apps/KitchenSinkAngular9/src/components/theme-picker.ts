/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import * as joint from '@clientio/rappid';
import * as _ from 'lodash';

namespace ThemePicker {

    export interface Options extends joint.mvc.ViewOptions<undefined> {
        tools: Array<{ [key: string]: any }>;
    }

    export interface MainView {
        commandManager: joint.dia.CommandManager;
        paper: joint.dia.Paper;
        graph: joint.dia.Graph;
    }
}

export class ThemePicker extends joint.ui.Toolbar {

    constructor(options: { mainView: ThemePicker.MainView }) {

        super({
            className: _.result(joint.ui.Toolbar.prototype, 'className') + ' theme-picker'
        });

        this.mainView = options.mainView;
    }

    options: ThemePicker.Options;
    mainView: ThemePicker.MainView;

    init() {

        const options = [
            { value: 'modern', content: 'Modern' },
            { value: 'dark', content: 'Dark' },
            { value: 'material', content: 'Material' }
        ];

        const themes = {
            type: 'select-button-group',
            name: 'theme-picker',
            multi: false,
            selected: _.findIndex(options, { value: this.defaultTheme }),
            options,
            attrs: {
                '.joint-select-button-group': {
                    'data-tooltip': 'Change Theme',
                    'data-tooltip-position': 'bottom'
                }
            }
        };

        this.options.tools = [themes];
        this.on('theme-picker:option:select', this.onThemeSelected, this);

        super.init();
    }

    onThemeSelected(option: any) {

        joint.setTheme(option.value);
        if (this.mainView) {
            this.adjustAppToTheme(this.mainView, option.value);
        }
    }

    adjustAppToTheme(app: ThemePicker.MainView, theme: string) {


        // Make the following changes silently without the command manager notice.
        app.commandManager.stopListening();

        // Links in the dark theme would not be visible on the dark background.
        // Note that this overrides custom color
        const linkColor = (theme === 'dark' ? '#f6f6f6' : '#222138');

        const themedLinks = app.graph.getLinks();
        const defaultLink = app.paper.options.defaultLink;
        if (defaultLink instanceof joint.dia.Link) {
            themedLinks.push(defaultLink);
        }

        themedLinks.forEach(function(link: joint.dia.Link) {
            link.attr({
                '.connection': { 'stroke': linkColor },
                '.marker-target': { 'fill': linkColor },
                '.marker-source': { 'fill': linkColor }
            });
        });

        // Material design has no grid shown.
        if (theme === 'material') {
            app.paper.options.drawGrid = false;
            app.paper.clearGrid();
        } else {
            app.paper.options.drawGrid = true;
            app.paper.drawGrid();
        }

        app.commandManager.listen();
    }
}
