'use client';
import styles from './navbar.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarEntry = ({ name, active }: { name: string, active: boolean }) => {
    return (
        <Link
            href={ `/${ name.toLowerCase() }` }
            className={ styles.NavbarEntry + ' ' + (active ? styles.NavbarEntrySelected : '') }
        >
            <div><Image src={ `/icons/navigation/${name}.svg` } alt={ name } width={ 24 } height={ 24 } /></div>
            <p>{ name }</p>
        </Link>
    );
}
const Navbar = ({ pages }: { pages: string[] }) => {
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
}

export default Navbar;