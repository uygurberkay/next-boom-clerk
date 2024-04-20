'use client'
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useState } from 'react'

interface MeetingProps  {
    params: {
        id: string;
    }
}

const Meeting = ({ params }: MeetingProps) => {

    const [ isSetupCompleted, setIsSetupCompleted ] = useState(false)
    const { user, isLoaded } = useUser();
    const { call , isCallLoading } = useGetCallById(params.id)

    if(!isLoaded ||isCallLoading) return <Loader/>

    return (
        <main className='h-screen w-full'>
            <StreamCall call={call}>
                <StreamTheme>
                    {!isSetupCompleted ? (
                        <MeetingSetup setIsSetupComplete={setIsSetupCompleted} />
                    ): ( 
                        <MeetingRoom />
                    )}

                </StreamTheme>
            </StreamCall>
        </main>
    )
}

export default Meeting
