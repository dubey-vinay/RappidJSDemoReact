import React, { ReactElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { dia, shapes } from '@clientio/rappid';

import MessageInspector from 'src/components/Inspector/MessageInspector';
import 'src/components/Inspector/Inspector.scss';
import LinkInspector from 'src/components/Inspector/LinkInspector';
import LabelInspector from 'src/components/Inspector/LabelInspector';
import { ShapeTypesEnum } from 'src/rappid/shapes/app.shapes';
import { State } from 'src/redux/reducer';

const Inspector = (): ReactElement => {
    const [cell, setCell] = useState<dia.Cell>(null);

    const selection = useSelector((state: State) => state.selection);

    useEffect(() => {
        const [selectedCell = null] = selection as dia.Cell[];
        setCell(selectedCell);
    }, [selection]);

    const chooseInspector = (): ReactElement => {
        switch (cell.get('type')) {
            case ShapeTypesEnum.MESSAGE:
                return <MessageInspector cell={cell as shapes.app.Message}/>;
            case ShapeTypesEnum.LINK:
                return <LinkInspector cell={cell as dia.Link}/>;
            case ShapeTypesEnum.FLOWCHART_START:
                return <LabelInspector cell={cell}/>;
            case ShapeTypesEnum.FLOWCHART_END:
                return <LabelInspector cell={cell}/>;
            default:
                return;
        }
    };

    const emptyInspector = (): ReactElement => {
        return (
            <>
                <h1>Component</h1>
                <label>Label
                    <input disabled/>
                </label>
            </>
        );
    };

    return (
        <div className={'inspector-container ' + (!cell ? 'disabled-container' : '')}>
            {
                cell ? chooseInspector() : emptyInspector()
            }
        </div>
    );
};

export default Inspector;
