/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { dia } from '@clientio/rappid';

export interface Properties {
    [property: string]: dia.Path;
}

@Component({} as any)
export abstract class BaseInspector extends Vue {

    @Prop() cell: dia.Cell;

    public props: Properties;

    @Watch('cell')
    onPropertyChanged(currentValue: dia.Cell, previousValue: dia.Cell): void {
        this.removeCellListener(previousValue);
        this.addCellListener(currentValue);
        this.assignFormFields();
    }

    public mounted(): void {
        this.addCellListener(this.cell);
        this.assignFormFields();
    }

    public beforeDestroy(): void {
        this.removeCellListener(this.cell);
    }

    public changeCellProp(path: dia.Path, value: any): void {
        this.cell.prop(path, value);
    }

    protected abstract assignFormFields(): void;

    private addCellListener(cell: dia.Cell): void {
        cell.on('change', () => this.assignFormFields(), this);
    }

    private removeCellListener(cell: dia.Cell): void {
        cell.off(null, null, this);
    }
}

