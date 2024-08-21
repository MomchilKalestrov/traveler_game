import style from './input.module.css';

const MaterialInput = (
    props: {
        name?: string
        ref?: React.RefObject<HTMLInputElement>,
        onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void,
        type: 'text' | 'password' | 'email' | 'number'
    }
) => {
    return (
        <div className={ style.FormInput }>
            <input ref={ props.ref } name={ props.name || ' ' } placeholder=' ' type={ props.type } onChange={ props.onChange }/>
            <label>{ props.name || ' ' }</label>
        </div>
    );
}

export default MaterialInput;