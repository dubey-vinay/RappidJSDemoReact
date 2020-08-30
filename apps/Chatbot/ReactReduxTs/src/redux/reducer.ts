/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { dia } from '@clientio/rappid';

import { SharedEvents } from 'src/rappid/controller';
import RappidService from 'src/services/rappid.service';
import { STORE_RAPPID } from 'src/redux/helpers/actionTypes';

export interface State {
    rappid: RappidService;
    graphJSON: Object;
    selection: dia.Cell[];
}

const initialState: State = {
    rappid: null as RappidService,
    graphJSON: {},
    selection: []
};

const reducer = (state = initialState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case STORE_RAPPID:
            return {
                ...state,
                rappid: action.payload
            };
        case SharedEvents.GRAPH_CHANGED:
            return {
                ...state,
                graphJSON: action.payload
            };
        case SharedEvents.SELECTION_CHANGED:
            return {
                ...state,
                selection: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
