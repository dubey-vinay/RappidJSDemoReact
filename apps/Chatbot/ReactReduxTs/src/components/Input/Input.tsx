import React, { ChangeEvent, ReactElement } from 'react';
import { useDispatch } from 'react-redux';

import { SharedEvents } from 'src/rappid/controller';
import { actionCreator } from 'src/redux/helpers/actionCreator';

interface Props {
    className?: string;
    type?: string;
    placeholder?: string;
    spellCheck?: boolean;
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const BATCH_NAME = 'inspector-input';

const Input = (props: Props): ReactElement => {

    const dispatch = useDispatch();

    const onFocus = (): void => {
        dispatch(
            actionCreator(SharedEvents.GRAPH_START_BATCH, BATCH_NAME)
        );
    };

    const onBlur = (): void => {
        dispatch(
            actionCreator(SharedEvents.GRAPH_STOP_BATCH, BATCH_NAME)
        );
    };

    return (
        <input className={props.className}
               type={props.type}
               placeholder={props.placeholder}
               spellCheck={('spellCheck' in props) ? props.spellCheck : true}
               value={props.value}
               defaultValue={props.defaultValue}
               onChange={props.onChange}
               onFocus={onFocus}
               onBlur={onBlur}
        />);
};

export default Input;
