'use client'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import Loader from './Loader'

import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea'
import ReactDatePicker from "react-datepicker";

type meetingStatus = 'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined

const initialValues = {
    dateTime: new Date(),
    description: '',
    link: '',
};

const MeetingTypeList = () => {
    const router = useRouter()

    const [meetingState, setMeetingState] = useState<meetingStatus>()
    const [values, setValues] = useState(initialValues)
    const [callDetails, setCallDetails] = useState<Call>()

    const { toast } = useToast();
    const { user } = useUser();
    const client = useStreamVideoClient()

    const createMeeting = async () => {
        // validations
        if(!client || !user) return
        
        try {
            if(!values.dateTime) {
                toast({ title: 'Please select a date and time' })
                return;
            }
            // create random id with crypto ( default mdn package )
            const id = crypto.randomUUID()
            const call = client.call('default', id)
            
            if(!call) throw new Error('Failed to create call')
            
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    },
                },
            });

            setCallDetails(call)

            if(!values.description) {
                router.push(`/meeting/${call.id}`)
            }

            toast({ title: 'Meeting Created' })
            
        } catch (error) {
            console.log(error)
            toast({ title: 'Failed to Create Meeting' })
        }
    }

    if (!client || !user) return <Loader />;

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
        <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
            {/* Home Cards */}
            <HomeCard
                img="/icons/add-meeting.svg"
                title="New Meeting"
                description="Start an instant meeting"
                handleClick={() => setMeetingState('isInstantMeeting')}
                className='bg-orange-1'
            />
            <HomeCard
                img="/icons/join-meeting.svg"
                title="Join Meeting"
                description="via invitation link"
                className="bg-blue-1"
                handleClick={() => setMeetingState('isJoiningMeeting')}
            />
            <HomeCard
                img="/icons/schedule.svg"
                title="Schedule Meeting"
                description="Plan your meeting"
                className="bg-purple-1"
                handleClick={() => setMeetingState('isScheduleMeeting')}
            />
            <HomeCard
                img="/icons/recordings.svg"
                title="View Recordings"
                description="Meeting Recordings"
                className="bg-yellow-1"
                handleClick={() => router.push('/recordings')}
            />

            {/* Meeting Modals */}
            {/* Schedule meeting's Modal */}
            {!callDetails ? (
                <MeetingModal 
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Create Meeting"
                    handleClick={createMeeting}
                >
                    {/* Description */}
                    <div className='flex flex-col gap-2.5'>
                        <label className='text-base text-normal leading-[22px] text-sky-2'>
                            <p className='pb-2'> Add a description </p>
                            <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => {
                                setValues({...values,description: e.target.value})
                            }}/>
                        </label>
                    </div>
                    {/* Time Picker */}
                    <div className='flex w-full flex-col gap-2.5'>
                        <label className='text-base font-normal leading-[22.4px] text-sky-2'>
                            <p className='pb-2'> Select Date and Time </p>
                        </label>
                        <ReactDatePicker
                            selected={values.dateTime}
                            onChange={(date) => setValues({ ...values, dateTime: date! })}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className=" w-full rounded bg-dark-3 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>
            ): (
                <MeetingModal 
                    isOpen={meetingState === 'isScheduleMeeting'}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    className='text-center'
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink)
                        toast({ title: 'Link Copied'})
                    }}
                    image='/icons/checked.svg'
                    buttonIcon='/icons/copy.svg'
                    buttonText='Copy Meeting Link'
                />

            )}
            {/* New meeting's Modal */}
            <MeetingModal 
                isOpen={meetingState === 'isInstantMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="Start an Instant Meeting"
                className='text-center'
                buttonText='Start Meeting'
                handleClick={createMeeting}
            />

        </section>
    )
}

export default MeetingTypeList
