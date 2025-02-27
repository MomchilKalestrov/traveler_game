'use client';
import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';

import LanguageCTX from '@logic/contexts/languageCTX';
import { RootState } from '@logic/redux/store';
import store from '@logic/redux/store';
import { CommunityLandmark } from '@logic/types';

import LoadingPlaceholder from '@components/loading';
import Button from '@src/components/button';

import CreateCard from './createLandmark';
import style from './community.module.css';


const objectIdToTimestamp = (id: string) =>
    (parseInt(id.substring(0, 8), 16) * 1000) & 0xffffffff;

let counter = 0;
const nextSort = (): string => [
    'recentlyAdded',
    'mostVisited',
    'mostLiked'
][(counter = (counter + 1) % 3)];

const sort: {
    [key: string]: (landmark1: CommunityLandmark, landmark2: CommunityLandmark) => number
} = {
    recentlyAdded: (landmark1: CommunityLandmark, landmark2: CommunityLandmark) =>
        objectIdToTimestamp(landmark2._id) - objectIdToTimestamp(landmark1._id),
    mostVisited: (landmark1: CommunityLandmark, landmark2: CommunityLandmark) =>
        landmark2.visits - landmark1.visits,
    mostLiked: (landmark1: CommunityLandmark, landmark2: CommunityLandmark) =>
        landmark2.likes.length - landmark1.likes.length
};

const loadMore = async (skip: number, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const close = () => setter(false);

    const res = await fetch('/api/community-landmarks?skip=' + skip);
    if (!res.ok) return;

    const data = await res.json();

    if (data.length === 0)
        return close();

    const user = store.getState().user.value;
    store.dispatch({ type: 'communityMadeLandmarks/add', payload: { landmarks: data, user } });
};

const Page: NextPage = () => {
    const language = React.useContext(LanguageCTX);

    const communityLandmarks = useSelector((state: RootState) => state.communityMadeLandmarks.value);
    const userMadeLandmarks = useSelector((state: RootState) => state.userMadeLandmarks.value);

    const [ sortBy, setSort ] = React.useState('recentlyAdded');
    const [ isButtonVisible, hideButton ] = React.useState(true);
    const [ addDialogVisible, setAddDialogVisible ] = React.useState(false);

    const CommunityCard = React.useMemo(() => dynamic(
        () => import('./communityCard'), {
            loading: () => (<></>),
            ssr: false
        }
    ), []);

    if (!language) return (<LoadingPlaceholder />);

    return (
        <>
            { addDialogVisible && <CreateCard key='card' setter={ setAddDialogVisible } /> }
            <main className={ style.Page } key='main'>
                <div className={ style.Header }>
                    <h2>{ language.community.titles.created }</h2>
                    <button style={ { padding: '0.5rem' } } onClick={ () => setAddDialogVisible(true) }>
                        <Image
                            src='/icons/close.svg' alt='Add landmark'
                            width={ 24 } height={ 24 }
                            style={ { transform: 'rotate(45deg)' } }
                        />
                    </button>
                </div>
            {
                userMadeLandmarks
                ?   userMadeLandmarks.length > 0
                    ?   <div className={ style.HorizontalCarousel }>
                            <div>
                            {
                                userMadeLandmarks.map((landmark) => (
                                    <CommunityCard key={ landmark.name } landmark={ landmark } type='deleteLandmark' />
                                ))
                            }
                            </div>
                        </div>
                    :   <p style={ { margin: '0px' } }>{ language.community.alts.created }</p>
                :   <LoadingPlaceholder small={ true } />
            }
                <div className={ style.Header }>
                    <h2>{ language.community.titles.started }</h2>
                    <div style={ { height: '2.5rem' } } />
                </div>
            {
                communityLandmarks.markedForVisit
                ?   communityLandmarks.markedForVisit.length > 0
                    ?   <div className={ style.HorizontalCarousel }>
                            <div>
                            {
                                communityLandmarks.markedForVisit.map((landmark) => (
                                    <CommunityCard key={ landmark.name } landmark={ landmark } type='unmarkForVisit' />
                                ))
                            }
                            </div>
                        </div>
                    :   <p style={ { margin: '0px' } }>{ language.community.alts.started }</p>
                :   <LoadingPlaceholder small={ true } />
            }
                <div className={ style.Header }>
                    <h2>{ language.community.titles.new }</h2>
                    <button onClick={ () => setSort(nextSort()) }>
                        <Image src='/icons/sort.svg' alt='Sort' width={ 24 } height={ 24 } />
                        { language.community.filters[ sortBy ] }
                    </button>
                </div>
            {
                communityLandmarks.new
                ?   [ ...communityLandmarks.new ] // avoid mutation by cloning the array
                        .sort(sort[ sortBy ])
                        .map((landmark) =>
                            <CommunityCard key={ landmark.name } landmark={ landmark } type='markForVisit' />
                        )
                :   <LoadingPlaceholder small={ true } />
            }
            {
                isButtonVisible &&
                <Button
                    border={ true }
                    onClick={ (e: React.MouseEvent<HTMLButtonElement>) => {
                        const element = e.currentTarget;
                        if (element) element.disabled = true;

                        loadMore((communityLandmarks.all || []).length, hideButton)
                            .then(() => { if (element) element.disabled = false; });
                    } }
                >{ language.community.loadMore }</Button>
            }
            </main>
        </>
    );
};

export default Page;