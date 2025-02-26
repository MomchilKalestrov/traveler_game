'use client';
import React from 'react';
import Image from 'next/image';

import { Landmark } from '@logic/types';
import InfoCard     from '@components/infocard';

import { getBadgeSVG } from '@logic/utils';

import style from './minicard.module.css';

type MinicardProps = {
    landmark: Landmark;
};

const Minicard: React.FC<MinicardProps> = ({ landmark }) => {
    const [ viewing, setViewing ] = React.useState<boolean>(false);

    return (
        <>
        {
            viewing &&
            <InfoCard
                type='unmarkForVisit'
                setter={ setViewing }
                landmark={ landmark }
            />
        }
            <button
                aria-label={ `View ${ landmark.name }` }
                className={ style.Minicard }
                onClick={ () => setViewing(true) }
            >
                <Image
                    alt={ `${ landmark.name } icon` } width={ 32 } height={ 32 }
                    src={ getBadgeSVG(landmark.dbname) }
                />
                <h2>{ landmark.name }</h2>
            </button>
        </>
    )
}

export default Minicard;