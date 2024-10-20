'use client'
import React from 'react';
import style from './mapcard.module.css';
import InfoCard, { cardType } from '@components/infocard';
import Image from 'next/image';

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
                <div
                    className={ style.MapcardLocation }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ props.name }.png'),
                            url('/default_assets/background.png')
                        `
                    } }
                >
                    <div>
                        <Image
                            alt={ props.name }
                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ props.name }.svg` }
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