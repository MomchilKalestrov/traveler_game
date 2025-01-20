import React from 'react';

import style from './button.module.css';

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
    border?: boolean | undefined;
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ border, children, ...rest }, ref) => (
    <button
        ref={ ref } { ...rest }
        className={ `${ style.Button } ${ border ? style.ButtonBorder : '' }` }
    >{children}</button>
));

export default Button;