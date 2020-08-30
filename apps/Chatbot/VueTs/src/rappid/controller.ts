/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { Events } from 'backbone';
import RappidService from 'src/services/rappid.service';

export enum SharedEvents {
    JSON_EDITOR_CHANGED = 'json-editor-changed',
    SELECTION_CHANGED = 'selection-changed',
    GRAPH_CHANGED = 'graph-changed',
    GRAPH_START_BATCH = 'graph-start-batch',
    GRAPH_STOP_BATCH = 'graph-stop-batch',
}

type ControllerCallback = (service: RappidService, ...args: any[]) => void;

interface ControllerEventMap {
    [eventName: string]: ControllerCallback;
}

export abstract class Controller {

    constructor(public readonly service: RappidService) {
        this.startListening();
    }

    abstract startListening(): void;

    stopListening(): void {
        Events.stopListening.call(this);
    }

    protected listenTo(object: any, events: ControllerEventMap): void {
        Object.keys(events).forEach(event => {
            const callback = events[event];
            if (typeof callback !== 'function') return;
            // Invoke the callback with the service argument passed first
            Events.listenTo.call(this, object, event, callback.bind(null, this.service));
        });
    }
}
