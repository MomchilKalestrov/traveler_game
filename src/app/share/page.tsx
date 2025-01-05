import { NextPage, Metadata } from 'next';

import Redirect from './redirect';

type MetadataProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const generateMetadata = async ({ searchParams }: MetadataProps): Promise<Metadata> => {
    const location = (await searchParams)?.location ?? null;

    return {
        title: 'Venturo',
        description: 'A game where you earn rewards by visiting the sights of Bulgaria.',
        icons: [ '/favicon.ico', '/favicon.png' ],
        openGraph: {
            images: [
                location ? `/api/open-graph?location=${ location }` : '/api/open-graph'
            ]
        }
    };
};

const Page: NextPage = () => (<Redirect />);

export { generateMetadata };
export default Page;