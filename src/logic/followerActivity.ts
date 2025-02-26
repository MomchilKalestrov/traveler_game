import { Accomplishment, User } from '@logic/types';
import { Landmark } from '@logic/types';

const initialGet = async (user: User, allLandmarks: Landmark[]): Promise<Accomplishment[]> => {
    let activities: Accomplishment[] = [];

    const landmarkMap: { [ key: string  ]: string } = {};
    allLandmarks.forEach((landmark: Landmark) => landmarkMap[ landmark.dbname ] = landmark.name);
    
    for (let index: number = 0; index < user.following.length; index++) {
        const follower: User = await fetchFollower(user.following[ index ]);
        
        if (follower.visited.length > 0)
            activities = activities.concat(
                follower.visited.map(({ dbname, time }) => ({
                    dbname,
                    time,
                    landmarkname: landmarkMap[ dbname ],
                    username: follower.username
                }))
            );
        if (activities.length > 6) break;
    }
    
    const final = activities.sort((a, b) => b.time - a.time).slice(0, 6);
    
    sessionStorage.setItem('activities', JSON.stringify(final));
    return final;
}

const fetchFollower = async (username: string): Promise<User> => (
    await (
        await fetch(`/api/auth/get?username=${ encodeURIComponent(username) }`)
    ).json()
) as User;

const getActivities = async (user: User, allLandmarks: Landmark[]): Promise<Accomplishment[]> => {
    const activities = sessionStorage.getItem('activities');
    return activities ? JSON.parse(activities) : await initialGet(user, allLandmarks);
};

export default getActivities;