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
    const [themeColor, setThemeColor] = useState("light")



    const login = useCallback( (jwtToken, id, username, email, isBanned, isAdmin, themeColor) => {
        setToken(jwtToken)
        setUserId(id)
        setUsername(username)
        setEmail(email)
        setIsBanned(isBanned)
        setIsAdmin(isAdmin)
        setThemeColor(themeColor)

        localStorage.setItem(storageName, JSON.stringify({
            token: jwtToken,
            userId: id, 
            username: username,
            email: email,
            isBanned: isBanned
        }))
        localStorage.setItem('theme-color', themeColor)
    },[])

    const logout = useCallback(() => {
        setToken(null)
        setUserId(null)
        setUsername(null)
        setEmail(null)
        setIsBanned(null)
        localStorage.removeItem(storageName)
        localStorage.setItem('theme-color', 'light')
        document.body.className = ''
    },[])

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName))
        const theme = localStorage.getItem('theme-color')
        //console.log("theme")
        //console.log(theme)

        if(data && data.token) {
            login(data.token, data.userId, data.username, data.email, data.isBanned, null, theme)
        }
        setReady(true)
    }, [login])

    return ({login, logout, token, userId, username, email, isBanned, isAdmin, ready})
}