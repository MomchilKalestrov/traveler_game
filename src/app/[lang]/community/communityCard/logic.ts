import store from '@logic/redux/store';
import { CommunityLandmark } from '@logic/types';

const markForVisit = async (e: React.MouseEvent<HTMLButtonElement>, landmark: CommunityLandmark) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch('/api/mark-for-visit', {
        method: 'POST',
        body: JSON.stringify({ name: `community#${ landmark.name }` })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'communityMadeLandmarks/markForVisit', payload: landmark });
    });
};

const unmarkForVisit = (e: React.MouseEvent<HTMLButtonElement>, landmark: CommunityLandmark) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch('/api/unmark-for-visit', {
        method: 'POST',
        body: JSON.stringify({ name: `community#${ landmark.name }` })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'communityMadeLandmarks/unmarkForVisit', payload: landmark });
    });
};

const deleteLandmark = (e: React.MouseEvent<HTMLButtonElement>, landmark: CommunityLandmark) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch(`/api/auth/user-made-landmarks?mode=delete&name=${ encodeURIComponent(landmark.name) }`, {
        method: 'POST',
        body: JSON.stringify({ name: landmark.name })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);
        store.dispatch({ type: 'userMadeLandmarks/remove', payload: landmark.name });
    });
};

const likeLandmark = (e: React.MouseEvent<HTMLButtonElement>, landmark: CommunityLandmark) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    target.disabled = true;

    fetch(`/api/auth/like-landmark`, {
        method: 'POST',
        body: JSON.stringify({ name: landmark.name })
    }).then((response) => {
        target.disabled = false;
        if (!response.ok) return alert(`Error: ${ response.status } ${ response.statusText }`);

        const username = store.getState().user.value?.username;
        store.dispatch({ type: 'communityMadeLandmarks/like', payload: { name: landmark.name, username } });
    });
};

const logic: { [ key: string ]: (e: React.MouseEvent<HTMLButtonElement>, landmark: CommunityLandmark) => void } = {
    markForVisit,
    unmarkForVisit,
    deleteLandmark,
    likeLandmark
};

export { markForVisit, unmarkForVisit, deleteLandmark, likeLandmark };
export default logic;