'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Redirect: React.FC = () => {
    useRouter().replace('/');
    return (<></>);
};

export default Redirect;