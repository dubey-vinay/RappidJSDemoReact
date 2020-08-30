/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


var graph = buildGraphFromObject(window.json);

var treeLayout = new joint.layout.TreeLayout({
    graph: graph,
    siblingGap: 18,
    parentGap: 50,
    direction: 'R',
    filter: function(siblings) {
        // Layout will skip elements which have been collapsed
        return siblings.filter(function(sibling) {
            return !sibling.isHidden();
        });
    },
    updateAttributes: function(_, model) {
        // Update some presentation attributes during the layout
        model.toggleButtonVisibility(!graph.isSink(model));
        model.toggleButtonSign(!model.isCollapsed());
    }
});

var paper = new joint.dia.Paper({
    gridSize: 1,
    model: graph,
    // Stop all cell rendering for now
    frozen: true,
    async: true,
    interactive: false,
    sorting: joint.dia.Paper.sorting.APPROX,
    defaultAnchor: { name: 'modelCenter' },
    defaultConnectionPoint: { name: 'boundary' },
    defaultConnector: { name: 'normal' },
    background: { color: '#F3F7F6' },
    viewport: function(view) {
        var model = view.model;
        // Hide elements and links which are currently collapsed
        if (model.isHidden()) return false;
        // Hide elements and links which are not in the viewport
        var bbox = model.getBBox();
        if (model.isLink()) {
            // vertical/horizontal links have zero width/height
            bbox.inflate(1);
        }
        return viewportRect.intersect(bbox);
    }
});

var paperScroller = this.paperScroller = new joint.ui.PaperScroller({
    paper: paper,
    padding: 50,
    cursor: 'grab',
});

document.getElementById('canvas').appendChild(paperScroller.el);
paperScroller.render();
paperScroller.zoom(0.8, { absolute: true });

var toolbar = this.toolbar = new joint.ui.Toolbar({
    theme: 'modern',
    tools: [{
        type: 'zoom-slider',
        min: 10,
        max: 400,
        step: 10,
        value: paperScroller.zoom() * 100
    }, {
        type: 'button',
        name: 'png',
        text: 'Export PNG'
    }],
    references: {
        paperScroller: paperScroller
    }
});

toolbar.on('png:pointerclick', function() {
    // First dump all views that are not in the viewport but keep
    // the collapsed elements hidden
    paper.dumpViews({
        viewport: function(view) {
            return !view.model.isHidden();
        }
    });
    // Now, when all the elements are rendered, export the paper to PNG
    paper.openAsPNG({
        useComputedStyles: false,
        stylesheet: window.paperStyleSheet
    });
});

document.getElementById('tools').appendChild(toolbar.el);
toolbar.render();

// Interactivity

function toggleBranch(root) {
    var shouldHide = !root.isCollapsed();
    root.set({ collapsed: shouldHide });
    graph.getSuccessors(root).forEach(function(successor) {
        successor.set({
            hidden: shouldHide,
            collapsed: false
        });
    });
    layoutAndFocus(viewportRect.center());
}

paper.on('element:collapse', function(view, evt) {
    evt.stopPropagation();
    toggleBranch(view.model);
});

paper.on('blank:pointerdown', function(evt, x, y) {
    paperScroller.startPanning(evt, x, y);
});

// Watch viewport area
var viewportOverlap = 50;
var viewportRect = paperScroller.getVisibleArea().inflate(viewportOverlap);
paperScroller.el.onscroll = function() {
    viewportRect = paperScroller.getVisibleArea().inflate(viewportOverlap);
};

// Render Elements and Links

var start = new Date().getTime();
layoutAndFocus();
paper.unfreeze({
    progress: function(done) {
        if (!done) return;
        log('Layout and Render Time: <b>', new Date().getTime() - start, 'ms</b>');
        log('Number of Cells: <b>', graph.getCells().length, '</b>');
        // remove the progress callback
        paper.unfreeze({ batchSize: 50 });
    }
});

// Helpers

function layoutAndFocus(focusPoint) {
    treeLayout.layout();
    var center = focusPoint || treeLayout.getLayoutBBox().center();
    resizePaper();
    paperScroller.center(center.x, center.y);
}

function resizePaper() {
    paper.fitToContent({
        useModelGeometry: true,
        allowNewOrigin: 'any',
        padding: 30,
        contentArea: treeLayout.getLayoutBBox()
    });
}

function buildGraphFromObject(obj) {
    var cells = [];
    buildCellsFromObject(cells, '', obj);
    var graph = new joint.dia.Graph();
    graph.resetCells(cells);
    return graph;
}

function buildCellsFromObject(cells, rootName, obj, parent) {

    if (!parent) {
        parent = makeElement(rootName);
        parent.attr({
            body: {
                visibility: 'hidden'
            },
            button: {
                width: 20,
                x: 0
            }
        })
        cells.push(parent);
    }

    _.each(obj, function(value, key) {

        var keyElement = makeElement(key);
        cells.push(keyElement);

        if (parent) {
            var link = makeLink(parent, keyElement);
            cells.push(link);
        }

        if (!_.isFunction(value) && (_.isObject(value) || Array.isArray(value))) {
            _.each(value, function(childValue, childKey) {
                var childKeyElement = makeElement(childKey);
                cells.push(childKeyElement);
                var link = makeLink(keyElement, childKeyElement);
                cells.push(link);
                if (!_.isFunction(childValue) && (_.isObject(childValue) || Array.isArray(childValue))) {
                    buildCellsFromObject(cells, rootName, childValue, childKeyElement);
                } else {
                    // Leaf.
                    var grandChildElement = makeElement(childValue);
                    cells.push(grandChildElement);
                    link = makeLink(childKeyElement, grandChildElement);
                    cells.push(link);
                }
            });

        } else {
            // Leaf.
            var childKeyElement = makeElement(value);
            cells.push(childKeyElement);
            link = makeLink(keyElement, childKeyElement);
            cells.push(link);
        }
    });
}

function makeElement(label) {
    return new joint.shapes.collapsible.Model({
        attrs: {
            root: {
                title: label
            },
            label: {
                textWrap: {
                    text: label
                }
            },
        },
        size: {
            width: (typeof label === 'number') ? 27 : 70
        }
    });
}

function makeLink(el1, el2) {
    return new joint.shapes.collapsible.Link({
        source: { id: el1.id },
        target: { id: el2.id }
    });
}

function log() {
    $('<div/>').html(Array.from(arguments).join('')).appendTo('#info');
}
