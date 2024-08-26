'use client';
import React from 'react';
import style from './admin.module.css';

const Panel = () => {
    const sendNotification = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        alert('Sending notification...');
        fetch('/api/auth/admin/sendNotifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formData.get('title') || 'Notification',
                message: formData.get('message') || '',
                image: formData.get('image') || '/favicon.png'
            })
        }).then((response: any) => response.json())
        .then((data: any) => {
            if (data.error) alert('An error has occurred: \n' + data.error);
            else alert('Notification sent successfully.');
        })
    }

    const refreshImg = (event: React.FormEvent<HTMLInputElement>) => {
        if(!event.currentTarget.nextElementSibling) return;
        (event.currentTarget.nextElementSibling as HTMLImageElement).src = event.currentTarget.value;
    }

    return (
        <div className={ style.Admin }>
            <form className={ style.AdminPane } onSubmit={ sendNotification }>
                <h1>Notification sender</h1>
                <input type='text' placeholder='Title' name='title' />
                <input type='text' placeholder='Message' name='message' />
                <input type='text' placeholder='Image URL' name='image' onInput={ refreshImg } defaultValue='/favicon.png' />
                <img src='/favicon.png' />
                <button style={ { width: '100%' } }>Send</button>
            </form>
            <div className={ style.AdminPane }>
                <h1>Locations</h1>
                <input type='text' placeholder='Location name' name='name' />
                <input type='text' placeholder='Latitude' name='lat' />
                <input type='text' placeholder='Longitude' name='lon' />
                <button style={ { width: '100%' } }>Add</button>
            </div>
        </div>
    )
}

export default Panel;