'use client';

const Page = (props: { refs: React.Ref<HTMLElement> }) => {
  
  return (
    <main ref={ props.refs }>Profile</main>
  );
}

export default Page;