import React from 'react';
import { useGoogleLogin } from 'react-use-googlelogin';
import { GOOGLE_CLIENT_ID } from '../constants/constants';

export const GoogleAuthContext = React.createContext();

// mark: change to process.env will be better
export const GoogleAuthProvider = ({ children }) => {
    const googleAuth = useGoogleLogin({
        clientId: GOOGLE_CLIENT_ID
    });

    return (<GoogleAuthContext.Provider value={googleAuth}>
        {children}
    </GoogleAuthContext.Provider>);
}

export const useGoogleAuth = () => React.useContext(GoogleAuthContext);