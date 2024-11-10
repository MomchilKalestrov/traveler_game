'use client';
import React from 'react';
import Image from 'next/image';

import { Location }           from '@logic/types';
import InfoCard, { cardType } from '@components/infocard';

import style from './mapcard.module.css';

type MapcardProps = {
    location: Location;
};

const Mapcard: React.FC<MapcardProps> = ({ location }) => {
    const [viewing, setViewing] = React.useState<boolean>(false);

    return (
        <>
            <div className={ style.Mapcard }>
                <div
                    className={ style.MapcardLocation }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ location.name }.png'),
                            url('/default_assets/background.png')
                        `
                    } }
                >
                    <div>
                        <Image
                            alt={ location.name }
                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ location.name }.svg` }
                            width={ 40 }
                            height={ 40 }
                        />
                    </div>
                </div>
                <div className={ style.MapcardMore }>
                    <h3 style={ { margin: 0 } }>{ location.name }</h3>
                    <button
                        aria-label={ `View new ${ location.name }` }
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
                    location={ location }
                />
            }
        </>
    );
};

export default Mapcard;