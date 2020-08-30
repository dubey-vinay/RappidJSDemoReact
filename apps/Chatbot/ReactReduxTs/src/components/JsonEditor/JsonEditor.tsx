import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import 'src/components/JsonEditor/JsonEditor.scss';
import { SharedEvents } from 'src/rappid/controller';
import { actionCreator } from 'src/redux/helpers/actionCreator';

interface Props {
    content: Object;
}

const DEBOUNCE_TIME_MS = 500;

const JsonEditor = (props: Props): ReactElement => {

    const [placeholder] = useState('e.g. { "cells": [{ "type": "app.Message"}] }');
    const [content, setContent] = useState<string | Object>(null);
    const [contentSubject] = useState(new Subject<Object>());

    const dispatch = useDispatch();

    useEffect(() => {
        contentSubject.pipe(debounceTime(DEBOUNCE_TIME_MS)).subscribe((json: Object) => {
            dispatch(
                actionCreator(SharedEvents.JSON_EDITOR_CHANGED, json)
            );
        });
    }, [dispatch, contentSubject]);

    useEffect(() => {
        if (props.content) {
            setContent(props.content);
        }
    }, [props.content]);

    const parseJSON = (jsonString: string): void => {
        setContent(jsonString);
        let json;
        if (!jsonString) {
            json = { cells: [] };
        } else {
            try {
                json = JSON.parse(jsonString);
            } catch (e) {
                // Invalid JSON
                return;
            }
        }
        contentSubject.next(json);
    };

    const formatJSON = (json: string | Object): string => {
        if (!json) {
            return '';
        }
        return typeof json === 'string' ? json : JSON.stringify(json, null, 2);
    };

    return (
        <div className="json-editor-container">
            <textarea placeholder={placeholder}
                      spellCheck="false"
                      value={formatJSON(content)}
                      onChange={(e) => parseJSON(e.target.value)}
            />
        </div>
    );
};

export default JsonEditor;
