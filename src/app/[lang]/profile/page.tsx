'use client';
import React from 'react';
import { NextPage }    from 'next';
import { useSelector } from 'react-redux';

import LoadingPlaceholder from '@components/loading';
import UserInfo from '@src/components/playerInfo';

import LanguageCTX   from '@logic/contexts/languageCTX';
import { RootState } from '@logic/redux/store';
import { Language, User } from '@logic/types';

const Page: NextPage = () => {
    const language: Language | undefined = React.useContext(LanguageCTX);

    const user: User | undefined = useSelector((state: RootState) => state.user.value);

    // const loadProfilePicture = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (!files) return;
    //     const file = files[0];
    //     if (!file) return;

    //     const reader = new FileReader();

    //     reader.onloadend = () => {
    //         if(!reader.result) return;
            
    //         const blob = new Blob([ reader.result ], { type: file.type });
            
    //         fetch('/api/auth/changepfp', {
    //             method: 'POST',
    //             body: blob,
    //             headers: {
    //                 'Content-Type': file.type,
    //                 'Content-Disposition': `attachment; filename="${ file.name }"`
    //             }
    //         }).then(res => {
    //             if(!res.ok) return console.error('Couldn\'t upload the image.');

    //             setProfilePicture(URL.createObjectURL(blob));
    //             caches.open('offlineCacheV10').then(cache => {
    //                 cache.delete(`/profile/${ user?.username }.png`)
    //                 cache.keys().then(keys => {
    //                     keys.forEach(request => {
    //                         if(request.url.includes(`/profile/${ user?.username }.png`))
    //                             cache.delete(request);
    //                     });
    //                 });
    //             });
    //         })
    //     };
    //
    //    reader.readAsArrayBuffer(file);
    //};

  if (!user || !language) return (<LoadingPlaceholder />);

  return (
    <main>
        <UserInfo user={ user } />
    </main>
  );
};

export default Page;