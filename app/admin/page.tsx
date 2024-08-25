'use client';

const Page = () => {

    const send = async () => {
        fetch('/admin/fuck');
    }

    return <button onClick={send} style={ { color: 'black' } }>Send notification</button>;
}

export default Page;