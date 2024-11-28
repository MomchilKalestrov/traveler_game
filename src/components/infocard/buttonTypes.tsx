import { CSSProperties } from 'react';
import { track, untrack, finish } from './logic';
import { Location } from '@logic/types';

export enum buttonType {
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
    location: Location,
    close: () => void
};

const buttons = {
    [ buttonType.Track ]:
        ({ location, close }: ButtonProps) => (
            <button
                aria-label='Start tracking' style={ buttonStyle }
                onClick={ () => track({ location, close }) }
            >Start tracking</button>
        ),
    [ buttonType.Untrack ]:
        ({ location, close }: ButtonProps) => (
            <button
                aria-label='Stop tracking' style={ buttonStyle }
                onClick={ () => untrack({ location, close }) }
            >Stop tracking</button>
        ),
    [ buttonType.Finish ]: 
        ({ location, close }: ButtonProps) => (
            <button
                aria-label='Finish' style={ buttonStyle }
                onClick={ () => finish({ location, close }  ) }
            >Finish</button>
        )
};

export default buttons;