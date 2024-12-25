'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { NextPage }    from 'next';

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
    User,
    Language
} from '@logic/types';

import { RootState } from '@logic/redux/store';

import style from './home.module.css';

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
        if (!userSlice) return;
        getActivities(userSlice as User, allSlice as Location[]).then(setFollowerActivity);
    }, [userSlice]);

    if (!userSlice || !newSlice || !startedSlice || !language) return (<LoadingPlaceholder />);

    console.log(newSlice)

    return (
        <main className={ style.Home }>
            <h2>{ language.home.titles.started }</h2>
        { 
            !startedSlice || startedSlice.length === 0
            ?   <p>{ language.home.alts.started }</p>
            :   <div className={ style.HorizontalCarousel }><div>
            {
                startedSlice.map((location: Location, key: number) =>
                <Minicard key={ key } location={ location } />
                )
            }
            </div></div>
        }
            <h2>{ language.home.titles.new }</h2>
        { [
            (
                newSlice.length === 0
                ?   <p>{ language.home.alts.new }</p>
                // synthetically cap the maximum so that the home page doesn't look too cluttered
                // this is temporary until I implement different sections like
                // "mountains", "beaches", "cities" and so on
                :   (newSlice.slice(0, maxNewLocations)).map((
                        location: Location,
                        index: number
                    ) => <Mapcard key={ index } location={ location } />)
            ),
            (
                newSlice.length > maxNewLocations
                ?   <Button
                        border={ true }
                        onClick={ () => setMaxNewLocations(maxNewLocations + 6) }
                    >{ language.home.loadMore }</Button>
                :   null
            )
        ] }
        {
            followerActivity.length > 0 && [
                <h2>{ language.home.titles.activity }</h2>,
                followerActivity.map((accomplishment: Accomplishment, key: number) => 
                    <AccomplishmentTag key={ key } accomplishment={ accomplishment } />
                )
            ]
        }
        </main>
    );
};

export default Page;