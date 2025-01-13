import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import { RootState } from '@logic/redux/store';
import LanguageCTX from '@logic/contexts/languageCTX';

import Mapcard from '@components/mapcard';

import style from './segment.module.css';

type FullPageProps = {
    type: 'water' | 'nature' | 'structure' | 'misc';
    locations: JSX.Element[];
    setter: React.Dispatch<React.SetStateAction<boolean>>;
};

type SegmentProps = {
    type: 'water' | 'nature' | 'structure' | 'misc';
};

const FullPage: React.FC<FullPageProps> = ({ type, locations, setter }) => {
    const language = React.useContext(LanguageCTX);
    const reference = React.useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (reference.current)
            reference.current.style.animation = `${ style.SlideOut } 0.5s forwards`;
        setTimeout(() => setter(false), 500);
    };

    if (!language) return (<></>);

    return (
        <div ref={ reference } className={ style.FullPage }>
            <div className={ style.FullPageHeader }>
                <button
                    aria-label='Close settings'
                    onClick={ handleClick }
                    className={ style.FullPageBack }
                ><Image src='/icons/back.svg' alt='go back' width={ 24 } height={ 24 } /></button>
                <h2>{ language.home.titles.types[type] }</h2>
                <div style={ { width: '2.5rem', height: '2.5rem' } } />
            </div>
            <div className={ style.FullPageContent }>
                { locations }
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
                acc.push(<Mapcard key={ curr.dbname } location={ curr } />);
            return acc;
        }, [] as JSX.Element[])
    , [ newSlice ]);

    if (!language || filteredLocations.length === 0) return (<></>)

    return (
        <>
            { fullPage && <FullPage locations={ filteredLocations } setter={ setFullPage } type={ type } /> }
            <div className={ style.SegmentHeader }>
                <h2>{ language.home.titles.types[type] }</h2>
                {
                    filteredLocations.length > 2 &&
                    <button onClick={ () => setFullPage(true) } aria-label={ `View all ${ type } locations.` }>
                        <Image src='/icons/back.svg' alt='arrow' width={ 24 } height={ 24 } style={ { transform: 'rotate(180deg)' } } />
                    </button>
                }
            </div>
            { filteredLocations.slice(0, 2) }
        </>
    );
};

export default Segment;