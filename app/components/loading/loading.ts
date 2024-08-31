import style from './loading.module.css'

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
}

const stopLoading = () => document.getElementById('loading')?.remove();

export { loading, stopLoading };