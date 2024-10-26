/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'gsplsf3le8pssi3n.public.blob.vercel-storage.com',
            }
        ]
    }
};

export default nextConfig;
