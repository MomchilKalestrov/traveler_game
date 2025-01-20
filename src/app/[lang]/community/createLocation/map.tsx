import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const communityPin = new L.Icon({
    iconUrl: '/icons/communitypin.svg',
    iconSize: [ 32, 32 ],
    iconAnchor: [ 16, 16 ]
});

type MapProps = {
    locationSetter: React.Dispatch<React.SetStateAction<{ lat: number, lng: number }>>;
};

const Map: React.FC<MapProps> = ({ locationSetter }) => {
    const mapContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if(!mapContainerRef.current) return;
        

        const map =
            L.map(mapContainerRef.current, { zoomControl: false })
            .setView([ 42.7339, 25.4858 ], 6)
            .addLayer(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'))
            .on('click', (e: L.LeafletMouseEvent) => {
                locationSetter({ lat: e.latlng.lat, lng: e.latlng.lng });
                marker.setLatLng(e.latlng);
            });

        const marker =
            L.marker([ 42.7339, 25.4858 ], {
                icon: L.icon({
                    iconUrl: '/icons/communitypin.svg',
                    iconSize: [ 32, 32 ],
                    iconAnchor: [ 16, 16 ]
                })
            }).addTo(map);
        
        map
            .attributionControl
            .setPrefix('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

        return () => {
            map.removeLayer(marker);
            map.remove();
        };
    }, [ locationSetter ]);
    
    return (
        <div ref={ mapContainerRef } style={ { height: '100%', width: '100%' } }></div>
    );
};

export default Map;