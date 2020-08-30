/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


(function(joint) {

    var Container = joint.dia.Element.define('app.Container', {
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                strokeWidth: 2,
                stroke: '#000000',
                fill: '#FFFFFF',
                rx: 5,
                ry: 5,
                cursor: 'default'
            },
            grid: {
                strokeWidth: 1,
                stroke: '#000000',
                fill: '#FFFFFF',
                pointerEvents: 'none'
            },
            label: {
                fontFamily: 'sans-serif',
                textVerticalAnchor: 'middle',
                textAnchor: 'middle',
                refX: '50%',
                refY: 20,
                fontSize: 14,
                fill: '#333333',
                style: { textTransform: 'uppercase' },
                pointerEvents: 'none'
            }
        },
        z: 1
    }, {
        markup: [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'path',
            selector: 'grid'
        }, {
            tagName: 'text',
            selector: 'label'
        }]
    }, {
        isContainer(el) {
            return el.get('type') === 'app.Container';
        }
    });

    var Child = joint.shapes.standard.Rectangle.define('app.Child', {
        z: 2,
        attrs: {
            label: {
                fontFamily: 'sans-serif'
            }
        }
    });

    var Link = joint.shapes.standard.Link.define('app.Link', {
        z: -1,
        attrs: {
            line: {
                targetMarker: {
                    'type': 'circle',
                    'r': 4,
                    'cx': 2,
                    'fill': '#FFFFFF',
                    'stroke-width': 2
                }
            }
        }
    });

    var structure = {
        label: 'a1',
        children: [{
            label: 'b1',
            embeds: ['e1', 'e2', 'e3'],
            children: [{
                label: 'c1',
                embeds: ['d1', 'd2', 'd3']
            }, {
                label: 'c2',
                embeds: ['d4', 'd5', 'd6']
            }]
        }, {
            label: 'b2',
            children: [{
                label: 'c3',
                embeds: ['d7', 'd8', 'd9', 'd10', 'd11']
            }]
        }]
    };

    var graph = new joint.dia.Graph;
    var paper = new joint.dia.Paper({
        el: document.getElementById('paper'),
        width: '100%',
        height: '100%',
        gridSize: 1,
        async: true,
        interactive: false,
        model: graph,
        sorting: joint.dia.Paper.sorting.APPROX,
        defaultConnectionPoint: { name: 'anchor' }
    });

    console.time('layout');
    paper.freeze();
    createCells(structure, graph);
    layoutCells(graph);
    paper.unfreeze();
    console.timeEnd('layout');

    function rescale() {
        paper.scaleContentToFit({ padding: 50, useModelGeometry: true });
    }

    window.addEventListener('resize', joint.util.debounce(rescale), false);
    rescale();

    paper.on('element:pointermove', function(view, evt, x, y) {
        var model = view.model;
        if (!model.isEmbedded()) return;
        var data = evt.data;
        var ghost = data.ghost;
        if (!ghost) {
            var position = model.position();
            ghost = view.vel.clone();
            ghost.node.style.transition = '0.2s opacity';
            ghost.appendTo(this.viewport);
            evt.data.ghost = ghost;
            evt.data.dx = x - position.x;
            evt.data.dy = y - position.y;
        }
        ghost.attr('opacity', findContainerFromPoint(this.model, x, y) ? 0.9 : 0.2);
        ghost.attr('transform', 'translate(' + [x - data.dx, y - data.dy] + ')');
    });

    paper.on('element:pointerup', function(view, evt, x, y) {
        var data = evt.data;
        if (!data.ghost) return;
        data.ghost.remove();
        var model = view.model;
        var graph = this.model;
        var newParent = findContainerFromPoint(graph, x, y);
        if (!newParent) return;
        var parent = model.getParentCell();
        this.freeze();
        if (parent) parent.unembed(model);
        newParent.embed(model);
        layoutCells(graph);
        this.unfreeze();
        rescale();
    });

    function findContainerFromPoint(graph, x, y) {
        var modelsFromPoint = graph.findModelsFromPoint({ x: x, y: y });
        return modelsFromPoint.filter(Container.isContainer)[0];
    }

    function rnd(min, max) {

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function rndColor() {

        return 'hsl(' + rnd(171, 181) + ',' + rnd(58, 72) + '%,' + rnd(45, 55) + '%)';
    }

    function createCells(struct, graph) {

        var label = struct.label
        var children = struct.children || []
        var embeds = struct.embeds || [];
        var root = new Container({
            attrs: {
                label: {
                    text: label,
                    fill: 'yellow'
                },
                body: {
                    fill: rndColor()
                }
            }
        });
        root.addTo(graph);

        if (embeds.length > 0) {
            embeds.forEach(function(text) {
                var embed = new Child({
                    attrs: {
                        label: {
                            text: text,
                            fill: 'yellow'
                        },
                        body: {
                            fill: rndColor()
                        }
                    }
                });
                embed.resize(40, 40);
                embed.addTo(graph);
                root.embed(embed);
            });

        } else {
            root.resize(60, 60);
        }

        if (children.length > 0) {
            children.forEach(function(childStruct) {
                var child = createCells(childStruct, graph);
                var link = new Link();
                link.source(root, { anchor: { name: 'bottom', args: { dy: -20 }}});
                link.target(child, { anchor: { name: 'top' }});
                link.addTo(graph);
            });
        }

        return root;
    }

    function gridPathData(metrics, offset, padding) {
        var bbox = metrics.bbox;
        var x = bbox.x + offset.left;
        var y = bbox.y + offset.top;
        var w = bbox.width;
        var h = bbox.height;
        // Boundary of embedded cells
        var data = [
            'M',
            x - padding, y - padding,
            x + w + padding, y - padding,
            x + w + padding, y + h + padding,
            x - padding, y + h + padding,
            'Z'
        ];
        var gridX = metrics.gridX;
        var gridY = metrics.gridY;
        gridX.forEach(function(gx, index, gridX) {
        // Skip the first and last line
            if (index === 0 || index === gridX.length -1) return;
            data.push('M', gx + x, y - padding, gx + x, y + h + padding);
        });
        gridY.forEach(function(gy, index, gridY) {
        // Skip the first and last line
            if (index === 0 || index === gridY.length -1) return;
            data.push('M', x - padding, gy + y, x + w + padding, gy + y);
        });
        return data.join(' ');
    }

    function layoutCells(graph) {

        var directedGraphCells = graph.getLinks();

        graph.getElements().forEach(function(container) {

            if (!Container.isContainer(container)) return;
            directedGraphCells.push(container);

            var embeds = container.getEmbeddedCells();
            var embedsCount = embeds.length;
            if (embedsCount === 0) {
                container.attr(['grid', 'd'], 'M 5 35 45 35');
                container.resize(50, 40);
                return;
            }

            var padding = { horizontal: 10, bottom: 10, top: 40 };
            var metrics = joint.layout.GridLayout.layout(embeds, {
                columns: Math.ceil(embedsCount / 2),
                columnGap: 10,
                rowGap: 10
            });
            container.fitEmbeds({ padding: padding });
            container.attr(['grid', 'd'], gridPathData(metrics, joint.util.normalizeSides(padding), 5));
        });

        joint.layout.DirectedGraph.layout(directedGraphCells, {
            setPosition: function(el, center) {
                const size = el.size();
                el.position(center.x - size.width / 2, center.y - size.height / 2, { deep: true });
            }
        });
    }

})(joint);

