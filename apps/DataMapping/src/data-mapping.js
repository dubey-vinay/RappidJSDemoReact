/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


'use strict';

joint.setTheme('material');

var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
    el: document.getElementById('paper'),
    model: graph,
    width: '100%',
    height: '100%',
    gridSize: 10,
    background: { color: '#f6f6f6' },
    magnetThreshold: 'onleave',
    moveThreshold: 5,
    clickThreshold: 5,
    linkPinning: false,
    sorting: joint.dia.Paper.sorting.APPROX,
    interactive: {
        linkMove: false,
        elementMove: false
    },
    markAvailable: true,
    snapLinks: { radius: 40 },
    defaultRouter: {
        name: 'mapping',
        args: { padding: 30 }
    },
    defaultConnectionPoint: { name: 'anchor' },
    defaultAnchor: { name: 'mapping' },
    defaultConnector: {
        name: 'jumpover',
        args: { jump: 'cubic' }
    },
    highlighting: {
        magnetAvailability: {
            name: 'addClass',
            options: {
                className: 'record-item-available'
            }
        },
        connecting: {
            name: 'stroke',
            options: {
                padding: 8,
                attrs: {
                    'stroke': 'none',
                    'fill': '#7c68fc',
                    'fill-opacity': 0.2
                }
            }
        }
    },
    defaultLink: function() {
        return new joint.shapes.mapping.Link();
    },
    validateConnection: function(sv, sm, tv, tm, end) {
        if (sv === tv) return false;
        if (sv.model.isLink() || tv.model.isLink()) return false;
        if (end === 'target') return tv.model.getItemSide(tv.findAttribute('item-id', tm)) !== 'right';
        return sv.model.getItemSide(sv.findAttribute('item-id', sm)) !== 'left';
    }
});

// User Interactions

paper.on('link:mouseenter', function(linkView) {
    this.removeTools();
    showLinkTools(linkView);
})

paper.on('link:mouseleave', function() {
    this.removeTools();
});


paper.on('element:magnet:pointerdblclick', function(elementView, evt, magnet) {
    evt.stopPropagation();
    itemEditAction(elementView.model, elementView.findAttribute('item-id', magnet));
});

paper.on('element:contextmenu', function(elementView, evt) {
    var tools = elementView.model.getTools();
    if (tools) {
        evt.stopPropagation();
        elementActionPicker(elementView.el, elementView, tools);
    }
});

paper.on('element:magnet:contextmenu', function(elementView, evt, magnet) {
    var itemId = elementView.findAttribute('item-id', magnet);
    var tools = elementView.model.getItemTools(itemId);
    if (tools) {
        evt.stopPropagation();
        itemActionPicker(magnet, elementView, elementView.findAttribute('item-id', magnet), tools);
    }
});

paper.on('element:pointerclick', function(elementView) {
    showElementTools(elementView);
});

paper.on('element:pointermove', function(view, evt, x, y) {
    var data = evt.data;
    var ghost = data.ghost;
    if (!ghost) {
        var position = view.model.position();
        ghost = view.vel.clone();
        ghost.attr('opacity', 0.3);
        ghost.appendTo(this.viewport);
        evt.data.ghost = ghost;
        evt.data.dx = x - position.x;
        evt.data.dy = y - position.y;
    }
    ghost.attr('transform', 'translate(' + [x - data.dx, y - data.dy] + ')');
});

paper.on('element:pointerup', function(view, evt, x, y) {
    var data = evt.data;
    if (data.ghost) {
        data.ghost.remove();
        view.model.position(x - data.dx, y - data.dy);
    }
});

// Actions

function showElementTools(elementView) {
    var element = elementView.model;
    var transform = new joint.ui.FreeTransform({
        cellView: elementView,
        allowRotation: false
    });
    transform.render();
    transform.listenTo(element, 'change', updateMinSize);
    updateMinSize();

    function updateMinSize() {
        var minSize = element.getMinimalSize();
        transform.options.minHeight = minSize.height;
        transform.options.minWidth = minSize.width;
    }
}

function showLinkTools(linkView) {
    var tools = new joint.dia.ToolsView({
        tools: [
            new joint.linkTools.mapping.SourceArrowhead(),
            new joint.linkTools.mapping.TargetArrowhead(),
            new joint.linkTools.mapping.Remove({
                distance: '25%',
                action: function() {
                    linkAction(this.model);
                }
            })
        ]
    });
    linkView.addTools(tools);
}

function itemActionPicker(target, elementView, itemId, tools) {

    var element = elementView.model;
    var toolbar = new joint.ui.ContextToolbar({
        target: target,
        padding: 5,
        vertical: true,
        tools: tools
    });

    toolbar.render();
    toolbar.on({
        'action:remove': function() {
            element.removeItem(itemId);
            element.removeInvalidLinks();
            toolbar.remove();
        },
        'action:edit': function() {
            toolbar.remove();
            itemEditAction(element, itemId);
        },
        'action:add-child': function() {
            toolbar.remove();
            element.addItemAtIndex(itemId, Infinity, element.getDefaultItem());
            if (element.isItemCollapsed(itemId)) element.toggleItemCollapse(itemId);
        },
        'action:add-next-sibling': function() {
            toolbar.remove();
            element.addNextSibling(itemId, element.getDefaultItem());
        },
        'action:add-prev-sibling': function() {
            toolbar.remove();
            element.addPrevSibling(itemId, element.getDefaultItem());
        }
    });
}

function elementActionPicker(target, elementView, tools) {

    var element = elementView.model
    var toolbar = new joint.ui.ContextToolbar({
        target: target,
        padding: 5,
        vertical: true,
        tools: tools
    });

    toolbar.render();
    toolbar.on({
        'action:remove': function() {
            toolbar.remove();
            element.remove();
        },
        'action:add-item': function() {
            toolbar.remove();
            element.addItemAtIndex(0, Infinity, element.getDefaultItem());
        }
    });
}

function itemEditAction(element, itemId) {

    var config = element.getInspectorConfig(itemId);
    if (!config) return;

    var inspector = new joint.ui.Inspector({
        cell: element,
        live: false,
        inputs: joint.util.setByPath({}, element.getItemPathArray(itemId), config)
    });

    inspector.render();
    inspector.el.style.position = 'relative';
    inspector.el.style.overflow = 'hidden';

    var dialog = new joint.ui.Dialog({
        width: 300,
        title: 'Edit Item',
        closeButton: false,
        content: inspector.el,
        buttons: [{
            content: 'Cancel',
            action: 'cancel'
        }, {
            content: '<span style="color:#fe854f">Change</span>',
            action: 'change'
        }]
    });

    dialog.open();
    dialog.on({
        'action:cancel': function() {
            inspector.remove();
            dialog.close();
        },
        'action:change': function() {
            inspector.updateCell();
            inspector.remove();
            dialog.close();
        }
    });

    var input = inspector.el.querySelector('[contenteditable]');
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(input);
    selection.removeAllRanges();
    selection.addRange(range);
}

function linkAction(link) {

    var dialog = new joint.ui.Dialog({
        title: 'Confirmation',
        width: 300,
        content: 'Are you sure you want to delete this link?',
        buttons: [
            { action: 'cancel', content: 'Cancel' },
            { action: 'remove', content: '<span style="color:#fe854f">Remove</span>' }
        ]
    });

    dialog.open();
    dialog.on({
        'action:remove': function() {
            link.remove();
            dialog.remove();
        },
        'action:cancel': function() {
            dialog.remove();
        }
    });
}

