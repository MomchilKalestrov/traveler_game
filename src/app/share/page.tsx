import { NextPage, Metadata } from 'next';
import { redirect } from 'next/navigation';

type MetadataProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const generateMetadata = async ({ searchParams }: MetadataProps): Promise<Metadata> => {
    const location = (await searchParams)?.location ?? null;

    console.log('Rendering OG image for: ', location);

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

const Page: NextPage = () =>
    redirect('/');

export { generateMetadata };
export default Page;