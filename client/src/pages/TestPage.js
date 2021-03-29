import React, { useCallback, useEffect, useState } from 'react'
import { useHttp } from '../hooks/http.hook'

export const TestPage = () => {
    const [texts, setTexts] = useState(null)
    const {request, loading } = useHttp()

    const getTexts = useCallback( async () => {
        try {
            const fetched = await request('/api/text/latest', 'GET', null)
            // console.log(fetched)
        } catch (e) {
            console.log(e.message)
        }
    }, [request])

    useEffect(() => {
        getTexts()
    }, [getTexts])

    return(
        <div>
            <h1>test Page</h1>
        </div>
    )
}