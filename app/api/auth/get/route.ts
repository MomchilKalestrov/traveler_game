import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const GET = async (request: Request) => NextResponse.json(cookies().getAll());

export { GET };