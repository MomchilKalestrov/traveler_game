import React from "react";

const Map = (props: {ref: React.RefObject<HTMLDivElement> }) => {
    return (
        <div ref={ props.ref }>
            <h1>Map</h1>
        </div>
    );
}

export default Map;