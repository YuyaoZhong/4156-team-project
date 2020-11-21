import React from 'react'
import { SERVER_URL } from '../constants/constants';
import { useGoogleAuth } from './google-login-context';

export const DataContext = React.createContext()

// todo: write unified post methods;
// todo: move to sepearte components;
// const defaultTaskList = {"taskListId": 0, "taskListName": "Default"};
// const matchedTasks = tasks.reduce((res, item)=>{
//     if (!item.taskListId || String(item.taskListId) < 0){
//         return {...item, ...defaultTaskList}
//     }
//     let curTaskList = tasklists.find(tasklist=>(String(item.taskListId) === String(tasklist.id)))
//     if(!curTaskList){
//         curTaskList = {...defaultTaskList};
//     }
//     return {...item, ...defaultTaskList};
//  }, [])

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
       async function fetchData () {
            const getAllTimerRoute = `${SERVER_URL}/timers/?userId=${userId}`;
            const getAllTaskRoute = `${SERVER_URL}/tasks?userId=${userId}`;
            const getAllTasklistRoute = `${SERVER_URL}/tasklists/user${userId}`;
            const urls = [getAllTimerRoute, getAllTaskRoute, getAllTasklistRoute];
            const promises = urls.map(url=>fetch(url).then(r=>r.json()))
            await Promise.all(promises).then(res=>{
    
                setTimerList(res[0]["data"]);
                setTasks(res[1]["data"]);
                setTasklists(res[2]["data"]);
            })
       }

       fetchData();
    },[])
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

    const handleCreateTimer = (timerData) => {
        console.log(timerData);
        timerData.userId = userId;

        let route = `${SERVER_URL}/timers/`;
        // console.log(route);
        fetch(route, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(timerData)
        }).then(r=>r.json())
        .then(res=>{
            console.log(res);
            if(res.code === 201 && res.data){
                addTimer(res.data);
            }
        })
    }

    return (<DataContext.Provider value = {{
        tasks,
        tasklists,
        timerList,
        handleCreateTimer,

    }}>
        {props.children}
    </DataContext.Provider>)
}

export const useDataContext = () => React.useContext(DataContext);