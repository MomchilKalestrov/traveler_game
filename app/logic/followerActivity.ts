import { accomplishment, user } from '@logic/types';

type follower = {
    username: string,
    finished: Array<accomplishment>
};

const fetchFollower = async (username: string): Promise<follower> => (
    await (
        await fetch(`/api/auth/get?username=${ encodeURIComponent(username) }`)
    ).json()
) as follower;

const getActivities = async (userData: user): Promise<Array<accomplishment>> => {
    let activities: Array<accomplishment> = [];
    
    for (const user of userData.following) {
        const data: follower = await fetchFollower(user);
        
        if (data.finished.length > 0)
            activities = activities.concat(
                data.finished.map((info: { location: string, time: number }) => ({
                    ...info,
                    user: data.username
                }))
            );
        if (activities.length > 6) break;
    }
    // the bigger the number, the more recent the activity
    activities.sort((a, b) => b.time - a.time);
    return activities.slice(0, Math.min(activities.length, 6));
};

export default getActivities;