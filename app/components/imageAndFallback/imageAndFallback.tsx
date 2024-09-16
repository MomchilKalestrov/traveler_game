import Image from 'next/image';
import React from 'react';

let counter = 0;

const ImageAndFallback = React.forwardRef<HTMLImageElement, {
        src: string,
        fallback: string,
        alt: string,
        width: number,
        height: number,
        style?: React.CSSProperties,
        className?: string,
    }
>((props, ref) => {
    const id = React.useRef(counter++ / 2);

    React.useEffect(() => {
        fetch(props.src)
            .then((res) => res.text())
            .then((text) => {
                if (text.includes('<!DOCTYPE html>')) return;
                const image = document.getElementById(`image-${ id.current }`) as HTMLImageElement;
                const data = text.split(':')[0] === 'data' ? text : `data:image/svg+xml;utf8,${ encodeURIComponent(text) }`;
                image.src = data;
            });
    }, []);
    
    return (
        <Image
            id={ `image-${ id.current }` }
            src={ props.fallback }
            alt={ props.alt }
            width={ props.width }
            height={ props.height }
            style={ props.style }
            ref={ ref }
        />
    );
});

export default ImageAndFallback;