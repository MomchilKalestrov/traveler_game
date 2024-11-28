'use client';
import Link  from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useParams, usePathname } from 'next/navigation';

import { Language } from '@logic/types';

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
    const params   = useParams();
    const pathname = usePathname();

    const [ language, setLanguage ] = React.useState<Language | undefined>(undefined);
    
    React.useEffect(() => {
        fetch(`/languages/${ params.lang }.json`)
            .then(res => res.json())
            .then(setLanguage);
    }, []);

    if (pathname.includes('login') || !language) return (<></>);

    return (
        <nav className={ styles.Navbar }>
            {
                pages.map((name: string, key: number) => (
                    <NavbarEntry
                        aria-label={ `Navigate to ${ name }` }
                        key={ key }
                        name={ (language?.misc.navbar as any)[name.toLowerCase()] }
                        page={ name }
                        language={ params.lang as string }
                        active={ pathname.includes(name.toLowerCase()) }
                    />
                ))
            }
        </nav>
    );
};

export default Navbar;