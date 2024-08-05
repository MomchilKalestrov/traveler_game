import React from "react";

const Home = (props: {ref: React.RefObject<HTMLDivElement> }) => {
    return (
        <div ref={ props.ref }>
            <h1>Home</h1>
        </div>
    );
}

export default Home;