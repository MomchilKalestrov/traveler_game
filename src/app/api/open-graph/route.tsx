import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

const size = {
    width: 1200,
    height: 630
}

const badgeSize = 22;
const paddingThickness = 3;
const borderRadius = paddingThickness;

const getBadgeSVG = (name: string): string =>
    `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ name }.svg`;

const GET = async (request: NextRequest) => {
    const params = new URL(request.url).searchParams;
    const location = params.get('location');

    return new ImageResponse(
        location ? (
            <>
                <div style={ {
                    width: `${ size.width }px`,
                    height: `${ size.height }px`,
                    display: 'flex',
                    position: 'absolute',
                    backgroundImage: `url(${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/bg/${ location }.png)`,
                    backgroundSize: `${ size.width }px ${ size.width }px`,
                    backgroundPosition: `0 -${ (size.width - size.height) / 2 }px`,
                    filter: 'blur(16px)',
                } } />
                <div style={ {
                    width: `${ badgeSize }rem`,
                    height: `${ badgeSize }rem`,
                    display: 'flex',
                    padding: `${ paddingThickness }rem`,
                    borderRadius: `${ borderRadius }rem`,
                    position: 'absolute',
                    top: `${ (size.height - badgeSize * 16) / 2 }px`,
                    left: `${ (size.width - badgeSize * 16) / 2 }px`,
                    backgroundColor: '#3d4133dd',
                } }>
                    <img
                        src={ getBadgeSVG(location) } alt='Venturo'
                        style={ {
                            width: `${ badgeSize - paddingThickness * 2 }rem`,
                            height: `${ badgeSize - paddingThickness * 2 }rem`
                        } }
                    />
                </div>
            </>
        ) : (
            <div style={ { display: 'flex' } }>
                <h1>Venturo</h1>
                <p>A game where you earn rewards by visiting the sights of Bulgaria.</p>
            </div>
        ),
        { ...size }
    );
}

export { GET };