import React from 'react';
import satori from 'satori';

import { Location } from '@logic/types';
import { getBadgeSVG, unixToDate } from '@logic/utils';

const shortenString = (text: string): string => {
    if (text.length <= 15) return text;
    return `${ text.slice(0, 15) }...`;
}

const svgToPng = async (svg: string): Promise<string> => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 208;
    canvas.height = 208;

    const image = new Image();
    image.src = `data:image/svg+xml,${ encodeURIComponent(svg) }`;

    return new Promise((resolve) =>
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;

            context?.drawImage(image, 0, 0);

            canvas.toBlob((blob) => resolve(URL.createObjectURL(blob as Blob)), 'image/png');
        }
    );
}

const getShareCard = async (location: Location, time: number): Promise<string> =>
    satori(
        <div style={ {
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flexDirection: 'column',
            padding: '1rem',
            backgroundColor: '#3d4133',
            width: '13rem',
            height: '13rem',
            position: 'relative',
            borderRadius: '0.75rem',
            color: '#e9ebe1'
        } }>
            <div style={ { display: 'flex', gap: '0.5rem', width: '100%', flexDirection: 'column' } }>
                <p  style={ { margin: '0px' } }>I visited:</p>
                <h2 style={ { margin: '0px' } }>{ shortenString(location.name) }</h2>
                <p  style={ { margin: '0px' } }>on { unixToDate(time) }.</p>
            </div>
            <h3 style={ { position: 'absolute', left: '1rem', bottom: '0px' } }>Venturo</h3>
            <img
                src={ getBadgeSVG(location.dbname) } alt='Venturo'
                style={ {
                    position: 'absolute',
                    right: '1rem', bottom: '1rem',
                    width: '3.5rem', height: '3.5rem'
                } } />
        </div>,
        {
            width: 208,
            height: 208,
            fonts: [ {
                name: 'Roboto',
                weight: 400,
                data: await (await fetch('/fonts/Roboto-Regular.ttf')).arrayBuffer()
            }, {
                name: 'Roboto',
                weight: 700,
                data: await (await fetch('/fonts/Roboto-Bold.ttf')).arrayBuffer()
            } ]
        }
    ).then(svgToPng);

export default getShareCard;