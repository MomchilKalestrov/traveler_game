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
    Location,
    Accomplishment,
    Language,
    LocationType
} from '@logic/types';
import { RootState } from '@logic/redux/store';

import style from './home.module.css';

import Segment from './segments';

type StartedLocationsProps = {
    startedLocations: Location[] | undefined;
    language: Language;
};

const availableLocationTypes: LocationType[] = [ 'water', 'nature', 'structure', 'misc' ];

const StartedLocations: React.FC<StartedLocationsProps> = ({
    startedLocations,
    language
}) => {
    if (!startedLocations) return (
        <div className={ style.LoadingSegment }>
            <Image src='/icons/loading.svg' width={ 44 } height={ 44 } alt='loading' />
        </div>
    );

    if (startedLocations.length === 0) return (<p>{ language.home.alts.started }</p>);

    return (
        <div className={ style.HorizontalCarousel }>
            <div>
                { startedLocations.map((location: Location, key: number) =>
                    <Minicard key={ key } location={ location } />
                ) }
            </div>
        </div>
    );
}

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);
 
    const allSlice     = useSelector((state: RootState) => state.all.value);
    const userSlice    = useSelector((state: RootState) => state.user.value);
    const startedSlice = useSelector((state: RootState) => state.started.value);
    
    const [
        followerActivity,
        setFollowerActivity
    ] = React.useState<Accomplishment[]>([]);

    React.useEffect(() => {
        if (!userSlice || !allSlice) return;
        getActivities(userSlice, allSlice).then(setFollowerActivity);
    }, [ userSlice ]);

    if (!allSlice || !language) return (<LoadingPlaceholder />);

    return (
        <main className={ style.Home }>
            <h2>{ language.home.titles.started }</h2>
            <StartedLocations startedLocations={ startedSlice } language={ language } />
        {
            availableLocationTypes.map((type: LocationType) =>
                <Segment key={ type } type={ type } />
            )
        }
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