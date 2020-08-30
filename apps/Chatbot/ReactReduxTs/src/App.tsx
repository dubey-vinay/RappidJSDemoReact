import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'src/App.scss';
import RappidService from 'src/services/rappid.service';
import JsonEditor from 'src/components/JsonEditor/JsonEditor';
import Inspector from 'src/components/Inspector/Inspector';
import { importGraphFromJSON, loadStencilShapes, zoomToFit } from 'src/rappid/actions';
import { STENCIL_WIDTH } from 'src/theme';
import { State } from 'src/redux/reducer';

import exampleGraphJSON from 'src/rappid/config/example-graph.json';

const App = (): ReactElement => {

    const elementRef = useRef(null);
    const toolbarRef = useRef(null);
    const stencilRef = useRef(null);
    const paperRef = useRef(null);

    const [rappid, setRappid] = useState(null);
    const [stencilOpened, setStencilOpened] = useState(true);
    const [jsonEditorOpened, setJsonEditorOpened] = useState(true);
    const [fileJSON, setFileJSON] = useState(null);

    const dispatch = useDispatch();

    const graphJSON = useSelector<State>(state => {
        return state.graphJSON;
    });

    useEffect(() => {
        setFileJSON(graphJSON);
    }, [graphJSON]);

    const openFile = useCallback((json: Object): void => {
        setFileJSON(json);
        importGraphFromJSON(rappid, json);
        zoomToFit(rappid);
    }, [rappid]);

    const onStart = useCallback((): void => {
        loadStencilShapes(rappid);
        openFile(exampleGraphJSON);
    }, [rappid, openFile]);

    const onStencilToggle = useCallback((): void => {
        if (!rappid) {
            return;
        }
        const { scroller, stencil } = rappid;
        if (stencilOpened) {
            stencil.unfreeze();
            scroller.el.scrollLeft += STENCIL_WIDTH;
        } else {
            stencil.freeze();
            scroller.el.scrollLeft -= STENCIL_WIDTH;
        }
    }, [rappid, stencilOpened]);

    const toggleJsonEditor = (): void => {
        setJsonEditorOpened(!jsonEditorOpened);
    };

    const toggleStencil = (): void => {
        setStencilOpened(!stencilOpened);
    };

    useEffect((): void => {
        onStencilToggle();
    }, [stencilOpened, onStencilToggle]);

    const setStencilContainerSize = useCallback((): void => {
        stencilRef.current.style.width = `${STENCIL_WIDTH}px`;
    }, []);

    useEffect(() => {
        setRappid(new RappidService(
            elementRef.current,
            paperRef.current,
            stencilRef.current,
            toolbarRef.current,
            dispatch
        ));
    }, [dispatch]);

    useEffect(() => {
        if (!rappid) {
            return;
        }
        setStencilContainerSize();
        onStart();
    }, [rappid, onStart, setStencilContainerSize, dispatch]);

    useEffect(() => {
        if (!rappid) {
            return;
        }
        return () => {
            rappid.destroy();
        };
    }, [rappid]);

    return (
        <div ref={elementRef} className="rappid-app">
            <div className="app-body">
                <div ref={toolbarRef}/>
                <div className="side-bar">
                    <div className="toggle-bar">
                        <div onClick={toggleStencil}
                             className={'icon toggle-stencil ' + (!stencilOpened ? 'disabled-icon' : '')}
                             data-tooltip="Toggle Element Palette"
                             data-tooltip-position-selector=".toggle-bar"/>
                        <div onClick={toggleJsonEditor}
                             className={'icon toggle-editor ' + (!jsonEditorOpened ? 'disabled-icon' : '')}
                             data-tooltip="Toggle JSON Editor"
                             data-tooltip-position-selector=".toggle-bar"/>
                    </div>
                    <div ref={stencilRef}
                         style={{ display: stencilOpened ? 'initial' : 'none' }}
                         className="stencil-container"/>
                </div>
                <div className="main-container">
                    <div ref={paperRef} className="paper-container"/>
                    <div style={{ display: jsonEditorOpened ? 'initial' : 'none' }}>
                        <JsonEditor content={fileJSON}/>
                    </div>
                </div>
                <Inspector/>
            </div>
        </div>
    );
};

export default App;
