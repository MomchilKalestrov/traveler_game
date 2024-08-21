'use client'
import React, { useEffect } from 'react';
import styles from './navbar.module.css';

const NavbarEntry = (
    props: {
        id: number,
        name: string,
        active: boolean,
        onClick: (id: number) => void
    }
) => {
    return (
        <button
            aria-label={ `Navigate to ${ props.name }` }
            className={ styles.NavbarEntry + ' ' + (props.active ? styles.NavbarEntrySelected : '') }
            onClick={ () => props.onClick(props.id) }
        >
            <div><img src={ `/${props.name}.svg` } alt={ props.name } /></div>
            <p>{ props.name }</p>
        </button>
    );
}
const Navbar = (props: { refs: Array<React.RefObject<HTMLElement>> }) => {
    const posibilities: string[] = ['Home', 'Map', 'Profile'];
    const [active, setActive] = React.useState<Array<boolean>>([ true, false, false ]);

    const pageSwap = (id: number) => {
        for(let i: number = 0; i < 3; ++i) {
            const context = props.refs[i]?.current;
            if (!context) continue;
            context.style.display = i === id ? 'block' : 'none';
        }

        let newPages: Array<boolean> = [ false, false, false ];
        newPages[id] = true;

        setActive(newPages);
    }
    
    useEffect(() => {
        pageSwap(0);
    }, []);

    return (
        <nav className={ styles.Navbar }>
            {
                posibilities.map((name: string, key: number) => (
                    <NavbarEntry
                        aria-label={ `Navigate to ${ name }` }
                        id={ key }
                        key={ key }
                        name={ name }
                        active={ active[key] }
                        onClick={ pageSwap }
                    />
                ))
            }
        </nav>
    );
}

export default Navbar;