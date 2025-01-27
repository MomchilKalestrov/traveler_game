import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from '@logic/redux/store';
import LanguageCTX   from '@logic/contexts/languageCTX';
import { LocationType } from '@logic/types';

import Mapcard from '@components/mapcard';

import style from './segment.module.css';

const CARD_MAX_COUNT = 2;

type FullPageProps = {
    type: LocationType;
    locations: (JSX.Element & { location: string })[];
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

type SegmentProps = {
    type: LocationType;
};

const FullPage: React.FC<FullPageProps> = ({ type, locations, setter }) => {
    const language     = React.useContext(LanguageCTX);

    const containerRef = React.useRef<HTMLDivElement>(null);
    const searchRef    = React.useRef<HTMLInputElement>(null);

    const [
        filteredLocations,
        setFilteredLocations
    ] = React.useState<(JSX.Element & { location: string })[]>(locations);

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

        setFilteredLocations(locations.filter(({ location }) =>
            location.toLowerCase().includes(query)
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
                { filteredLocations }
                <div style={ { height: 'calc(var(--padding) * 2)', width: '100%', backgroundColor: 'transparent' } } />
            </div>
        </div>
    );
}

const Segment: React.FC<SegmentProps> = ({ type }) => {
    const language = React.useContext(LanguageCTX);
    const newSlice = useSelector((state: RootState) => state.new.value);

    const [ fullPage, setFullPage ] = React.useState(false);

    const filteredLocations = React.useMemo(() => 
        !newSlice ? []
        : newSlice.reduce((acc, curr) => {
            if (curr.type === type)
                acc.push({ ...(<Mapcard key={ curr.dbname } location={ curr } />), location: curr.name });
            return acc;
        }, [] as (JSX.Element & { location: string })[])
    , [ newSlice ]);

    if (!language || filteredLocations.length === 0) return (<></>)

    return (
        <>
            { fullPage && <FullPage locations={ filteredLocations } setter={ setFullPage } type={ type } /> }
            <div className={ style.SegmentHeader }>
                <h2>{ language.home.titles.types[type] }</h2>
                {
                    filteredLocations.length > CARD_MAX_COUNT &&
                    <button onClick={ () => setFullPage(true) } aria-label={ `View all ${ type } locations.` }>
                        <Image src='/icons/back.svg' alt='arrow' width={ 24 } height={ 24 } style={ { transform: 'rotate(180deg)' } } />
                    </button>
                }
            </div>
            { filteredLocations.slice(0, CARD_MAX_COUNT) }
        </>
    );
};

export default Segment;