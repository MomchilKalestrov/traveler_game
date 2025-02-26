import Button from '@components/button';

import { Language, Landmark } from '@logic/types';

import { unmarkForVisit, markForVisit, share } from './logic';

type buttonType = 'markForVisit' | 'unmarkForVisit' | 'share';

type ButtonProps = {
    landmark: Landmark,
    close: () => void,
    language: Language
};

const buttons: {
    [key in buttonType]: (props: ButtonProps) => JSX.Element
} = {
    'markForVisit':
        ({ landmark, close, language }: ButtonProps) => (
            <Button
                aria-label='Mark for visit'
                onClick={ () => markForVisit({ landmark, close }) }
                border={ true }
            >{ language.misc.infocards.start }</Button>
        ),
    'unmarkForVisit':
        ({ landmark, close, language }: ButtonProps) => (
            <Button
                aria-label='Unmark for visit' 
                onClick={ () => unmarkForVisit({ landmark, close }) }
                border={ true }
            >{ language.misc.infocards.stop }</Button>
        ),
    'share':
        ({ landmark, close, language }: ButtonProps) => (
            <Button
                aria-label='Share'
                onClick={ () => share({ landmark, close }) }
                border={ true }
            >{ language.misc.infocards.share }</Button>
        )
};

export default buttons;
export type { buttonType };