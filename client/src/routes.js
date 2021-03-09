import React from 'react'
import {Switch, Route, Router, Redirect} from 'react-router-dom'
import { UserPage } from './pages/UserPage'
import {AuthPage} from './pages/AuthPage'
import { SignupPage } from './pages/SignUpPage'
import { MainPage } from './pages/MainPage'
import { TestPage } from './pages/TestPage'
import { CreateTextPage } from './pages/CreateTextPage'


export const useRoutes = isAuthenticated => {
    console.log("isAuthenticated: " + isAuthenticated)
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/main" exact>
                    <MainPage />
                </Route>
                <Route path="/user" exact>
                    <UserPage/>
                </Route>
                <Route path="/test" exact>
                    <TestPage ></TestPage>
                </Route>
                <Route path="/createTextPage" exact>
                    <CreateTextPage></CreateTextPage>
                </Route>
                <Redirect to="/main"></Redirect>
            </Switch>
        )
    }

        return(
            <Switch>
                <Route path="/login" exact>
                    <AuthPage />
                </Route>
                <Route path="/registration" exact>
                    <SignupPage />
                </Route>
                <Route path="/main" exact>
                    <MainPage ></MainPage>
                </Route>
                <Redirect to="/main"></Redirect>
            </Switch>
        )
}