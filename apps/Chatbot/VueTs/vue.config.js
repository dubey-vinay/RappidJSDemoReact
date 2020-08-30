/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


const path = require('path');

module.exports = {
    configureWebpack: {
        resolve: {
            extensions: ['.ts', '.vue', '.json', '.scss'],
            alias: {
                './src': path.resolve('src'),
                './': path.resolve('src/../')
            },
        },
    },
    chainWebpack: config => {
        const tsRule = config.module.rule('ts');
        // change transpileOnly flag to get access to the namespaces
        tsRule
            .use('ts-loader')
            .loader('ts-loader')
            .tap(options => {
                return {
                    ...options,
                    transpileOnly: false
                }
            })
    }
};
