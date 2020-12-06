import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import { useGoogleAuth } from "../context/google-login-context";

const PrivateRoute = ({component: Component, path, ...rest}) => {
    const { isSignedIn } = useGoogleAuth();

    return (
        <div>
            <Route {...rest} render={props => (
                isSignedIn ?
                <Component {...props} />: 
                <Redirect exact from={path} to="/" />
            )} />
        </div>
    );
};

export default PrivateRoute;