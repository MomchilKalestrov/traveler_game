type user = {
    username: string,
    finished: Array<{
        location: string
        time: number
    }>,
    started: string[],
    followers: string[],
    following: string[],
    xp: number
}

type location = {
  name: string,
  location: {
    lat: number,
    lng: number
  },
  description: string,
  xp: number
};

type accomplishment = {
  location: string,
  user: string,
  time: number
};

const toLocation = (data: any): location => ({
    name: data.name,
    location: {
        lat: parseFloat(data.location.lat['$numberDecimal']),
        lng: parseFloat(data.location.lng['$numberDecimal'])
    },
    description: data.description,
    xp: data.xp
});

export type { user, location, accomplishment };
export { toLocation };