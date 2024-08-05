import React from "react";

const Settings = (props: {ref: React.RefObject<HTMLDivElement> }) => {
    return (
        <div ref={ props.ref }>
            <h1>Settings</h1>
        </div>
    );
}

export default Settings;