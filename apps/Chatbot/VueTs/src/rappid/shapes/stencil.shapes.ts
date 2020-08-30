/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { dia, shapes } from '@clientio/rappid';
import { ObjectHash } from 'backbone';

import {
    FONT_FAMILY,
    PADDING_L,
    LIGHT_COLOR,
    MAIN_COLOR,
    MESSAGE_ICON,
} from 'src/theme';

export enum ShapeTypesEnum {
    MESSAGE = 'stencil.Message',
    FLOWCHART_START = 'stencil.FlowchartStart',
    FLOWCHART_END = 'stencil.FlowchartEnd',
}

const SHAPE_SIZE = 48;

const FlowchartStart = dia.Element.define(ShapeTypesEnum.FLOWCHART_START, {
    name: 'FlowchartStart',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            d: 'M 2 8 L 4.29 5.71 L 1.41 2.83 L 2.83 1.41 L 5.71 4.29 L 8 2 L 8 8 Z M -2 8 L -8 8 L -8 2 L -5.71 4.29 L -1 -0.41 L -1 -8 L 1 -8 L 1 0.41 L -4.29 5.71 Z',
            fill: '#FFFFFF',
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'Start',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

const FlowchartEnd = dia.Element.define(ShapeTypesEnum.FLOWCHART_END, {
    name: 'FlowchartEnd',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: MAIN_COLOR,
            stroke: 'none',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            d: 'M 5 -8.45 L 6.41 -7.04 L 3 -3.635 L 1.59 -5.04 Z M -4.5 3.95 L -1 3.95 L -1 -1.63 L -6.41 -7.04 L -5 -8.45 L 1 -2.45 L 1 3.95 L 4.5 3.95 L 0 8.45 Z',
            fill: '#FFFFFF',
            refX: '50%',
            refY: '50%'
        },
        label: {
            text: 'End',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        },
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'path',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }],
});

const Message = dia.Element.define(ShapeTypesEnum.MESSAGE, {
    name: 'Message',
    size: { width: SHAPE_SIZE, height: SHAPE_SIZE },
    attrs: {
        body: {
            fill: LIGHT_COLOR,
            stroke: '#E8E8E8',
            refCx: '50%',
            refCy: '50%',
            refR: '50%'
        },
        icon: {
            width: 20,
            height: 20,
            refX: '50%',
            refY: '50%',
            x: -10,
            y: -10,
            xlinkHref: MESSAGE_ICON
        },
        label: {
            text: 'Component',
            refDx: PADDING_L,
            refY: '50%',
            textAnchor: 'start',
            textVerticalAnchor: 'middle',
            fill: '#242424',
            fontFamily: FONT_FAMILY,
            fontSize: 13
        }
    }
} as ObjectHash, {
    markup: [{
        tagName: 'circle',
        selector: 'body'
    }, {
        tagName: 'image',
        selector: 'icon'
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});

Object.assign(shapes, {
    stencil: {
        Message,
        FlowchartStart,
        FlowchartEnd,
    }
});
