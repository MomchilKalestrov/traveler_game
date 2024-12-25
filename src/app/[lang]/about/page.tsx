'use client';
import Link  from 'next/link';
import Image from 'next/image';
import { NextPage }    from 'next';
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react';

import { Language } from '@logic/types';
import LanguageCTX from '@logic/contexts/languageCTX';

import LoadingPlaceholder from '@components/loading';
import Button from '@components/button';

import header from './header.module.css';
import main from './main.module.css';
import footer from './footer.module.css';

type NavEntryProps = {
    title: string;
    language: Language;
};

type CardProps = {
    dbname: string;
    name: string;
};

type cards = {
    [key: string]: { dbname: string, name: string }[];
};

const pages: string[] = [ 'about', 'download', 'login' ];
const locations: cards = {
    en: [
        { dbname: 'St. Alexander Nevsky', name: 'St. Alexander Nevsky Cathedral' },
        { dbname: 'Primorsko', name: 'Primorsko' },
        { dbname: 'Plovdiv', name: 'Plovdiv' }
    ],
    bg: [
        { dbname: 'St. Alexander Nevsky', name: 'Катедрала "Св. Александър Невски"' },
        { dbname: 'Primorsko', name: 'Приморско' },
        { dbname: 'Plovdiv', name: 'Пловдив' }
    ]
};

const NavEntry: React.FC<NavEntryProps> = ({ title, language }) => {
    const pathname = usePathname();
    const [ locale, page ] = pathname.split('/').slice(1);

    return (
        <Link
            className={ header.NavEntry + (title === page ? ` ${ header.NavEntrySelected }` : '') }
            href={ `/${ locale }/${ title }` }
        >
            <p>{ language.about.pages[title] }</p>
            <div />
        </Link>
    );
};

const Card: React.FC<CardProps> = ({  dbname, name }) => (
    <div className={ main.Card }>
        <div
            className={ main.CardImage }
            style={ {
                backgroundImage: `
                url('${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ dbname }.png'),
                url('/default_assets/background.png')
                `
            } }
        >
            <div>
                <Image
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ dbname }.svg` }
                    alt={ name }
                    width={ 40 }
                    height={ 40 }
                />
            </div>
        </div>
        <div><h3>{ name }</h3></div>
    </div>
);

const Page: NextPage = () => {
    const language = useContext(LanguageCTX);

    if (!language) return (<LoadingPlaceholder />);

    return (
        <>
            <header className={ header.Header }>
                <div className={ header.Logo }>
                    <Image src='/favicon.png' alt='logo' width='100' height='100' />
                    <h2>{ language.gamename }</h2>
                </div>
                <Image
                    className={ header.MenuIcon }
                    src='/icons/menu.svg'
                    alt='menu'
                    width='24'
                    height='24'
                />
                <input type='checkbox' />
                <div className={ header.Nav }>
                { pages.map((page, i) => (
                    <NavEntry key={ i } title={ page } language={ language } />
                )) }
                </div>
            </header>

            <main className={ main.Main }>
                <section className={ main.Splash }>
                    <div>
                        <h1>{ language.gamename }</h1>
                        <p>{ language.about.tagline }</p>
                        <Button border={ true }>
                            <Link href={ `/${ language.locale }/download` }>
                                { language.about.download }
                            </Link>
                        </Button>
                    </div>
                    <Image src='/media/person.svg' alt='person' width={ 480 } height={ 565 } />
                </section>
                <section
                    className={ main.DarkenedBackground }
                    style={ { flexWrap: 'wrap-reverse' } }
                >
                    <div className={ main.CardCarousel }>
                        <div>
                        { locations[ language.locale ].map((location, i) => (
                            <Card { ...location } key={ i } />
                        )) }
                            <Card { ...locations[ language.locale][0] } />
                        </div>
                    </div>
                    <div>
                        <h1>{ language.about.info.about.title }</h1>  
                        <p>{ language.about.info.about.content }</p>
                    </div>
                </section>
            </main>

            <footer className={ footer.Footer }></footer>
        </>
    );
};

export default Page;