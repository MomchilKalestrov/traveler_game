import style from './loading.module.css'

const loading = () => {
    const loading = document.createElement('div');
    loading.classList.add(style.Loading);
    loading.appendChild(document.createElement('div'));
    loading.id = 'loading';
    document.body.appendChild(loading);
}

const stopLoading = () => document.getElementById('loading')?.remove();

export { loading, stopLoading };