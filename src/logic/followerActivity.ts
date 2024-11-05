import { accomplishment, user } from '@logic/types';

type follower = {
    username: string;
    finished: accomplishment[];
};

const initialGet = async (user: user): Promise<accomplishment[]> => {
    let activities: accomplishment[] = [];
    
    for (const follower of user.following) {
        const data: follower = await fetchFollower(follower);
        
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
    sessionStorage.setItem('activities', JSON.stringify(activities));
    return activities.slice(0, Math.min(activities.length, 6));
}

const fetchFollower = async (username: string): Promise<follower> => (
    await (
        await fetch(`/api/auth/get?username=${ encodeURIComponent(username) }`)
    ).json()
) as follower;

const getActivities = async (user: user): Promise<accomplishment[]> => {
    const activities = sessionStorage.getItem('activities');
    return activities ? JSON.parse(activities) : await initialGet(user);
};

export default getActivities;