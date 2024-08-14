'use client';
import style from './profile.module.css';

const Page = (
  props: {
    refs: React.Ref<HTMLElement>
    userData?: any
  }
) => {

  if (!props.userData)
    return (<main ref={ props.refs } style={ { display: 'none' } }>Loading...</main>);

  return (
    <main ref={ props.refs } style={ { display: 'none' } }>
      <div className={ style.ProfileContainer }>
        <div className={ style.ProfileCard }>
            <p>{ props.userData.username }</p>
        </div>
        {
          props.userData.finished.length > 0
          ? <div className={ `${ style.ProfileCard } ${ style.ProfileBadges }` }>
              <h2>Badges</h2>
              <div className={ style.ProfileDivider } />
              {
                props.userData.finished.map((data: string, key: number) =>
                  <img src={ `/badges/${ data }.svg` } alt={ data } key={ key } />
                )
              }
            </div>
          : <></>
        }
      </div>
    </main>
  );
}

export default Page;