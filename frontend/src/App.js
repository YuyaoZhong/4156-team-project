import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from '../src/components/navbar/navbar';
import { GoogleAuthProvider } from '../src/context/google-login-context';
import { DataContextProvider } from '../src/context/data-context';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import HomepageHeading from './components/homepage';
import TimerTable from '../src/components/timerpage/timers-table';
import AllTaskLists from '../src/components/taskList/task-list';
import SingleTimer from '../src/components/timers/timer-info';
import TimelineBoard from '../src/components/timerpage/timer-board';
import RunningTimerContainer from '../src/components/timers/timer-running';
import CreateZoomPage from './components/zoom/zoom-page';
import './App.css';


function App() {
  return (
   <GoogleAuthProvider>
       <DataContextProvider>
          <Router>
            
            <NavBar/>
            <Switch>
              <PublicRoute
                path="/"
                exact
                component = {HomepageHeading}
                // render={() => (<div>Please Sign in first.</div>)}
              />
              <PrivateRoute
                path="/timers"
                component={TimerTable}
              />
              <PrivateRoute
                path = "/dashboard"
                component={TimelineBoard}
              />
              <PrivateRoute
                path="/tasks"
                component={AllTaskLists}
              />
              <PrivateRoute
                path = "/timer/:timerid"
                component = {SingleTimer}
              />
              <PrivateRoute
                path = "/running_timer"
                component = {RunningTimerContainer}
              />
              <Route
                path = "/zoom"
                exact
                component = {CreateZoomPage}
              />
          
          </Switch>
       </Router>
       </DataContextProvider>
   </GoogleAuthProvider>
  );
}

export default App;
