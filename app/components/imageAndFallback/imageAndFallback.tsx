import Image from 'next/image';
import React from 'react';

const ImageAndFallback = (
    props: {
        src: string,
        fallback: string,
        alt: string,
        width: number,
        height: number,
        style?: React.CSSProperties,
        className?: string,
        ref?: React.Ref<HTMLImageElement>
    }
) => {
    const [fallback, setFallback] = React.useState(false);
    
    return (
        <Image
            src={ fallback ? props.fallback : props.src }
            alt={ props.alt }
            width={ props.width }
            height={ props.height }
            style={ props.style }
            ref={ props.ref }
            onError={ () => setFallback(true) }
        />
    );
}

export default ImageAndFallback;