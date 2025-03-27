'use client';
import React from 'react';
import Image from 'next/image';

import { Landmark, Language } from '@logic/types';
import { getBadgeSVG } from '@logic/utils';
import { usePageStack } from '@logic/pageStackProvider';
import LanguageCTX from '@logic/contexts/languageCTX';

import InfoCard from '@components/infocard';
import Button from '@components/button';

import style from './mapcard.module.css';

type MapcardProps = {
    landmark: Landmark;
};

const Mapcard: React.FC<MapcardProps> = ({ landmark }) => {
    const language: Language | undefined = React.useContext(LanguageCTX);
    const { addPage, removePage } = usePageStack();

    if (!language) return (<></>);

    const showInfoCard = () => {
        const name = `info-${ landmark.dbname }`;
        const page = <InfoCard landmark={ landmark } close={ () => removePage(name) } type="markForVisit" />;
        addPage({ name, page });
    };

    return (
        <div className={ style.Mapcard }>
            <div
                className={ style.MapcardLandmark }
                style={ {
                    backgroundImage: `
                        url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ landmark.dbname }.png'),
                        url('/default_assets/background.png')
                    `
                } }
            >
                <div>
                    <Image
                        alt={ landmark.name }
                        src={ getBadgeSVG(landmark.dbname) }
                        width={ 40 }
                        height={ 40 }
                    />
                </div>
            </div>
            <div className={ style.MapcardMore }>
                <h3>{ landmark.name }</h3>
                <Button
                    aria-label={ `View new ${ landmark.name }` }
                    onClick={ showInfoCard }
                    border={ true }
                >{ language.misc.infocards.view }</Button>
            </div>
        </div>
    );
};

export default Mapcard;