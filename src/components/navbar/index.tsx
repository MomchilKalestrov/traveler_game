'use client';
import Link  from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useParams, usePathname } from 'next/navigation';

import { Language } from '@logic/types';
import LanguageCTX  from '@logic/contexts/languageCTX';

import styles from './navbar.module.css';

type NavbarEntryProps = {
    page: string;
    name: string;
    active: boolean;
    language: string;
};

type NavbarProps = {
    pages: string[];
};

const isHidden = (url: string): boolean => {
    const hidden: string[] = [ 'login', 'about' ];
    let hide = false;

    hidden.forEach((page) => hide = hide || url.includes(page));
    
    return hide;
};

const NavbarEntry = ({ page, name, active, language }: NavbarEntryProps) => (
    <Link
        href={ `/${ language }/${ page.toLowerCase() }` }
        className={ styles.NavbarEntry + ' ' + (active ? styles.NavbarEntrySelected : '') }
    >
        <div><Image src={ `/icons/navigation/${ page }.svg` } alt={ `${ page } page` } width={ 24 } height={ 24 } /></div>
        <p>{ name }</p>
    </Link>
);

const Navbar: React.FC<NavbarProps> = ({ pages }) => {
    const params   = useParams<{ lang: string }>();
    const pathname = usePathname();
    const language: Language | undefined = React.useContext(LanguageCTX);

    if (!language || isHidden(pathname)) return (<></>);

    return (
        <nav className={ styles.Navbar }>
        {
            pages.map((name: string, key: number) => (
                <NavbarEntry
                    aria-label={ `Navigate to ${ name }` }
                    key={ key }
                    name={ (language.misc.navbar as any)[name.toLowerCase()] }
                    page={ name }
                    language={ params.lang }
                    active={ pathname.includes(name.toLowerCase()) }
                />
            ))
        }
        </nav>
    );
};

export default Navbar;