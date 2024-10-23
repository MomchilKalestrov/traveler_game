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

export type { user, location, accomplishment };