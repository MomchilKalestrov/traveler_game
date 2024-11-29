import { CSSProperties } from 'react';
import { Language, Location } from '@logic/types';
import { track, untrack, finish } from './logic';

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
    close: () => void,
    language: Language
};

const buttons = {
    [ buttonType.Track ]:
        ({ location, close, language }: ButtonProps) => (
            <button
                aria-label='Start tracking' style={ buttonStyle }
                onClick={ () => track({ location, close }) }
            >{ language.misc.infocards.start }</button>
        ),
    [ buttonType.Untrack ]:
        ({ location, close,language }: ButtonProps) => (
            <button
                aria-label='Stop tracking' style={ buttonStyle }
                onClick={ () => untrack({ location, close }) }
            >{ language.misc.infocards.stop }</button>
        ),
    [ buttonType.Finish ]: 
        ({ location, close, language }: ButtonProps) => (
            <button
                aria-label='Finish' style={ buttonStyle }
                onClick={ () => finish({ location, close }  ) }
            >{ language.misc.infocards.finish }</button>
        )
};

export default buttons;