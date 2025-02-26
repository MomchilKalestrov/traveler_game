import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from '@logic/redux/store';
import LanguageCTX   from '@logic/contexts/languageCTX';
import { LandmarkType } from '@logic/types';

import Mapcard from '@components/mapcard';
import Advertisement from '@components/ad';

import style from './segment.module.css';

const CARD_MAX_COUNT = 2;

type FullPageProps = {
    type: LandmarkType;
    landmarks: (JSX.Element & { landmark: string })[];
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

type SegmentProps = {
    type: LandmarkType;
};

const FullPage: React.FC<FullPageProps> = ({ type, landmarks, setter }) => {
    const language     = React.useContext(LanguageCTX);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchRef    = React.useRef<HTMLInputElement>(null);

    const [
        filteredLandmarks,
        setFilteredLandmarks
    ] = React.useState<(JSX.Element & { landmark: string })[]>(landmarks);

    const close = () => {
        if (containerRef.current)
            containerRef.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
        setTimeout(() => setter(false), 500);
    };

    const openSearch = () => {
        if (!searchRef.current) return;

        const button = searchRef.current.nextElementSibling as HTMLButtonElement;
        if (!button) return;

        if (searchRef.current.style.width === '0px') {
            searchRef.current.style.width = 'calc(min(100vw, 32rem) - 5rem - var(--padding) * 3)';
            searchRef.current.style.padding = '0.75rem 1rem';
            button.style.borderRadius = '0 1.25rem 1.25rem 0';
        } else {
            searchRef.current.style.width = '0px';
            searchRef.current.style.padding = '0.75rem 0px';
            setTimeout(() => button.style.borderRadius = '1.25rem', 430);
        };
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();

        setFilteredLandmarks(landmarks.filter(({ landmark }) =>
            landmark.toLowerCase().includes(query) && landmark !== 'advertisement'
        ));
    };

    if (!language) return (<></>);

    return (
        <div ref={ containerRef } className={ style.FullPage }>
            <div className={ style.FullPageHeader }>
                <button aria-label='Close segment' onClick={ close } className={ style.Button }>
                    <Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } />
                </button>
                <h2>{ language.home.titles.types[type] }</h2>
                <div className={ style.SearchContainer }>
                    <input
                        ref={ searchRef }
                        onChange={ handleSearch }
                        type='text'
                        placeholder='...'
                        style={ { width: '0px' } }
                    />
                    <button className={ style.Button } onClick={ openSearch }>
                        <Image src='/icons/search.svg' alt='search' width={ 24 } height={ 24 } />
                    </button>
                </div>
            </div>
            <div className={ style.FullPageContent }>
                { filteredLandmarks }
                <div style={ { height: 'calc(var(--padding) * 2)', width: '100%', backgroundColor: 'transparent' } } />
            </div>
        </div>
    );
}

const Segment: React.FC<SegmentProps> = ({ type }) => {
    const language = React.useContext(LanguageCTX);
    const newLandmarks = useSelector((state: RootState) => state.newLandmarks.value);

    const [ fullPage, setFullPage ] = React.useState(false);
    
    const filteredLandmarks = React.useMemo(() =>
        newLandmarks?.reduce((acc, curr) => {
            if (curr.type === type)
                acc.push({ ...(<Mapcard key={ curr.dbname } landmark={ curr } />), landmark: curr.name });
            return acc;
        }, [] as (JSX.Element & { landmark: string })[])
    , [ newLandmarks?.length ]);

    if (!language || !filteredLandmarks || filteredLandmarks.length === 0) return (<></>)

    return (
        <>
            { fullPage && <FullPage landmarks={ filteredLandmarks } setter={ setFullPage } type={ type } /> }
            <div className={ style.SegmentHeader }>
                <h2>{ language.home.titles.types[type] }</h2>
                {
                    filteredLandmarks.length > CARD_MAX_COUNT &&
                    <button onClick={ () => setFullPage(true) } aria-label={ `View all ${ type } landmarks.` }>
                        <Image src='/icons/back.svg' alt='arrow' width={ 24 } height={ 24 } style={ { transform: 'rotate(180deg)' } } />
                    </button>
                }
            </div>
            { filteredLandmarks.slice(0, CARD_MAX_COUNT) }
        </>
    );
};

export default Segment;