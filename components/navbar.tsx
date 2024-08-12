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
        <div
            className={ styles.NavbarEntry + ' ' + (props.active ? styles.NavbarEntrySelected : '') }
            onClick={ () => props.onClick(props.id) }
        >
            <img src={ `/${props.name}.svg` } alt={ props.name } />
            <p>{ props.name }</p>
        </div>
    );
}

const Navbar = (props: { refs: Array<React.Ref<HTMLElement>> }) => {
    const posibilities: string[] = ['Home', 'Map', 'Profile'];
    const [active, setActive] = React.useState<Array<boolean>>([ true, false, false ]);

    const pageSwap = (id: number) => {
        for(let i: number = 0; i < 3; ++i)
            props.refs[i].current.style.display = i === id ? 'block' : 'none';

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