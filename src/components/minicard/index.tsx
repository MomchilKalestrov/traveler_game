'use client';
import React from 'react';
import Image from 'next/image';

import InfoCard     from '@components/infocard';

import { getBadgeSVG } from '@logic/utils';
import { usePageStack } from '@logic/pageStackProvider';
import { Landmark } from '@logic/types';

import style from './minicard.module.css';

type MinicardProps = {
    landmark: Landmark;
};

const Minicard: React.FC<MinicardProps> = ({ landmark }) => {
    const { addPage, removePage } = usePageStack();

    const showInfoCard = () => {
        const name = `info-${ landmark.dbname }`;
        const page = <InfoCard landmark={ landmark } close={ () => removePage(name) } type="unmarkForVisit" />;
        addPage({ name, page });
    };

    return (
        <>
            <button
                aria-label={ `View ${ landmark.name }` }
                className={ style.Minicard }
                onClick={ showInfoCard }
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