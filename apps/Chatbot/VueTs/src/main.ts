/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import Vue from 'vue';

import App from 'src/App.vue';
import 'src/styles.scss';

import { EventBusService } from 'src/services/event-bus.service';
import batchDirective from 'src/directives/batch.directive';

Vue.directive('batch', batchDirective);

Vue.prototype.$eventBusService = new EventBusService();

new Vue({
  render: h => h(App)
}).$mount('#app');
