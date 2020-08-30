/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


'use strict';

(function(joint, g) {

    var DEFAULT_PADDING = 10;

    function getOutsidePoint(bbox, angle, anchor, padding) {
        var ref = anchor.clone();
        var center = bbox.center();
        if (angle) ref.rotate(center, angle);
        var point = new g.Point(bbox.x, ref.y);
        if (point.equals(anchor)) {
            point.x--;
            padding--;
        }
        point.move(ref, (ref.x < center.x) ? padding : - bbox.width - padding);
        if (angle) point.rotate(center, -angle);
        return point.round();
    }

    joint.routers.mapping = function(vertices, opt, linkView) {
        var link = linkView.model;
        var route = [];
        // Target Point
        var source = link.getSourceElement();
        if (source) {
            route.push(getOutsidePoint(
                source.getBBox(),
                source.angle(),
                linkView.sourceAnchor,
                opt.padding || opt.sourcePadding || DEFAULT_PADDING
            ));
        }
        // Vertices
        Array.prototype.push.apply(route, vertices);
        // Source Point
        var target = link.getTargetElement();
        if (target) {
            route.push(getOutsidePoint(
                target.getBBox(),
                target.angle(),
                linkView.targetAnchor,
                opt.padding || opt.targetPadding || DEFAULT_PADDING
            ));
        }
        return route;
    }

})(joint, g);
