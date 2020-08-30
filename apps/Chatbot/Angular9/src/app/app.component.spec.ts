/*! Rappid v3.2.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2015 client IO

 2020-07-25 


This Source Code Form is subject to the terms of the Rappid Trial License
, v. 2.0. If a copy of the Rappid License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the Rappid archive as was distributed by client IO. See the LICENSE file.*/


import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from 'src/app/app.component';
import { JsonEditorComponent } from 'src/app/json-editor/json-editor.component';
import { InspectorComponent } from 'src/app/inspector/inspector.component';
import { MessageInspectorComponent } from 'src/app/inspector/message-inspector/message-inspector.component';
import { LabelInspectorComponent } from 'src/app/inspector/label-inspector/label-inspector.component';
import { LinkInspectorComponent } from 'src/app/inspector/link-inspector/link-inspector.component';
import { BatchDirective } from 'src/directives/batch.directive';
import { EventBusService } from 'src/services/event-bus.service';


describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                JsonEditorComponent,
                InspectorComponent,
                MessageInspectorComponent,
                LabelInspectorComponent,
                LinkInspectorComponent,
                BatchDirective
            ],
            providers: [
                EventBusService
            ],
            imports: [
                BrowserModule,
                FormsModule,
                ReactiveFormsModule
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create app component', () => {
        expect(component).toBeTruthy();
    });

    it('should render rappid container and add rappid-scope class', () => {
        const RAPPID_SCOPE_CLASS_NAME = 'rappid-scope';
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.className).toBe(RAPPID_SCOPE_CLASS_NAME);
    });
});
