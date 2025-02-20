'use server';
import { NextPage, Metadata, ResolvingMetadata } from 'next';
import Redirect from './redirect';

type MetadataProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const generateMetadata = async ({ searchParams }: MetadataProps): Promise<Metadata> => {
    const location = (await searchParams)?.location;

    return {
        openGraph: {
            images: `/api/open-graph` + (location ? `?location=${ location }` : ''),
        }
    };
};

const Page: NextPage = () => <Redirect />;

export { generateMetadata };
export default Page;