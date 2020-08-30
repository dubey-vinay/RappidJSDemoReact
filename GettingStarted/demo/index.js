/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


// Set a theme (optional - use a theme or custom-style)
// ----------------------------------------------------

joint.setTheme('dark');
//joint.setTheme('material');
//joint.setTheme('modern');
//joint.setTheme('default');

// Graph
// -----

var graph = new joint.dia.Graph;

// Paper & PaperScroller
// ---------------------

var paper = new joint.dia.Paper({
    width: 1000,
    height: 1000,
    gridSize: 10,
    drawGrid: true,
    model: graph, // Set graph as the model for paper
    defaultLink: function(elementView, magnet) {
        return new joint.shapes.standard.Link({
            attrs: { line: { stroke: 'white' }}
        });
    },
    interactive: { linkMove: false },
    snapLinks: { radius: 70 },
    defaultConnectionPoint: { name: 'boundary' }
});

var paperScroller = new joint.ui.PaperScroller({
    paper: paper,
    autoResizePaper: true,
    cursor: 'grab'
});

document.querySelector('.paper-container').appendChild(paperScroller.el);
paperScroller.render().center();

// Custom Shape
// ------------

joint.dia.Element.define('myApp.MyShape', {
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 14,
            fill: '#333333'
        },
        root: {
            magnet: false // Disable the possibility to connect the body of our shape. Only ports can be connected.
        }
    },
    level: 10,
    ports: {
        groups: {
            'in': {
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody',
                    attributes: { r: 12 }
                }],
                z: -1,
                attrs: {
                    portBody: {
                        magnet: true,
                        fill: '#7C68FC'
                    }
                },
                position: { name: 'left' },
                label: { position: { name: 'left' }}
            },
            'out': {
                markup: [{
                    tagName: 'circle',
                    selector: 'portBody',
                    attributes: { r: 12 }
                }],
                z: -1,
                attrs: {
                    portBody: {
                        magnet: true,
                        fill: '#7C68FC'
                    }
                },
                position: { name: 'right' },
                label: { position: { name: 'right' }}
            }
        }
    }
}, {
    markup: [{
        tagName: 'rect',
        selector: 'body'
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});

// Stencil
// -------

var stencil = new joint.ui.Stencil({
    paper: paperScroller,
    scaleClones: true,
    width: 240,
    groups: {
        myShapesGroup1: { index: 1, label: ' My Shapes 1' },
        myShapesGroup2: { index: 2, label: ' My Shapes 2' }
    },
    dropAnimation: true,
    groupsToggleButtons: true,
    search: {
        '*': ['type', 'attrs/label/text']
    },
    layout: true  // Use default Grid Layout
});

document.querySelector('.stencil-container').appendChild(stencil.el);
stencil.render().load({
    myShapesGroup1: [{
        type: 'standard.Rectangle'
    }, {
        type: 'standard.Ellipse'
    }],
    myShapesGroup2: [{
        type: 'standard.Cylinder'
    }, {
        type: 'myApp.MyShape',
        attrs: { label: { text: 'Shape' }},
        ports: { items: [{ group: 'in' }, { group: 'out' }, { group: 'out' }] }
    }]
});

// Inspector
// --------

paper.on('element:pointerclick', function(elementView) {
    joint.ui.Inspector.create('.inspector-container', {
        cell: elementView.model,
        inputs: {
            'attrs/label/text': {
                type: 'text',
                label: 'Label',
                group: 'basic',
                index: 1
            },
            level: {
                type: 'range',
                min: 1,
                max: 10,
                unit: 'x',
                defaultValue: 6,
                label: 'Level',
                group: 'advanced',
                index: 2
            }
        },
        groups: {
            basic: {
                label: 'Basic',
                index: 1
            },
            advanced: {
                label: 'Advanced',
                index: 2
            }
        }
    });
});

// Halo
// ----

paper.on('element:pointerclick', function(elementView) {
    var handles = [{
        name: 'remove',
        position: 'nw',
        events: { pointerdown: 'removeElement' }
    }, {
        name: 'myCustomAction',
        position: 'ne',
        icon: 'data:image/gif;base64,R0lGODlhEAAQAMQAAORHHOVSKudfOulrSOp3WOyDZu6QdvCchPGolfO0o/XBs/fNwfjZ0frl3/zy7////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAkAABAALAAAAAAQABAAAAVVICSOZGlCQAosJ6mu7fiyZeKqNKToQGDsM8hBADgUXoGAiqhSvp5QAnQKGIgUhwFUYLCVDFCrKUE1lBavAViFIDlTImbKC5Gm2hB0SlBCBMQiB0UjIQA7'
    }];
    if (!elementView.model.hasPorts()) {
        // Only shapes without ports will have the "link" handle in the Halo control panel. Shapes with ports can be connected by "dragging" ports.
        handles.push({
            name: 'link',
            position: 'e',
            events: { pointerdown: 'startLinking', pointermove: 'doLink', pointerup: 'stopLinking' }
        });
    }
    var halo = new joint.ui.Halo({
        cellView: elementView,
        handles: handles
    }).render();

    halo.on('action:myCustomAction:pointerdown', function(evt) {
        alert('My Control Button Clicked!');
    });
});

// Link Tools
// ----------

paper.on('link:pointerup', function(linkView) {
    paper.removeTools();
    var toolsView = new joint.dia.ToolsView({
        name: 'my-link-tools',
        tools: [
            new joint.linkTools.Vertices(),
            new joint.linkTools.SourceArrowhead(),
            new joint.linkTools.TargetArrowhead(),
            new joint.linkTools.Segments,
            new joint.linkTools.Remove({ offset: -20, distance: 40 })
        ]
    });
    linkView.addTools(toolsView);
});

paper.on('blank:pointerdown', function() {
    paper.removeTools();
});

// Toolbar
// -------

var toolbar = new joint.ui.Toolbar({
    groups: {
        clear: { index: 1 },
        zoom: { index: 2 }
    },
    tools: [
        { type: 'button', name: 'clear', group: 'clear', text: 'Clear Diagram' },
        { type: 'zoom-out', name: 'zoom-out', group: 'zoom' },
        { type: 'zoom-in', name: 'zoom-in', group: 'zoom' }
    ],
    references: {
        paperScroller: paperScroller // built in zoom-in/zoom-out control types require access to paperScroller instance
    }
});

toolbar.on({
    'clear:pointerclick': graph.clear.bind(graph)
});

document.querySelector('.toolbar-container').appendChild(toolbar.el);
toolbar.render();


// Working With Diagrams Programmatically
// --------------------------------------

// Add new element to the graph.
var myShape = new joint.shapes.myApp.MyShape({
    size: { width: 100, height: 100 },
    position: { x: 50, y: 50 },
    attrs: { label: { text: 'My Shape' }},
    level: 3,
    ports: { items: [{ id: 'in1', group: 'in' }, { group: 'out', id: 'out1' }] }
});
graph.addCell(myShape);

// Get element from the graph and change its properties.
myShape = graph.getElements()[0];
myShape.prop('attrs/label/text', 'My Updated Shape');
myShape.prop('size/width', 150);
myShape.prop('level', 2);
myShape.prop('attrs/body/fill', '#FE854F');

// Create a clone of an element.
var myShape2 = myShape.clone();
myShape2.translate(400, 0);
graph.addCell(myShape2);

// Create a link that connects two elements.
var myLink = new joint.shapes.standard.Link({
    attrs: { line: { stroke: 'white' }},
    source: { id: myShape.id, port: 'out1' },
    target: { id: myShape2.id, port: 'in1' }
});
graph.addCell(myLink);

// React on changes in the graph.
graph.on('change add remove', function() {
    var diagramJsonString = JSON.stringify(graph.toJSON());
    console.log('Diagram JSON', diagramJsonString);
});
graph.on('change:level', function(cell, level) {
    var color = (level > 8) ? 'red' : 'white';
    cell.prop('attrs/body/fill', color);
});
