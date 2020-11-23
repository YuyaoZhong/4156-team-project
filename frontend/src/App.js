import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from '../src/components/navbar/navbar';
import { GoogleAuthProvider } from '../src/context/google-login-context';
import { DataContextProvider } from '../src/context/data-context';
import TimerForm from '../src/components/timerpage/timer-form';
import AllTaskLists from '../src/components/taskList/task-list';
import SingleTimer from '../src/components/timers/timer-info';
import TimelineBoard from '../src/components/timerpage/timer-board';
import RunningTimerContainer from '../src/components/timers/timer-running';
import './App.css';


function App() {
  return (
   <GoogleAuthProvider>
       <DataContextProvider>
          <Router>
            
            <NavBar/>
            <Switch>
              <Route
                path="/"
                exact
                render={() => (<div>Dash Board</div>)}
              />
              <Route
                path="/timers"
                component={TimerForm}
              />
              <Route
                path = "/dashboard"
                component={TimelineBoard}
              />
              <Route
                path="/tasks"
                component={AllTaskLists}
              />
              <Route
                path = "/timer/:timerid"
                component = {SingleTimer}
              />
              <Route
                path = "/running_timer"
                component = {RunningTimerContainer}
              />
          
          </Switch>
       </Router>
       </DataContextProvider>
   </GoogleAuthProvider>
  );
}

export default App;
