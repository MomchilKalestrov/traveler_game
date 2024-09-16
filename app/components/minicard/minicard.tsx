'use client'
import React from 'react';
import style from './minicard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import ImageAndFallback from '@components/imageAndFallback/imageAndFallback';

const Minicard = (
    props: {
        name: string,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    return (
        <>
            <button aria-label={ `View started ${ props.name }` } className={ style.Minicard } onClick={ () => setViewing(true) }>
                <h4>{ props.name }</h4>
                <ImageAndFallback
                    alt={ props.name } width={ 32 } height={ 32 } fallback='/default_assets/badge.svg'
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ props.name }.svg` }
                />
            </button>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Untrack }
                    setter={ setViewing }
                    name={ props.name }
                    reset={ props.reset }
                />
            }
        </>
    )
}

export default Minicard;