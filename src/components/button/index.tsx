import React from 'react';

import style from './button.module.css';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
    border?: boolean | undefined;
}

const Button: React.FC<ButtonProps> = ({ border, children, ...rest }: ButtonProps) => (
    <button
        className={ `${ style.Button } ${ border && style.ButtonBorder }` } 
        { ...rest }
    >{ children }</button>
);

export default Button;