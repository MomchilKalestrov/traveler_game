import React from 'react';

type AdvertisementProps = {
    client: string;
    size: "small" | "medium" | "large";
};

const Advertisement: React.FC<AdvertisementProps> = ({ client, size }) => {
    switch (size) {
        case "medium":
            return (
                <ins
                    className="adsbygoogle"
                    style={ { display: "block" } }
                    data-ad-client={ client }
                    data-ad-slot="1596510511"
                    data-ad-format="auto"
                    data-full-width-responsive="true"
                />
            );
        case "small":
        case "large":
            return (<></>);
    };
}

export default Advertisement;