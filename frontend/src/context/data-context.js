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

const timerSort = (a, b)=> (new Date(a.startTime) - new Date(b.startTime))
const getEndTime = (timer) => (new Date(new Date(timer.startTime).getTime() + (timer.duration + timer.breakTime) * timer.round * 60000));

export const DataContextProvider = props => {
    const [timerList, setTimerList] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [tasklists, setTasklists] = React.useState([]);
    const [running, setRunning]  = React.useState(false); // may not need, just keep
    const [timerRun, setTimerRun] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [curTime, setCurTime] =  React.useState(new Date().getTime());

    const {isSignedIn, googleUser} = useGoogleAuth();
    const userId = isSignedIn ? googleUser.googleId : ""

    React.useEffect(()=>{
    setLoading(true);
       async function fetchData () {
            const getAllTimerRoute = `${SERVER_URL}/timers/?userId=${userId}`;
            const getAllTaskRoute = `${SERVER_URL}/tasks?userId=${userId}`;
            const getAllTasklistRoute = `${SERVER_URL}/tasklists/user/117310065298163219549`;
            const urls = [getAllTimerRoute, getAllTaskRoute, getAllTasklistRoute];
            const promises = urls.map(url=>fetch(url).then(r=>r.json()))
            console.log(getAllTasklistRoute)
            await Promise.all(promises).then(res=>{
                // console.log(res);
                // todo: seperate past timers
                const timers = res[0]["data"].sort(timerSort);
                setTimerList(timers);
                setTasks(res[1]["data"]);
                setTasklists(res[2]["data"]);
            })
            setLoading(false);
       }

       fetchData();
    },[isSignedIn, userId])

    const checkTImerRunning = () => {
        // may need to change fetching first

        const curTime = new Date();
        if (Object.keys(timerRun) !== 0) {
            const lastMins = timerRun.round * (timerRun.duration + timerRun.breakTime);
            const endTime = new Date(new Date(timerRun.startTime).getTime() + lastMins * 60000);
            if (curTime.getTime() - endTime.getTime() >= 0){
                setTimerRun({});
                setRunning(false);
            }
        }

        if (timerList.length > 0 && Object.keys(timerRun).length === 0){

            const incomingTimerList = timerList.filter(item=>getEndTime(item).getTime() - new Date().getTime() > 0).sort(timerSort);
            const firstTimer = Object.assign({}, incomingTimerList[0]);
            console.log(firstTimer);
            const nextStartTime = new Date(firstTimer.startTime);
            const differTime = nextStartTime.getTime() - curTime.getTime(); // millseconds
            // console.log('in checking time diff', differTime);
            if (differTime < 0.5 * 60000){ // less than one minutes
                setTimerRun(firstTimer);
                setRunning(true);
            }
        }


    }

    // set interval for updating running timer
    React.useEffect(()=>{
        const intervalTime = 10000;
        const interval = setInterval(()=>{
          setCurTime(prev=>prev + intervalTime)
        }, intervalTime)
        return ()=>clearInterval(interval);
    }, []);


    React.useEffect(()=>{
    //    console.log('TO RUN CHECK')
      checkTImerRunning();
    }, [curTime, timerList])


    const addTimer = (newTime) => {
        const newTimerList = timerList.splice(0);
        newTimerList.push(newTime);
        newTimerList.sort(timerSort);
        setTimerList(newTimerList);
        // setTimerList(state=>{
        //     const newState = state.splice(0);
        //     newState.push(newTime);
        //     newState.sort((a, b)=> (new Date(a.startTime) - new Date(b.startTime)));
        //     console.log('in add timer', newState)
        //     return newState
        // });
    }

    const handleCreateTimer = async (timerData, edit) => {
        console.log(timerData);
        timerData.userId = userId;

        const route = `${SERVER_URL}/timers/`;
        let timerId = timerData.id;
        await upsertData(route, timerData, 'POST').then(res=>{
            console.log('timer', res);
            if(res.code === 201 && res.data){
                addTimer(res.data);
                timerId = res.data.id;
            }
        })

        return timerId; // for redirect
    }

    const handleUpsertTask = async (taskData, edit) => {
        taskData.userId = userId;
        const route = edit? `${SERVER_URL}/tasks/${taskData.id}`:`${SERVER_URL}/tasks`;
        const method = edit ? 'PUT' : 'POST';
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

    const handleDeleteTask = async (taskData) => {
        taskData.userId = userId;
        const route = `${SERVER_URL}/tasks/${taskData.id}`;
        const method = 'DELETE';
        await upsertData(route, taskData, method).then(res=>{
            console.log('in upsert task', res)
         if(res.code === 201){
             setTasks(state=>{
                 // todo: sort default by incomplete / compete
                 let idx = -1;
                 idx = state.findIndex(item=>(String(item.id) === String(taskData.id)));
                 state.splice(idx,1)
                 const newState = state.splice(0)
                 return newState;
             });
         }
        })
    }

    const handleDeleteTaskList = async (taskListData) => {
        taskListData.userId = userId;
        const route = `${SERVER_URL}/tasklists/${taskListData.id}`;
        const method = 'DELETE';
        await upsertData(route, taskListData, method).then(res=>{
            console.log('in upsert task', res)
         if(res.code === 201){
             setTasklists(state=>{
                 // todo: sort default by incomplete / compete
                 let idx = -1;
                 idx = state.findIndex(item=>(String(item.id) === String(taskListData.id)));
                 state.splice(idx,1)
                 const newState = state.splice(0)
                 return newState;
             });
         }
        })
    }

    const handleUpsertTaskList = async (taskListData, edit) => {
    taskListData.userId = userId;
    const route = edit? `${SERVER_URL}/tasklists/${taskListData.id}`:`${SERVER_URL}/tasklists`;
    const method = edit ? 'PUT' : 'POST';
    await upsertData(route, taskListData, method).then(res=>{
        console.log('in upsert taskList', res)
     if(res.code === 201 && res.data){
         setTasklists(state=>{
             // todo: sort default by incomplete / compete
             const newState = state.splice(0);
             let idx = -1;
             if(edit){
               idx = newState.findIndex(item=>(String(item.id) === String(taskListData.id)));
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

    const getTimerById = (timerId) => {
        const targetTimer = timerList.find(timer=>String(timer.id) === String(timerId));
        return targetTimer;
    }

    return (<DataContext.Provider value = {{
        tasks,
        tasklists,
        timerList,
        loading,
        timerRun,
        getTimerById,
        handleCreateTimer,
        handleUpsertTask,
        handleUpsertTaskList,
        handleDeleteTask,
        handleDeleteTaskList,
    }}>
        {props.children}
    </DataContext.Provider>)
}

export const useDataContext = () => React.useContext(DataContext);
