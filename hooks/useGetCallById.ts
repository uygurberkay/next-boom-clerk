import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCallById = (id: string | string[]) => {
    const [ call , setCall ] = useState<Call>();
    const [ isCallLoading, setIsCallLoading ] = useState<boolean>(true)

    const client = useStreamVideoClient();

    useEffect(() => {
        if(!client) return;

        const loadCall = async () => {
            // Descructure calls filtered by 'id' parameter from stream api as an array
            const { calls } = await client.queryCalls({
                filter_conditions: {
                    id
                }
            })
            // setCall as first index of descructured calls parameter if is there any calls filtered by 'id' parameter
            if(calls.length > 0) setCall(calls[0])

            setIsCallLoading(false)
        }

        loadCall();
    }, [client, id])

    return { call, isCallLoading }
}