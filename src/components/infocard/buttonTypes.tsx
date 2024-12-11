import Button from '@components/button';

import { Language, Location } from '@logic/types';

import { track, untrack, finish } from './logic';

export enum buttonType {
    Untrack,
    Track,
    Finish
};

type ButtonProps = {
    location: Location,
    close: () => void,
    language: Language
};

const buttons = {
    [ buttonType.Track ]:
        ({ location, close, language }: ButtonProps) => (
            <Button
                aria-label='Start tracking'
                onClick={ () => track({ location, close }) }
                border={ true }
            >{ language.misc.infocards.start }</Button>
        ),
    [ buttonType.Untrack ]:
        ({ location, close,language }: ButtonProps) => (
            <Button
                aria-label='Stop tracking' 
                onClick={ () => untrack({ location, close }) }
                border={ true }
            >{ language.misc.infocards.stop }</Button>
        ),
    [ buttonType.Finish ]: 
        ({ location, close, language }: ButtonProps) => (
            <Button
                aria-label='Finish'
                onClick={ () => finish({ location, close }) }
                border={ true }
            >{ language.misc.infocards.finish }</Button>
        )
};

export default buttons;