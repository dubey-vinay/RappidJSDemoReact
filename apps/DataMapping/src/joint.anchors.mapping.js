/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


'use strict';

(function(joint) {

    joint.anchors.mapping = function(view, magnet, ref) {
        var anchor;
        var model = view.model;
        var bbox = view.getNodeUnrotatedBBox(magnet);
        var center = model.getBBox().center();
        var angle = model.angle();
        var side = model.getItemSide(view.findAttribute('item-id', magnet));
        if (side === 'left') {
            anchor = bbox.leftMiddle();
        } else if (side === 'right') {
            anchor = bbox.rightMiddle();
        } else {
            var refPoint = ref;
            if (ref instanceof Element) {
                var refView = this.paper.findView(ref);
                refPoint = (refView) ? refView.getNodeBBox(ref).center(): new g.Point();
            }
            refPoint.rotate(center, angle);
            anchor = (refPoint.x <= (bbox.x + bbox.width / 2)) ? bbox.leftMiddle() : bbox.rightMiddle();
        }
        return anchor.rotate(center, -angle);
    };

})(joint);
