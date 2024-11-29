import { NextPage } from 'next';
import { useRouter } from 'next/navigation';

const Page: NextPage = () => {
    const router = useRouter();
    router.replace('/bg/home');
    return (<></>);
};