import React from 'react'
import { SERVER_URL } from '../constants/constants';
import { useGoogleAuth } from './google-login-context';

export const DataContext = React.createContext()

// todo: write unified post methods;

const upsertData = (route, data, method) => {
    return fetch(route, {
        method: method,
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(r=>r.json())
};



export const DataContextProvider = props => {
    const [timerList, setTimerList] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [tasklists, setTasklists] = React.useState([]);
    const [running, setRunning]  = React.useState(false); // may not need, just keep
    const [timerRun, setTimerRun] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const {isSignedIn, googleUser} = useGoogleAuth();
    const userId = isSignedIn ? googleUser.googleId : ""

    React.useEffect(()=>{
    setLoading(true);
       async function fetchData () {
            const getAllTimerRoute = `${SERVER_URL}/timers/?userId=${userId}`;
            const getAllTaskRoute = `${SERVER_URL}/tasks?userId=${userId}`;
            const getAllTasklistRoute = `${SERVER_URL}/tasklists/user${userId}`;
            const urls = [getAllTimerRoute, getAllTaskRoute, getAllTasklistRoute];
            const promises = urls.map(url=>fetch(url).then(r=>r.json()))
            await Promise.all(promises).then(res=>{
                // console.log(res);
                setTimerList(res[0]["data"]);
                setTasks(res[1]["data"]);
                setTasklists(res[2]["data"]);
            })
            setLoading(false);
       }

       fetchData();
    },[isSignedIn, userId])
    // test ouput
    // console.log('timer run', timerRun);
    // console.log('running', running);
    // interval check timer running -- not sure about the implementation, should check
    const checkTImerRunning = () => {
        // may need to change fetching first
        console.log('in checking', timerList);
        console.log('timer run', timerRun);
        console.log('running', running);
        const curTime = new Date();
        if (timerList.length > 0 && Object.keys(timerRun) === 0){
  
            const firstTimer = Object.assign({}, timerList[0]);
            const nextStartTime = new Date(firstTimer.startTime);
            const differTime = nextStartTime - curTime; // millseconds
            console.log('in checcking time diff', differTime);
            if (differTime < 0.5 * 60000){ // less than one minutes
                setTimerRun(firstTimer);
                setRunning(true);
            }
        }

        if (Object.keys(timerRun) !== 0) {
            const lastMins = timerRun.round * (timerRun.duration + timerRun.breakTime);
            const endTime = new Date(new Date(timerRun.startTime).getTime() + lastMins * 60000);
            if (curTime.getTime() - endTime.getTime() >= 0){
                setTimerRun({});
                setRunning(false);
            }
        }
    }

    React.useEffect(()=>{
        const intervalTime = 10000;
        // run every second
        const checkTimer = setInterval(checkTImerRunning(), intervalTime);
        return ()=> clearInterval(checkTimer)
    }, [timerList])

    const addTimer = (newTime) => {
        const newTimerList = timerList.splice(0);
        newTimerList.push(newTime);
        newTimerList.sort((a, b)=> (new Date(a.startTime) - new Date(b.startTime)));
        setTimerList(newTimerList);
        // setTimerList(state=>{
        //     const newState = state.splice(0);
        //     newState.push(newTime);
        //     newState.sort((a, b)=> (new Date(a.startTime) - new Date(b.startTime)));
        //     console.log('in add timer', newState)
        //     return newState
        // });
    }

    const handleCreateTimer = (timerData, edit) => {
        console.log(timerData);
        timerData.userId = userId;

        const route = `${SERVER_URL}/timers/`;
        upsertData(route, timerData, 'POST').then(res=>{
            // console.log(res);
            if(res.code === 201 && res.data){
                addTimer(res.data);
            }
        })
    }

    const handleUpsertTask = async (taskData, edit) => {
        taskData.userId = userId;
        const route = edit? `${SERVER_URL}/tasks/${taskData.id}`:`${SERVER_URL}/tasks`;
        const method = edit ? 'PUT' : 'POST';
        console.log(taskData, route)
        await upsertData(route, taskData, method).then(res=>{
            console.log('in upsert task', res)
         if(res.code === 201 && res.data){
             setTasks(state=>{
                 // todo: sort default by incomplete / compete
                 const newState = state.splice(0);
                 let idx = -1;
                 if(edit){
                   idx = newState.findIndex(item=>(String(item.id) === String(taskData.id)));
                 }
                 if (idx === -1){
                    newState.push(res.data);
                 } else {
                     newState[idx] = res.data;
                 }
                 
                 return newState;
             });
         }
        })
    }

    return (<DataContext.Provider value = {{
        tasks,
        tasklists,
        timerList,
        loading,
        handleCreateTimer,
        handleUpsertTask,
    }}>
        {props.children}
    </DataContext.Provider>)
}

export const useDataContext = () => React.useContext(DataContext);