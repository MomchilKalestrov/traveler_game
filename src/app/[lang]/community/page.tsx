'use client';
import React from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';

import LanguageCTX from '@logic/contexts/languageCTX';
import { RootState } from '@logic/redux/store';
import store from '@logic/redux/store';
import { CommunityLocation } from '@logic/types';
import { haversineDistance } from '@logic/utils';

import LoadingPlaceholder from '@components/loading';
import Button from '@src/components/button';

import CreateCard from './createLocation';
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
    [key: string]: (poi1: CommunityLocation, poi2: CommunityLocation) => number
} = {
    recentlyAdded: (poi1: CommunityLocation, poi2: CommunityLocation) =>
        objectIdToTimestamp(poi2._id) - objectIdToTimestamp(poi1._id),
    mostVisited: (poi1: CommunityLocation, poi2: CommunityLocation) =>
        poi2.visits - poi1.visits,
    mostLiked: (poi1: CommunityLocation, poi2: CommunityLocation) =>
        poi2.likes.length - poi1.likes.length
};

const loadMore = async (skip: number, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    const close = () => setter(false);

    const res = await fetch('/api/community-locations?skip=' + skip);
    if (!res.ok) return;

    const data = await res.json();

    if (data.length === 0)
        return close();

    const user = store.getState().user.value;
    store.dispatch({ type: 'community/add', payload: { locations: data, user } });
};

const Page: NextPage = () => {
    const language = React.useContext(LanguageCTX);

    const communitySlice = useSelector((state: RootState) => state.community.value);
    const customSlice    = useSelector((state: RootState) => state.custom.value);

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
                    <h2>Your landmarks</h2>
                    <button style={ { padding: '0.5rem' } } onClick={ () => setAddDialogVisible(true) }>
                        <Image
                            src='/icons/close.svg' alt='Add landmark'
                            width={ 24 } height={ 24 }
                            style={ { transform: 'rotate(45deg)' } }
                        />
                    </button>
                </div>
            {
                customSlice
                ?   customSlice.length > 0
                    ?   <div className={ style.HorizontalCarousel }>
                            <div>
                            {
                                customSlice.map((location) => (
                                    <CommunityCard key={ location._id } location={ location } type='delete' />
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
                communitySlice.started
                ?   communitySlice.started.length > 0
                    ?   <div className={ style.HorizontalCarousel }>
                            <div>
                            {
                                communitySlice.started.map((location) => (
                                    <CommunityCard key={ location._id } location={ location } type='untrack' />
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
                communitySlice.new
                ?   [ ...communitySlice.new ] // avoid mutation by cloning the array
                        .sort(sort[ sortBy ])
                        .map((location) =>
                            <CommunityCard key={ location._id } location={ location } type='track' />
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

                        loadMore((communitySlice.all || []).length, hideButton)
                            .then(() => { if (element) element.disabled = false; });
                    } }
                >{ language.community.loadMore }</Button>
            }
            </main>
        </>
    );
};

export default Page;