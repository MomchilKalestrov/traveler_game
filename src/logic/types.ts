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
};

interface Accomplishment {
    dbname: string;
    location: string;
    user: string;
    time: number;
};

interface Language {
    locale: string;
    home: {
        titles: {
            started:  string;
            new:      string;
            activity: string;
        };
        alts: {
            started: string;
            new:     string;
        };
    };

    profile: {
        [key: string]: any;
        following: string;
        followers: string;
        badges:    string;
        activity:  string;
        follow:    string;
        unfollow:  string;
    };

    leaderboard: {
        top: string;
    };

    auth: {
        login: {
            title:  string;
            button: string;
        },
        signup: {
            title:  string;
            button: string;
        }
        inputs: {
            username: string;
            password: string;
            verify:   string;
        }
    }

    misc: {
        lookup: {
            title:   string;
            nouser:  string;
            error:   string;
        };
        settings: {
            title: string;
            logout: {
                title: string;
                description: string;
            };
            language: {
                title: string;
                description: string;
                alert: string;
            };
        };
        accomplishment: {
            title: string;
        };
        infocards: {
            start:  string;
            stop:   string;
            finish: string;
            view:   string;
        };
        navbar: {
            home:        string;
            map:         string;
            profile:     string;
            leaderboard: string;
        };
        GPSaccess: {
            title: string;
            description: string;
            accept: string;
            decline: string;
        }
    };
    [key: string]: any;
};

const toLocation = (data: any): Location => ({
    ...data,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    }
});

export type { User, Location, Accomplishment, Language };
export { toLocation };