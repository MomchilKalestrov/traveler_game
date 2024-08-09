'use client'
import styles from './navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavbarEntry = (
    props: {
        name: string,
        active: boolean
    }
) => {
    return (
        <Link
            className={ styles.NavbarEntry + ' ' + (props.active ? styles.NavbarEntrySelected : '') }
            href={ `/main/${ props.name }` }
        >
            <img
                src={ `/${props.name}.svg` }
                alt={ props.name }
            />
            <p>{ props.name }</p>
        </Link>
    );
}

const Navbar = () => {
    const path: string = usePathname().split('/').pop() as string;
    const posibilities: string[] = ['Home', 'Map', 'Profile'];

    return (
        <nav className={ styles.Navbar }>
            {
                posibilities.map((name: string) => (
                    <NavbarEntry
                        key={ name }
                        name={ name }
                        active={ path === name }
                    />
                ))
            }
        </nav>
    );
}

export default Navbar;