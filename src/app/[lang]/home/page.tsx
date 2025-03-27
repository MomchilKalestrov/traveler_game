'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage } from 'next';
import { useSelector } from 'react-redux';

import Minicard from '@components/minicard';
import AccomplishmentTag  from '@components/accomplishment';
import LoadingPlaceholder from '@components/loading';

import getActivities from '@logic/followerActivity';
import LanguageCTX   from '@logic/contexts/languageCTX';
import {
    Landmark,
    Accomplishment,
    Language,
    LandmarkType
} from '@logic/types';
import { RootState } from '@logic/redux/store';

import style from './home.module.css';

import Segment from './segments';

type LandmarksMarkedForVisitProps = {
    landmarks: Landmark[] | undefined;
    language: Language;
};

const availableLandmarkTypes: LandmarkType[] = [ 'water', 'nature', 'structure', 'misc' ];

const LandmarksMarkedForVisit: React.FC<LandmarksMarkedForVisitProps> = ({
    landmarks,
    language
}) => {
    if (!landmarks) return (
        <div className={ style.LoadingSegment }>
            <Image src='/icons/loading.svg' width={ 44 } height={ 44 } alt='loading' />
        </div>
    );

    if (landmarks.length === 0) return (<p>{ language.home.alts.started }</p>);

    return (
        <div className={ style.HorizontalCarousel }>
            <div>
                { landmarks.map((landmark: Landmark) =>
                    <Minicard key={ landmark.dbname } landmark={ landmark } />
                ) }
            </div>
        </div>
    );
}

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);
    
    const allLandmarks = useSelector((state: RootState) => state.allLandmarks.value);
    const user = useSelector((state: RootState) => state.user.value);
    const landmarksMarkedForVisit = useSelector((state: RootState) => state.landmarksMarkedForVisit.value);
    
    
    const [
        followerActivity,
        setFollowerActivity
    ] = React.useState<Accomplishment[]>([]);

    React.useEffect(() => {
        if (!user || !allLandmarks) return;
        getActivities(user, allLandmarks).then(setFollowerActivity);
    }, [ user?.following.length ]);

    if (!allLandmarks || !language) return (<LoadingPlaceholder />);

    return (
        <main className={ style.Home }>
            <h2>{ language.home.titles.started }</h2>
            <LandmarksMarkedForVisit landmarks={ landmarksMarkedForVisit } language={ language } />
            { availableLandmarkTypes.map((type: LandmarkType) => <Segment key={ type } type={ type } />) }
        {
            followerActivity.length > 0 && (
                <>
                    <h2>{ language.home.titles.activity }</h2>
                    { followerActivity.map((accomplishment: Accomplishment) =>
                        <AccomplishmentTag key={ accomplishment.dbname } accomplishment={ accomplishment } />
                    ) }
                </>
            )
        }
        </main>
    );
};

export default Page;