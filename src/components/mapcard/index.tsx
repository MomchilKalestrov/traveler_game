'use client';
import React from 'react';
import Image from 'next/image';

import { Location, Language } from '@logic/types';
import LanguageCTX from '@logic/contexts/languageCTX';

import InfoCard, { cardType } from '@components/infocard';
import Button from '@components/button';

import style from './mapcard.module.css';

type MapcardProps = {
    location: Location;
};

const Mapcard: React.FC<MapcardProps> = ({ location }) => {
    const language: Language | undefined = React.useContext(LanguageCTX);
    const [ viewing, setViewing ] = React.useState<boolean>(false);

    if (!language) return (<></>);

    return (
        <>
            <div className={ style.Mapcard }>
                <div
                    className={ style.MapcardLocation }
                    style={ {
                        backgroundImage: `
                            url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ location.dbname }.png'),
                            url('/default_assets/background.png')
                        `
                    } }
                >
                    <div>
                        <Image
                            alt={ location.name }
                            src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ location.dbname }.svg` }
                            width={ 40 }
                            height={ 40 }
                        />
                    </div>
                </div>
                <div className={ style.MapcardMore }>
                    <h3>{ location.name }</h3>
                    <Button
                        aria-label={ `View new ${ location.name }` }
                        onClick={ () => setViewing(true) }
                        border={ true }
                    >{ language.misc.infocards.view }</Button>
                </div>
            </div>
        {
            viewing &&
            <InfoCard
                type='track'
                setter={ setViewing }
                location={ location }
            />
        }
        </>
    );
};

export default Mapcard;