// src/components/map/index.tsx

"use client"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import InfoCard, { cardType } from "@app/components/infocard";
import React from "react";
import { location } from "@app/logic/types";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

const Map = (
    props: {
        posix: LatLngExpression | LatLngTuple,
        zoom?: number,
        playerLocation?: LatLngExpression | LatLngTuple,
        locations?: Array<location>,
        reset: () => void
    }
) => {
    const [ visible, setVisible ] = React.useState<boolean>(false);

    return (
        <>
            {
                visible &&
                <InfoCard
                    setter={ setVisible }
                    name={ "name" }
                    type={ cardType.Track }
                    reset={ props.reset }
                />
            }
            <MapContainer
                center={ props.posix }
                zoom={ 19 }
                scrollWheelZoom={ true }
                style={ { height: "100%", width: "100%" } }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.locations?.map((location, index) => (
                        <Marker
                            key={ index }
                            position={ [ location.location.lat, location.location.lng ] }
                            eventHandlers={ {
                                click: () => setVisible(true)
                            } }                            
                        ></Marker>
                    ))
                }
            </MapContainer>
        </>
    )
}

export default Map;