import { Accomplishment, User } from '@logic/types';
import { Location } from '@logic/types';

type follower = {
    username: string;
    finished: Accomplishment[];
};

const initialGet = async (user: User, all: Location[]): Promise<Accomplishment[]> => {
    let activities: Accomplishment[] = [];

    const locationMap: { [key: string]: string } = {};
    all.forEach((loc) => locationMap[loc.dbname] = loc.name);
    
    for (const follower of user.following) {
        const data: follower = await fetchFollower(follower);
        
        if (data.finished.length > 0){
            console.log(data.finished[0].location);
            activities = activities.concat(
                data.finished.map((info: { location: string, time: number }) => ({
                    dbname: info.location,
                    location: locationMap[info.location] || info.location,
                    time: info.time,
                    user: data.username
                }))
            );}
        if (activities.length > 6) break;
    }
    
    const final = activities
        .sort((a, b) => b.time - a.time)
        .slice(0, Math.min(activities.length, 6));
    
    sessionStorage.setItem('activities', JSON.stringify(final));
    return final;
}

const fetchFollower = async (username: string): Promise<follower> => (
    await (
        await fetch(`/api/auth/get?username=${ encodeURIComponent(username) }`)
    ).json()
) as follower;

const getActivities = async (user: User, all: Location[]): Promise<Accomplishment[]> => {
    const activities = sessionStorage.getItem('activities');
    return activities ? JSON.parse(activities) : await initialGet(user, all);
};

export default getActivities;