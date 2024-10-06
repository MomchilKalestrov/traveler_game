'use client';

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L, { LatLngExpression, } from 'leaflet';
import InfoCard, { cardType } from "@app/components/infocard";
import React from "react";
import { location } from "@app/logic/types";
import "leaflet/dist/leaflet.css";

const playerPin = new L.Icon({
    iconUrl: '/icons/userpin.svg',
    iconSize: [ 26, 37 ],
});

const poiPin = new L.Icon({
    iconUrl: '/icons/poipin.svg',
    iconSize: [ 26, 37 ],
});

const Map = (
    props: {
        zoom?: number,
        userLocation?: { lat: number, lng: number } | undefined,
        locations?: Array<location>,
        reset: () => void
    }
) => {
    const [ visible, setVisible ] = React.useState<boolean>(false);
    const [ name,    setName    ] = React.useState<string | undefined>(undefined);
    const center: LatLngExpression = props.userLocation
        ? [ props.userLocation.lat, props.userLocation.lng ]
        : [ 42.143013705260884, 24.749279022216797 ];

    return (
        <>
            {
                visible &&
                <InfoCard
                    setter={ setVisible }
                    name={ name || '' }
                    type={ cardType.Track }
                    reset={ props.reset }
                />
            }
            <MapContainer
                center={ center }
                zoom={ 19 }
                scrollWheelZoom={ true }
                style={ { height: "100%", width: "100%" } }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.userLocation &&
                    <Marker
                        position={ [ props.userLocation.lat, props.userLocation.lng ] }
                        icon={ playerPin }
                    ></Marker>
                }
                {
                    props.locations?.map((location, index) => (
                        <Marker
                            key={ index }
                            position={ [ location.location.lat, location.location.lng ] }
                            icon={ poiPin }
                            eventHandlers={ {
                                click: () => {
                                    setVisible(true);
                                    setName(location.name);
                                }
                            } }                            
                        ></Marker>
                    ))
                }
            </MapContainer>
        </>
    )
}

export default Map;