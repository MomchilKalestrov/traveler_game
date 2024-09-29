'use server';
import { useRouter } from 'next/router'

const AgentHandler = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    if (navigator.userAgent.toLocaleLowerCase().includes('bot'))
        return router.push('/bot');

    return children;
}

export default AgentHandler;