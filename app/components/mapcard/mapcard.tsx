'use client'
import React from 'react';
import style from './mapcard.module.css';
import InfoCard, { cardType } from '@components/infocard/infocard';
import ImageAndFallback from '@components/imageAndFallback/imageAndFallback';

const Mapcard = (
    props: {
        name: string,
        reset: () => void
    }
) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    return (
        <>
            <div className={ style.Mapcard }>
                <div className={ style.MapcardLocation} onLoad={ (event: React.SyntheticEvent<HTMLDivElement>) =>
                    fetch(`${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ props.name }.png`)
                        .then((res) => res.status === 200 ? res.text() : undefined)
                        .then((text) => {
                            if (event.currentTarget && text)
                                event.currentTarget.style.backgroundImage = `url(${ text })`;
                        })
                }>
                    <div>
                        <ImageAndFallback
                            alt={ props.name }
                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ props.name }.svg` }
                            fallback='/default_assets/badge.svg'
                            width={ 40 }
                            height={ 40 }
                        />
                    </div>
                </div>
                <div className={ style.MapcardMore }>
                    <h3 style={ { margin: 0 } }>{ props.name }</h3>
                    <button
                        aria-label={ `View new ${ props.name }` }
                        className={ style.Button }
                        onClick={ () => setViewing(true) }
                    >View</button>
                </div>
            </div>
            {
                viewing &&
                <InfoCard
                    type={ cardType.Track }
                    setter={ setViewing }
                    name={ props.name }
                    reset={ props.reset }
                />
            }
        </>
    )
}

export default Mapcard;