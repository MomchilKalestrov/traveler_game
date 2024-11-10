'use client';
import React from 'react';
import Image from 'next/image';

import { Location }           from '@logic/types';
import InfoCard, { cardType } from '@components/infocard';

import style from './minicard.module.css';

type MinicardProps = {
    location: Location;
};

const Minicard: React.FC<MinicardProps> = ({ location }) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    return (
        <>
            <button
                aria-label={ `View started ${ location.name }` }
                className={ style.Minicard }
                onClick={ () => setViewing(true) }
            >
                <Image
                    alt={ `${ location.name } icon` } width={ 32 } height={ 32 }
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ location.name }.svg` }
                />
                <h2>{ location.name }</h2>
            </button>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Untrack }
                    setter={ setViewing }
                    location={ location }
                />
            }
        </>
    )
}

export default Minicard;