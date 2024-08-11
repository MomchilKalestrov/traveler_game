import style from './loading.module.css'

const loading = () => {
    const loading = document.createElement('div');
    loading.classList.add(style.Loading);
    loading.appendChild(document.createElement('p'));
    loading.getElementsByTagName('p')[0].innerText = 'Loading.';
    loading.appendChild(document.createElement('div'));
    document.body.appendChild(loading);
}

export default loading;