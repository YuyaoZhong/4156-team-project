import React from 'react'
import { SERVER_URL } from '../constants/constants';
import { useGoogleAuth } from './google-login-context';
import { upsertData, deleteData } from '../utilities/apiMethods';

export const DataContext = React.createContext()


const timerSort = (a, b)=> (new Date(a.startTime) - new Date(b.startTime))
const getEndTime = (timer) => (new Date(new Date(timer.startTime).getTime() + (timer.duration + timer.breakTime) * timer.round * 60000));

const getIncomingTimer = (timerlist) => {return timerlist.filter(item=>getEndTime(item).getTime() - new Date().getTime() > 0).sort(timerSort)};


export const DataContextProvider = props => {
    const [timerList, setTimerList] = React.useState([]);
    const [tasks, setTasks] = React.useState([]);
    const [tasklists, setTasklists] = React.useState([]);
    const [timerRun, setTimerRun] = React.useState({});
    // const [taskAndTimer, setTaskToTimer] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const [curTime, setCurTime] =  React.useState(new Date().getTime());
    const [incomingTimers, setIncomingTimers] = React.useState([]);
    

    const {isSignedIn, googleUser} = useGoogleAuth();
    const userId = isSignedIn ? googleUser.googleId : ""

    React.useEffect(()=>{
    setLoading(true);
       async function fetchData () {
            // const getAllTimerRoute = `${SERVER_URL}/timers/?userId=${userId}`;
            const getAllTimerRoute = `${SERVER_URL}/timerToUser/?userId=${userId}`;
            const getAllTaskRoute = `${SERVER_URL}/tasks?userId=${userId}`;
            // const getAllTasklistRoute = `${SERVER_URL}/tasklists?userId=${userId}`;
            const getAllTasklistRoute =  `${SERVER_URL}/tasklists?userId=${userId}`;
            // const getAllTaskandTimerRoute = `${SERVER_URL}/task_timers?userId=${userId}`;
            const urls = [getAllTimerRoute, getAllTaskRoute, getAllTasklistRoute];
            const promises = urls.map(url=>fetch(url).then(r=>{
                if(r.status === 200){
                    return r.json()
                }
                return {"data": []}
            }));
             //.then(r=>JSON.parse(r)));
            try {
                await Promise.all(promises).then(res=>{
                    console.log(res);
                    const timers = res[0]["data"].sort(timerSort);
                    setIncomingTimers(getIncomingTimer(timers));
                    setTimerList(timers);
                    setTasks(res[1]["data"]);
                    setTasklists(res[2]["data"]);
                })
            } catch(e){
                console.log(e);
            }
            setLoading(false);
       }

       fetchData();
    },[userId])

    const checkTImerRunning = () => {
        // may need to change fetching first

        const curTime = new Date();
        const incomingTimerList = getIncomingTimer(timerList);

        if (Object.keys(timerRun).length !== 0) {
            const lastMins = timerRun.round * (timerRun.duration + timerRun.breakTime);
            const endTime = new Date(new Date(timerRun.startTime).getTime() + lastMins * 60000);
            if (curTime.getTime() - endTime.getTime() >= 0){
                setTimerRun({});
            }
        }

        if (timerList.length > 0){
            
            // const incomingTimerList = timerList.filter(item=>getEndTime(item).getTime() - new Date().getTime() > 0).sort(timerSort);
            const firstTimer = Object.assign({}, incomingTimerList[0]);
            console.log(firstTimer);
            const nextStartTime = new Date(firstTimer.startTime);
            const differTime = nextStartTime.getTime() - curTime.getTime(); // millseconds
      
            // if (differTime < 0.5 * 60000){ // less than one minutes
            //     setTimerRun(firstTimer);
            // }
            // test: change to the first timer
            if(firstTimer.id !== timerRun.id){
                setTimerRun(firstTimer);
            }
        }

        setIncomingTimers(setIncomingTimers);
     
    }

    // set interval for updating running timer
    React.useEffect(()=>{
        const intervalTime = 10000;
        const interval = setInterval(()=>{
          setCurTime(prev=>prev + intervalTime)
        }, intervalTime)
        setIncomingTimers(getIncomingTimer(timerList))
        return ()=>clearInterval(interval);
    }, [timerList]);


    React.useEffect(()=>{
    //    console.log('TO RUN CHECK')
      checkTImerRunning();
    }, [curTime, timerList])

    const updateTimerListState = (timerId, newTimer, edit)=>{
        const updateCallBack = (state) =>{
            const newState = [...state];
            let idx = -1;
            if(edit){
                idx = newState.findIndex(item=>String(item.id) === String(timerId));
            }
            if (idx === -1){
                newState.push(newTimer);
            } else {
                newState[idx] = newTimer;
            }
           
            newState.sort((a, b)=> (new Date(a.startTime) - new Date(b.startTime)));
            // console.log('in add timer', newState)
            return newState;
        }
        setTimerList(updateCallBack);
    }

    const handleCreateTimer = async (timerData, edit) => {
        // console.log(timerData);
        timerData.userId = userId;
        let timerId = timerData.id;
        const route = edit? `${SERVER_URL}/timers/${timerData.id}` : `${SERVER_URL}/timers/`;
        const method = edit ? 'PUT' : 'POST';
        await upsertData(route, timerData, method).then(res=>{
            console.log('timer update', res);
            if(res.code === 201 && res.data){
                timerId = res.data.id;
                updateTimerListState(timerData.id, res.data, edit);
            }
        })

        return timerId; // for redirect
    }


    const handleDeleteTimer = async (timerIds) => {
    //    const deletePromises = timerIds.map(timerId=>(`${SERVER_URL}/timers/${timerId}`));
        const deletePromises = timerIds.map(timerIdObj=>{
            let route = timerIdObj.isCreator?
            `${SERVER_URL}/timers/${timerIdObj.timerId}`
            :`${SERVER_URL}/timerToUser/${timerIdObj.timerId}/${timerIdObj.timerToUserId}`;
            // console.log(route)
            return deleteData(route);
        });


        await Promise.all(deletePromises).then(results=>{

            const deleteIds = results.reduce((res, item)=>{
                if(item.code === 200 && item.data){
                    if(item.data.isTimerToUser){
                        res.push(item.data.timerId);
                    }else{
                        res.push(item.data.id);
                    }
                }
                return res;
            }, []);

            setTimerList(state=>{
                const newState = state.filter(item=>{
                    const idx = deleteIds.findIndex(deleteId=>(String(deleteId) === String(item.id)));
                    return idx === -1; // not delete
                })
                return newState;
            })
        })

    }

    const handleUpsertTask = async (taskData, edit) => {
        taskData.userId = userId;
        if(taskData.taskListId === 0){
            taskData.taskListId = null;
        }
        const route = edit? `${SERVER_URL}/tasks/${taskData.id}`:`${SERVER_URL}/tasks`;
        const method = edit ? 'PUT' : 'POST';
        await upsertData(route, taskData, method).then(res=>{
            console.log('in upsert task', res)
         if(res.code === 201 && res.data){
             console.log(res)
             setTasks(state=>{
                 const newState = [...state];
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

    const getRelatedTasksOfTimers  = async (timerId) => {

        const tasksOftimersRoute = `${SERVER_URL}/task_timers?userId=${userId}&timerId=${timerId}`;
        // console.log(tasksOftimersRoute);
        let relatedTasks = []
        await fetch(tasksOftimersRoute).then(r=>r.json()).then(
            res=>{
                if(res.code === 200){
                    relatedTasks = res.data;
                }
                console.log(res);
            })
        return relatedTasks;
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
            // console.log('in upsert taskList', res)
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
            incomingTimers,
            loading,
            timerRun,
            getTimerById,
            handleCreateTimer,
            handleUpsertTask,
            getRelatedTasksOfTimers,
            handleDeleteTimer,
            handleUpsertTaskList,
            handleDeleteTask,
            handleDeleteTaskList,
            updateTimerListState,
            userId,
    }}>
        {props.children}
    </DataContext.Provider>)
}

export const useDataContext = () => React.useContext(DataContext);
