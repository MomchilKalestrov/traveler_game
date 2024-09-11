import { CSSProperties } from 'react';
import { track, untrack, finish } from './logic';

enum buttonType {
    Untrack,
    Track,
    Finish
};

const buttonStyle: CSSProperties = {
    height: '2.5rem',
    padding: '0.5rem 1rem',
    borderRadius: '1.25rem',
    border: '1px solid var(--color-primary)',
    color: 'var(--color-primary)',
    backgroundColor: 'transparent'
}

const buttons = {
    [buttonType.Track]: (
        props: {
            name: string,
            reset: () => void,
            close: () => void
        }
    ) => (
        <button
            aria-label='Start tracking'
            style={ buttonStyle }
            onClick={ () => track(props.name, props.reset, props.close) }
        >Start tracking</button>
    ),
    [buttonType.Untrack]: (
        props: {
            name: string,
            reset: () => void,
            close: () => void
        }
    ) => (
        <button
            aria-label='Stop tracking'
            style={ buttonStyle }
            onClick={ () => untrack(props.name, props.reset, props.close) }
        >Stop tracking</button>
    ),
    [buttonType.Finish]: (
        props: {
            name: string,
            reset: () => void,
            close: () => void
        }
    ) => (
        <button
            aria-label='Finish'
            style={ buttonStyle }
            onClick={ () => finish(props.name, props.reset, props.close) }
        >Finish</button>
    )
};

export default buttons;