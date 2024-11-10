import React from 'react';
import style from './input.module.css';

type MaterialInputProps = {
    name: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type: 'text' | 'password' | 'email' | 'number' | 'url';
};

const MaterialInput = React.forwardRef<HTMLInputElement, MaterialInputProps>(
    ({ name, onChange, type}, ref) => (
        <div className={ style.FormInput }>
            <input
                ref={ ref } name={ name }
                placeholder={ name }
                type={ type } onChange={ onChange }
            />
            <label>{ name }</label>
        </div>
    )
);

export default MaterialInput;