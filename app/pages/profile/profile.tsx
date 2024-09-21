'use client';
import React from 'react';
import style from './profile.module.css';
import { loading, stopLoading } from '@components/loading/loading';
import Image from 'next/image';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {
  const reference = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!props.userData)
      fetch('/api/auth/profile')
        .then(response => {
          if (!response.ok) return;
          return response.json();
        })
        .then(data => {
          if (!data || !reference.current) return;
          
          reference.current.src = data;
          reference.current.srcset = data;
        });
  }, [props]);

  const changeProfilePhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    loading();
    const file = event.target?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) return;

      fetch('/api/auth/profileimage', {
        method: 'POST',
        body: JSON.stringify({ image: event.target?.result })
      }).then((response) => {
        if (!response.ok) return alert('Failed to upload image');
        if (reference.current) {
          reference.current.src = event.target?.result as string;
          reference.current.srcset = event.target?.result as string;
        }
        stopLoading();
      });
    };
    
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      stopLoading();
    };
    
    reader.readAsDataURL(file);
  }

  if (!props.userData)
    return (
      <main ref={ props.refs } style={ { display: 'none' } }>
        <Image
          src='/icons/loading.svg'
          alt='Loading'
          width={ 64 }
          height={ 64 }
          style={ {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          } }
        />
      </main>
    );

  const bytes = new TextEncoder().encode(props.userData.username.slice(0, 3));
    
  const red = bytes[0].toString(16).padStart(2, '0');
  const green = bytes[1].toString(16).padStart(2, '0');
  const blue = bytes[2].toString(16).padStart(2, '0');
  const color = `#${ red }${ green }${ blue }`;

  const r_red = (256 - bytes[0]).toString(16).padStart(2, '0');
  const r_green = (256 - bytes[1]).toString(16).padStart(2, '0');
  const r_blue = (256 - bytes[2]).toString(16).padStart(2, '0');
  const r_color = `#${ r_red }${ r_green }${ r_blue }`;

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ `${ style.ProfileCard } ${ style.ProfileInfo }` }>
            <div className={ style.ProfilePhoto }>
              <Image
                src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/user/${ props.userData.username }.png` }
                ref={ reference } alt={ props.userData.username[0] } width={ 64 } height={ 64 }
                style={ { backgroundColor: color, color: r_color } }
              />
              <input type="file" accept="image/png" onChange={ changeProfilePhoto } />
            </div>
            <h2>{ props.userData.username }</h2>
            <div>
              <p><b>{ props.userData.followers.length }</b> followers</p>
              <p><b>{ props.userData.following.length }</b> following</p>
            </div>
        </div>
        {
          props.userData.finished.length > 0 &&
          <div className={ `${ style.ProfileCard }` }>
            <h2>Badges</h2>
            <div className={ style.ProfileDivider } />
            <div className={ style.ProfileBadges }>
              {
                props.userData.finished.map((data: string, key: number) =>
                  <Image
                    src={ `${ process.env.NEXT_PUBLIC_BLOB_STORAGE_URL }/ico/${ data }.svg` }
                    alt={ data } key={ key } width={ 48 } height={ 48 }
                  />
                )
              }
            </div>
          </div>
        }
      </div>
    </main>
  );
}

export default Page;