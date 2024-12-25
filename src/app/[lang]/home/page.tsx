'use client';
import React from 'react';
import Image from 'next/image';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import Button   from '@components/button';
import Mapcard  from '@components/mapcard';
import Minicard from '@components/minicard';
import AccomplishmentTag  from '@components/accomplishment';
import LoadingPlaceholder from '@components/loading';

import getActivities from '@logic/followerActivity';
import LanguageCTX   from '@logic/contexts/languageCTX';
import {
    Location,
    Accomplishment,
    Language
} from '@logic/types';

import { RootState } from '@logic/redux/store';

import style from './home.module.css';

type NewLocationsProps = {
    newLocations: Location[] | undefined;
    language: Language;
    maxNewLocations: number;
};

type StartedLocationsProps = {
    startedLocations: Location[] | undefined;
    language: Language;
};

const NewLocations: React.FC<NewLocationsProps> = ({
    newLocations,
    language,
    maxNewLocations
}) => {
    if (!newLocations) return (
        <div className={ style.LoadingSegment }>
            <Image src='/icons/loading.svg' width={ 64 } height={ 64 } alt='loading' />
        </div>
    );

    if (newLocations.length === 0) return (<p>{ language.home.alts.new }</p>);

    // synthetically cap the maximum so that the home page doesn't look too cluttered
    // this is temporary until I implement different sections like
    // "mountains", "beaches", "cities" and so on
    
    return newLocations.slice(0, maxNewLocations).map((location: Location, index: number) =>
        <Mapcard key={ index } location={ location } />
    );
};

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
 
    const newSlice     = useSelector((state: RootState) => state.new.value);
    const allSlice     = useSelector((state: RootState) => state.all.value);
    const userSlice    = useSelector((state: RootState) => state.user.value);
    const startedSlice = useSelector((state: RootState) => state.started.value);
    
    const [
        followerActivity,
        setFollowerActivity
    ] = React.useState<Accomplishment[]>([]);
    const [
        maxNewLocations,
        setMaxNewLocations
    ] = React.useState<number>(Number(process.env.NEXT_PUBLIC_MAX_LOCATIONS || '6'));

    React.useEffect(() => {
        if (!userSlice || !allSlice) return;
        getActivities(userSlice, allSlice).then(setFollowerActivity);
    }, [ userSlice ]);

    if (!language) return (<LoadingPlaceholder />);

    return (
        <main className={ style.Home }>
            <h2>{ language.home.titles.started }</h2>
            <StartedLocations startedLocations={ startedSlice } language={ language } />

            <h2>{ language.home.titles.new }</h2>
            <NewLocations newLocations={ newSlice } maxNewLocations={ maxNewLocations } language={ language } />
        {
            (newSlice && newSlice.length > maxNewLocations) &&
            <Button
                border={ true }
                onClick={ () => setMaxNewLocations(maxNewLocations + 6) }
            >{ language.home.loadMore }</Button>
        }
        {
            followerActivity.length > 0 && (
                <>
                    <h2>{ language.home.titles.activity }</h2>
                    { followerActivity.map((
                        accomplishment: Accomplishment, key: number
                    ) => <AccomplishmentTag key={ key } accomplishment={ accomplishment } />) }
                </>
            )
        }
        </main>
    );
};

export default Page;