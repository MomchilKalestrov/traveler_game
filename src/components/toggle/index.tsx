import React from 'react';
import style from './toggle.module.css';

type ToggleButtonProps = {
    onClick?: () => void,
    disabled?: boolean
}

const ToggleButton = React.forwardRef<HTMLInputElement, ToggleButtonProps>(
    ({ onClick, disabled }, ref) => (
        <div>
            <div className={ style.Toggle }>
                <input type='checkbox' ref={ ref } onClick={ onClick } disabled={ disabled } />
                <div />
            </div>
        </div>
    )
);

export default ToggleButton;