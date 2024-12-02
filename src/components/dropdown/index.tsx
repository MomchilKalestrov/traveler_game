import React from 'react';
import Image from 'next/image';

import arrow from './arrow.svg';

import style from './dropdown.module.css';

type DropdownProps = {
    entries: { [key: string]: string };
    name: string;
    selected?: string;
    width?: string;
    onClick?: (event: React.MouseEvent<HTMLDivElement>, value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({ entries, name, selected, width, onClick }) => (
    <div className={ style.Dropdown } style={ { width: width } }>
        <div className={ style.DropdownHead }>
            <p>{ name }</p>
            <input type='checkbox' />
            <Image src={ arrow } alt='arrow' width={ 24 } height={ 24 } />
        </div>
        <div
            className={ style.DropdownBody }
            style={ {
                '--dropdown-height': `calc(1px + 3rem * ${ Object.entries(entries).length })`,
                width: width
            } as React.CSSProperties }
        >
            {
                Object.entries(entries).map(([key, value]) => (
                    <label key={ key } className={ style.DropdownLabel }>
                        <input
                            type='radio'
                            name={ name }
                            value={ value }
                            defaultChecked={ value === selected }
                            onClick={ (e) => onClick ? onClick(e, value) : null }
                        />
                        <p>{ key }</p>
                    </label>
                ))
            }
        </div>
    </div>
);

export default Dropdown;