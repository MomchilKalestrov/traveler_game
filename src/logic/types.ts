interface User {
    username: string;
    finished: Array<{
        location: string;
        time: number;
    }>;
    started: string[];
    followers: string[];
    following: string[];
    xp: number;
};

interface Location {
    name: string;
    description: string;
    location: {
        lat: number;
        lng: number;
    };
    xp: number;
    dbname: string;
    type: 'water' | 'nature' | 'structure' | 'misc';
};

interface CommunityLocation {
    _id: string;
    name: string;
    author: string;
    location: {
        lat: number;
        lng: number;
    };
    likes: string[];
    visits: number;
};

interface Accomplishment {
    dbname: string;
    location: string;
    user: string;
    time: number;
};

interface Language {
    [key: string]: any;
    locale: string;
    gamename: string;
    home: {
        [key: string]: any;
        titles: {
            [key: string]: any;
            started: string;
            activity: string;
            types: {
                [key: string]: any;
                water: string;
                nature: string;
                structure: string;
                misc: string;
            }
        };
        alts: {
            [key: string]: any;
            started: string;
        };
    };

    profile: {
        [key: string]: any;
        following: string;
        followers: string;
        badges: string;
        activity: string;
        follow: string;
        unfollow: string;
    };

    leaderboard: {
        [key: string]: any;
        top: string;
    };

    auth: {
        [key: string]: any;
        login: {
            [key: string]: any;
            title: string;
            button: string;
        },
        signup: {
            [key: string]: any;
            title: string;
            button: string;
        }
        inputs: {
            [key: string]: any;
            username: string;
            password: string;
            verify: string;
        };
    };

    community: {
        [key: string]: any;
        titles: {
            [key: string]: any;
            create:  string;
            started: string;
            new:     string;
        };
        alts: {
            [key: string]: any;
            created: string;
            started: string;
        };
        filters: {
            [key: string]: any;
            recentlyAdded: string;
            mostVisited:   string;
            mostLiked:     string;
        };
        buttons: {
            [key: string]: any;
            start:  string;
            stop:   string;
            delete: string;
        };
        create: {
            [key: string]: any;
            input:  string;
            warn:   string
            submit: string;
            error:  {
                [key: string]: any;
                invalid: string;
                server:  string;
            };
        }
        loadMore: string;
    };

    about: {
        [key: string]: any;
        pages: {
            [key: string]: any;
            home: string;
            download: string;
            login: string;
        };
        tagline: string;
        download: string;
        info: {
            [key: string]: any;
            about: {
                [key: string]: any;
                title: string;
                content: string;
            };
        };
    };

    misc: {
        [key: string]: any;
        lookup: {
            [key: string]: any;
            title: string;
            nouser: string;
            error: string;
        };
        settings: {
            [key: string]: any;
            title: string;
            logout: {
                [key: string]: any;
                title: string;
                description: string;
            };
            language: {
                [key: string]: any;
                title: string;
                description: string;
                alert: string;
            };
        };
        accomplishment: {
            [key: string]: any;
            title: string;
        };
        infocards: {
            [key: string]: any;
            start: string;
            stop: string;
            view: string;
        };
        navbar: {
            [key: string]: any;
            home: string;
            map: string;
            profile: string;
            leaderboard: string;
        };
        GPSaccess: {
            [key: string]: any;
            title: string;
            description: string;
            accept: string;
            decline: string;
        }
    };
};

const toLocation = (data: any): Location => ({
    ...data,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    }
});

const toCommunityLocation = (data: any): CommunityLocation => ({
    ...data,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    }
});

export type { User, CommunityLocation, Location, Accomplishment, Language };
export { toLocation, toCommunityLocation };