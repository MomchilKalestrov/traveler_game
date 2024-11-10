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

const toLocation = (data: any): Location => ({
    name: data.name,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    },
    description: data.description,
    xp: data.xp
});

export type { User, Location, Accomplishment };
export { toLocation };