import style from './input.module.css';
import React from 'react';

const MaterialInput = React.forwardRef<HTMLInputElement, {
        name: string
        ref?: React.RefObject<HTMLInputElement>,
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
        type: 'text' | 'password' | 'email' | 'number'
    }
>((props, ref) => (
    <div className={ style.FormInput }>
        <input
            ref={ ref } name={ props.name }
            placeholder={ props.name }
            type={ props.type } onChange={ props.onChange }
        />
        <label>{ props.name }</label>
    </div>
));

export default MaterialInput;