import Image from 'next/image';
import style from './loading.module.css';

const image = (
    <Image
        src='/icons/loading.svg'
        alt='Loading'
        width={ 64 }
        height={ 64 }
        style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        } }
    />
);

const LoadingPlaceholder = ({ small }: { small?: boolean | undefined }) =>
    small
    ?   (<div style={ { width: '100%', height: '100%', minHeight: '64px', position: 'relative' } }>{ image }</div>)
    :   (<main>{ image }</main>);

const loading = () => {
    const loading = document.createElement('div');
    loading.classList.add(style.Loading);
    const icon = document.createElement('img');
    icon.src = '/icons/loading.svg';
    icon.width = 64;
    icon.height = 64;
    loading.appendChild(icon);
    loading.id = 'loading';
    document.body.appendChild(loading);
};

const stopLoading = () => document.getElementById('loading')?.remove();

export { loading, stopLoading };
export default LoadingPlaceholder;