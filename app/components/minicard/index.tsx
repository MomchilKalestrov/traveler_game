'use client'
import React from 'react';
import style from './minicard.module.css';
import InfoCard, { cardType } from '@components/infocard';
import Image from 'next/image';
import { location } from '@logic/types';

const Minicard = (
    props: {
        location: location,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    return (
        <>
            <button aria-label={ `View started ${ props.location.name }` } className={ style.Minicard } onClick={ () => setViewing(true) }>
                <Image
                    alt={ `${ props.location.name } icon` } width={ 32 } height={ 32 }
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ props.location.name }.svg` }
                />
                <h2>{ props.location.name }</h2>
            </button>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Untrack }
                    setter={ setViewing }
                    location={ props.location }
                    reset={ props.reset }
                />
            }
        </>
    )
}

export default Minicard;