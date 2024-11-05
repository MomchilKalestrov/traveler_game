'use client';
import Link  from 'next/link';
import Image from 'next/image';

import { usePathname } from 'next/navigation';

import styles from './navbar.module.css';

type NavbarEntryProps = {
    name: string;
    active: boolean;
};

type NavbarProps = {
    pages: string[];
};

const NavbarEntry = ({ name, active }: NavbarEntryProps) => {
    return (
        <Link
            href={ `/${ name.toLowerCase() }` }
            className={ styles.NavbarEntry + ' ' + (active ? styles.NavbarEntrySelected : '') }
        >
            <div><Image src={ `/icons/navigation/${name}.svg` } alt={ `${ name } page` } width={ 24 } height={ 24 } /></div>
            <p>{ name }</p>
        </Link>
    );
}

const Navbar = ({ pages }: NavbarProps) => {
    const pathname = usePathname();
    
    if (pathname === '/login')
        return (<></>);

    return (
        <nav className={ styles.Navbar }>
            {
                pages.map((name: string, key: number) => (
                    <NavbarEntry
                        aria-label={ `Navigate to ${ name }` }
                        key={ key }
                        name={ name }
                        active={ pathname === `/${ name.toLowerCase() }` }
                    />
                ))
            }
        </nav>
    );
};

export default Navbar;