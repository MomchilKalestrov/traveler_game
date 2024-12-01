import React, { InputHTMLAttributes } from 'react';
import style from './input.module.css';

type MaterialInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'style' | 'type' | 'placeholder' | 'className'> & {
    type: 'text' | 'password' | 'email' | 'number' | 'url';
}; 

const MaterialInput = React.forwardRef<HTMLInputElement, MaterialInputProps>(
    (props, ref) => (
        <div className={ style.FormInput }>
            <input { ...props } ref={ ref } placeholder=' ' />
            <label>{ props.name }</label>
        </div>
    )
);

export default MaterialInput;