import React from 'react'
import {Switch, Route, Router, Redirect} from 'react-router-dom'
import { UserPage } from './pages/UserPage'
import {AuthPage} from './pages/AuthPage'
import { SignupPage } from './pages/SignUpPage'
import { MainPage } from './pages/MainPage'
import { CreateTextPage } from './pages/CreateTextPage'
import { TextViewPage } from './pages/TextViewPage'
import { TextEditPage } from './pages/TextEditPage'
import { TestPage } from './pages/TestPage'
import { SearchResultsPage } from './pages/SearchResultsPage'


export const useRoutes = isAuthenticated => {
    console.log("isAuthenticated: " + isAuthenticated)
    if(isAuthenticated){
        return(
            <Switch>
                <Route path="/main" exact>
                    <MainPage />
                </Route>
                <Route path="/user/:id">
                    <UserPage/>
                </Route>
                <Route path="/test" exact>
                    <TestPage></TestPage>
                </Route>
                <Route path="/createTextPage" exact>
                    <CreateTextPage></CreateTextPage>
                </Route>
                <Route path="/text/:id/view">
                    <TextViewPage />
                </Route>
                <Route path="/text/:id/edit">
                    <TextEditPage />
                </Route>
                <Route path="/search/results/:text">
                    <SearchResultsPage></SearchResultsPage>
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
                <Route path="/test" exact>
                    <TestPage></TestPage>
                </Route>
                <Route path="/user/:id">
                    <UserPage/>
                </Route>
                <Route path="/text/:id/view">
                    <TextViewPage />
                </Route>
                <Route path="/search/results/:text">
                    <SearchResultsPage></SearchResultsPage>
                </Route>
                <Redirect to="/main"></Redirect>
            </Switch>
        )
}