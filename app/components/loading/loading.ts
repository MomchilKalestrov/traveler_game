import style from './loading.module.css'

const loading = () => {
    const loading = document.createElement('div');
    loading.classList.add(style.Loading);
    const wheel = document.createElement('div');
    wheel.classList.add(style.LoadingWheel);
    loading.appendChild(wheel);
    loading.id = 'loading';
    document.body.appendChild(loading);
}

const stopLoading = () => document.getElementById('loading')?.remove();

export { loading, stopLoading };