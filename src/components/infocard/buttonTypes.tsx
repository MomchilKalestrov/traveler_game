import Button from '@components/button';

import { Language, Location } from '@logic/types';

import { track, untrack, finish, share } from './logic';

type buttonType = 'track' | 'untrack' | 'finish' | 'share';

type ButtonProps = {
    location: Location,
    close: () => void,
    language: Language
};

const buttons: {
    [key in buttonType]: (props: ButtonProps) => JSX.Element
} = {
    'track':
        ({ location, close, language }: ButtonProps) => (
            <Button
                aria-label='Start tracking'
                onClick={ () => track({ location, close }) }
                border={ true }
            >{ language.misc.infocards.start }</Button>
        ),
    'untrack':
        ({ location, close,language }: ButtonProps) => (
            <Button
                aria-label='Stop tracking' 
                onClick={ () => untrack({ location, close }) }
                border={ true }
            >{ language.misc.infocards.stop }</Button>
        ),
    'finish': 
        ({ location, close, language }: ButtonProps) => (
            <Button
                aria-label='Finish'
                onClick={ () => finish({ location, close }) }
                border={ true }
            >{ language.misc.infocards.finish }</Button>
        ),
    'share':
        ({ location, close, language }: ButtonProps) => (
            <Button
                aria-label='Share'
                onClick={ () => share({ location, close }) }
                border={ true }
            >{ language.misc.infocards.share }</Button>
        )
};

export default buttons;
export type { buttonType };