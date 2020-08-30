/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


'use strict';

(function(joint, graph) {

    var order = new joint.shapes.mapping.Record({
        items: [[{
            id: 'file',
            label: 'File: (default)',
            icon: 'images/file.svg',
            highlighted: true,
            items: [{
                id: 'order',
                label: 'Order',
                icon: 'images/document.svg',
                items: [{
                    id: 'order_id',
                    label: 'id',
                    icon: 'images/document.svg',
                }, {
                    id: 'order_name',
                    label: 'name',
                    icon: 'images/document.svg',
                }, {
                    id: 'order_email',
                    label: 'email',
                    icon: 'images/document.svg',
                }, {
                    id: 'order_entry_date',
                    label: 'entry_date',
                    icon: 'images/file.svg',
                    items: [{
                        id: 'entry_date_year',
                        label: 'year',
                        icon: 'images/document.svg',
                    }, {
                        id: 'entry_date_month',
                        label: 'month',
                        icon: 'images/document.svg',
                    }, {
                        id: 'entry_date_day',
                        label: 'day',
                        icon: 'images/document.svg',
                    }]
                }, {
                    id: 'address',
                    label: 'address',
                    icon: 'images/file.svg',
                    items: [{
                        id: 'address_city',
                        label: 'city',
                        icon: 'images/document.svg'
                    }, {
                        id: 'address_street',
                        label: 'street',
                        icon: 'images/document.svg'
                    }, {
                        id: 'address_number',
                        label: 'number',
                        icon: 'images/document.svg'
                    }, {
                        id: 'address_shipping',
                        label: 'shipping',
                        icon: 'images/document.svg'
                    }, {
                        id: 'address_billing',
                        label: 'billing',
                        icon: 'images/document.svg'
                    }]
                }]
            }]
        }]]
    });
    order.setName('Order');
    order.position(780, 200);
    order.addTo(graph);

    var nanonull = new joint.shapes.mapping.Record({
        items: [
            [{
                id: 'orders',
                label: 'orders',
                icon: 'images/file.svg',
                items: [{
                    id: 'order_id',
                    label: 'id',
                    icon: 'images/document.svg',
                }, {
                    id: 'order_created_at',
                    label: 'created_at',
                    icon: 'images/document.svg',
                }, {
                    id: 'order_updated_at',
                    label: 'updated_at',
                    icon: 'images/document.svg',
                }, {
                    id: 'orderedproducts',
                    label: 'orderedproducts',
                    icon: 'images/file.svg',
                    group: 'disabled'
                }, {
                    id: 'users',
                    label: 'users',
                    icon: 'images/file.svg',
                    items: [{
                        id: 'user_id',
                        label: 'id',
                        icon: 'images/document.svg',
                    }, {
                        id: 'user_first_name',
                        label: 'first_name',
                        icon: 'images/document.svg',
                    }, {
                        id: 'user_last_name',
                        label: 'last_name',
                        icon: 'images/document.svg',
                    }, {
                        id: 'user_email',
                        label: 'email',
                        icon: 'images/document.svg',
                    }, {
                        id: 'user_created_at',
                        label: 'created_at',
                        icon: 'images/document.svg',
                    }, {
                        id: 'user_updated_at',
                        label: 'updated_at',
                        icon: 'images/document.svg',
                    }, {
                        id: 'addresses',
                        label: 'addresses',
                        icon: 'images/file.svg',
                        items: [{
                            id: 'address_id',
                            label: 'id',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_type',
                            label: 'type',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_city',
                            label: 'city',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_street',
                            label: 'street',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_number',
                            label: 'number',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_is_shipping',
                            label: 'is_shipping',
                            icon: 'images/document.svg',
                        }, {
                            id: 'address_is_billing',
                            label: 'is_billing',
                            icon: 'images/document.svg',
                        }]
                    }]
                }]
            }]
        ]
    });
    nanonull.setName('Nanonull');
    nanonull.position(50, 130);
    nanonull.addTo(graph);

    var constant1 = new joint.shapes.mapping.Constant();
    constant1.setValue('Order');
    constant1.position(240, 10);
    constant1.addTo(graph);

    var constant2 = new joint.shapes.mapping.Constant();
    constant2.setValue('.dat');
    constant2.position(240, 40);
    constant2.addTo(graph);

    var constant3 = new joint.shapes.mapping.Constant();
    constant3.setValue(' ');
    constant3.position(240, 70);
    constant3.addTo(graph);

    var concat1 = new joint.shapes.mapping.Concat();
    concat1.position(450, 0);
    concat1.addTo(graph);

    var concat2 = new joint.shapes.mapping.Concat();
    concat2.position(450, 120);
    concat2.addTo(graph);

    var getDate1 = new joint.shapes.mapping.GetDate();
    getDate1.position(450, 310);
    getDate1.addTo(graph);

    var links = [
        // concat1
        new joint.shapes.mapping.Link({
            source: { id: constant1.id, port: 'value' },
            target: { id: concat1.id, port: 'value_1' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'order_id' },
            target: { id: concat1.id, port: 'value_2' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: constant2.id, port: 'value' },
            target: { id: concat1.id, port: 'value_3' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: concat1.id, port: 'result' },
            target: { id: order.id, port: 'file' }
        }),
        // concat2
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'user_first_name' },
            target: { id: concat2.id, port: 'value_1' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: constant3.id, port: 'value' },
            target: { id: concat2.id, port: 'value_2' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'user_last_name' },
            target: { id: concat2.id, port: 'value_3' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: concat2.id, port: 'result' },
            target: { id: order.id, port: 'order_name' }
        }),
        // getDate1
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'user_created_at' },
            target: { id: getDate1.id, port: 'value' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: getDate1.id, port: 'year' },
            target: { id: order.id, port: 'entry_date_year' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: getDate1.id, port: 'month' },
            target: { id: order.id, port: 'entry_date_month' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: getDate1.id, port: 'day' },
            target: { id: order.id, port: 'entry_date_day' }
        }),
        // order
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'order_id' },
            target: { id: order.id, port: 'order_id' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'user_email' },
            target: { id: order.id, port: 'order_email' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'addresses' },
            target: { id: order.id, port: 'address' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'address_is_billing' },
            target: { id: order.id, port: 'address_billing' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'address_is_shipping' },
            target: { id: order.id, port: 'address_shipping' }
        }),

        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'address_city' },
            target: { id: order.id, port: 'address_city' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'address_street' },
            target: { id: order.id, port: 'address_street' }
        }),
        new joint.shapes.mapping.Link({
            source: { id: nanonull.id, port: 'address_number' },
            target: { id: order.id, port: 'address_number' }
        }),
    ];

    links.forEach(function(link) {
        link.addTo(graph);
    });

})(joint, window.graph);
