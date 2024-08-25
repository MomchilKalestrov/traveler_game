'use client';
import style from './toggle.module.css';

const ToggleButton = (
    props: {
        onClick?: () => void,
        ref?: React.RefObject<HTMLInputElement>,
        disabled?: boolean
    }
) => (
    <div className={ style.Toggle }>
        <input type='checkbox' ref={ props.ref } onClick={ props.onClick } disabled={ props.disabled } />
        <div />
    </div>
);

export default ToggleButton;