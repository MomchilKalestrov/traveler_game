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
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  xp: number;
};

interface Accomplishment {
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
        following: string;
        followers: string;
        badges:    string;
        activity:  string;
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
};

const toLocation = (data: any): Location => ({
    name: data.name,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    },
    description: data.description,
    xp: data.xp
});

export type { User, Location, Accomplishment, Language };
export { toLocation };