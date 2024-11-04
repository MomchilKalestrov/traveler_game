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
};

type ButtonProps = {
    name: string,
    close: () => void
};

const buttons = {
    [ buttonType.Track ]:
        ({ name, close }: ButtonProps) => (
            <button
                aria-label='Start tracking' style={ buttonStyle }
                onClick={ () => track({ name, close }) }
            >Start tracking</button>
        ),
    [ buttonType.Untrack ]:
        ({ name, close }: ButtonProps) => (
            <button
                aria-label='Stop tracking' style={ buttonStyle }
                onClick={ () => untrack({ name, close }) }
            >Stop tracking</button>
        ),
    [ buttonType.Finish ]: 
        ({ name, close }: ButtonProps) => (
            <button
                aria-label='Finish' style={ buttonStyle }
                onClick={ () => finish({ name, close }  ) }
            >Finish</button>
        )
};

export default buttons;