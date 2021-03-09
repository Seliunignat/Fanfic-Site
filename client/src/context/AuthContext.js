import {createContext} from 'react'

function noop() {}

export const AuthContext = createContext({
    token: null,
    userId: null,
    username: null,
    email: null,
    login: noop,
    logout: noop,
    isAuthenticated: false,
    isBanned: false
})