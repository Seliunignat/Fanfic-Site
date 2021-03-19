import {useState, useCallback, useEffect} from 'react'

const storageName = 'userData'

export const useAuth = () => {
    const [token, setToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [email, setEmail] = useState(null)
    const [isBanned, setIsBanned] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [username, setUsername] = useState(null)
    const [ready, setReady] = useState(false)



    const login = useCallback( (jwtToken, id, username, email, isBanned, isAdmin) => {
        setToken(jwtToken)
        setUserId(id)
        setUsername(username)
        setEmail(email)
        setIsBanned(isBanned)
        setIsAdmin(isAdmin)

        localStorage.setItem(storageName, JSON.stringify({
            token: jwtToken,
            userId: id, 
            username: username,
            email: email,
            isBanned: isBanned,
            isAdmin: isAdmin
        }))
    },[])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUsername(null)
        setEmail(null)
        setIsBanned(null)
        localStorage.removeItem(storageName)
    },[])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))

        if(data && data.token) {
            login(data.token, data.userId, data.username, data.email, data.isBanned)
        }
        setReady(true)
    }, [login])

    return ({login, logout, token, userId, username, email, isBanned, ready})
}