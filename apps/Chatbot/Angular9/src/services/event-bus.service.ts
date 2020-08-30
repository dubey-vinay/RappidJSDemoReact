/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { Injectable } from '@angular/core';
import { Events } from 'backbone';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

interface SharedEvent {
    name: string;
    value: any;
}

@Injectable({
    providedIn: 'root'
})
export class EventBusService {

    constructor() {
        Object.assign(this, Events);
    }

    private _events = new Subject<SharedEvent>();

    events(): Observable<SharedEvent> {
        return this._events.asObservable();
    }

    emit(eventName: string, value?: any): void {
        this._events.next({ name: eventName, value: value });
    }

    on(eventName: string, callback: any): Subscription {
        return this._events.pipe(
            filter(e => e.name === eventName),
            map(e => e.value)
        ).subscribe(callback);
    }
}
