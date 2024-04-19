import MeetingTypeList from '@/components/MeetingTypeList'
import React from 'react'

const Home = () => {
    const now = new Date()

    const time = now.toLocaleTimeString('en-EN', { hour: 'numeric', minute: '2-digit'})
    const date = (new Intl.DateTimeFormat('tr-TR', {dateStyle: 'full'})).format(now)

    return (
        <section className='flex size-full flex-col gap-10 text-white'>
            <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
                <div className='flex h-full flex-col justify-between max-lg:px-5 max-lg:py-8 lg:p-11'>
                    <h2 className='glassmorphism max-w-[270] rounded py-2 text-center font-normal'>
                        Upcoming Meeting at : 12:30 PM
                    </h2>
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-4xl font-extrabold lg:text-5xl'>
                            {time}
                            <p className='text-lg font-medium text-sky-1 lg:text-xl'>{date}</p>
                        </h1>
                    </div>
                </div>
            </div>

            <MeetingTypeList />

        </section>
    )
}

export default Home
