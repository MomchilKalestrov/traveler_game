'use server';
import { NextPage, Metadata } from 'next';
import Redirect from './redirect';

type MetadataProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const generateMetadata = async ({ searchParams }: MetadataProps): Promise<Metadata> => {
    const landmark = (await searchParams)?.landmark;

    return {
        openGraph: {
            images: `/api/open-graph` + (landmark ? `?landmark=${ landmark }` : ''),
        }
    };
};

const Page: NextPage = () => <Redirect />;

export { generateMetadata };
export default Page;