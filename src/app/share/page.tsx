import { NextPage, Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

type MetadataProps = {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const generateMetadata = async (
    { params, searchParams }: MetadataProps,
    parent: ResolvingMetadata
): Promise<Metadata> => {
    const location = (await searchParams)?.location || undefined;

    return {
        openGraph: {
            images: `/api/open-graph` + (location ? `?location=${location}` : ''),
        }
    };
};

const Page: NextPage = () => redirect('/');

export { generateMetadata };
export default Page;