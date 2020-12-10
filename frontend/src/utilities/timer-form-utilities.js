import { formatDate, formatTime } from './utilities';

const formatTask = (tasks, relatedTasks, tasklists) => {
    // console.log(relatedTasks, tasklists);
    return tasks.reduce((res, item, index)=>{
        const idx = relatedTasks && relatedTasks.length >= 0? 
            relatedTasks.findIndex(relatedTask=>String(relatedTask.id) === String(item.id)): -1;
     
        let taskListName = "Default";
        if (item.taskListId && item.taskListId !== 0){
         
            const taskList = tasklists.find(y=>String(y.id) === String(item.taskListId))
            if(taskList){
                taskListName = taskList.name;
            }
        }
        const relId = idx === -1 ? -1 : relatedTasks[idx].relId;
        const newItem = {...item, key: index, relId: relId, 
            selected: idx !== -1, alterSelected: idx !== -1, taskListName: taskListName};
        res.push(newItem);
        return res;
    }, [])
};

const isNumericAttr = (name) => (name === "duration" || name === "breakTime" || name === "round");

const errorMessages =(type, attrName) => {
    switch(type){
        case 'empty':
            return `${attrName} can not be empty!`;
        case 'non-positive number':
            return `${attrName} value can not be negative!`;
        case 'wrong time':
            return `Start time can not be later than current time!`;
        case 'wrong date format':
            return `${attrName} format error`;
        case 'numeric error':
            return `${attrName} must be number value`;
        case 'too large number':
            return `Please choose a smaller value for ${attrName}`;
        default:
            return 'Error!';
    }
}


const checkTimeValid = (timeStr)=>{
    if(!timeStr.includes(":")){
        return false;
    }
    const times = timeStr.split(":");
    if (times.length !== 2){
        return false;
    }
    const tryParseHour = parseInt(times[0], 10);
    const tryParseMin = parseInt(times[1], 10);
    if(times[0].includes('.') || times[1].includes('.') 
    || isNaN(tryParseMin) || isNaN(tryParseHour)){
        return false;
    } 
    if(tryParseHour < 0 || tryParseHour > 23){
        return false;
    }
    if(tryParseMin < 0 || tryParseMin >= 60){
        return false;
    }
    return true;
}


const judgeInputError = (attrName, value) => {
    let newErrors = {};
    if ((attrName !== "description") && !isNumericAttr(attrName) && (!value || value === "" || value === undefined || value.length === 0)){
        newErrors[attrName] = errorMessages('empty', attrName);
        
    }else if ( isNumericAttr(attrName)) {
        const tryParseInt = parseInt(value, 10);
        if(isNaN(tryParseInt)){
            newErrors[attrName] = errorMessages('numeric error', attrName);
        }
        else if(tryParseInt <= 0){
            newErrors[attrName] = errorMessages('non-positive number', attrName);
        } else if (tryParseInt > 65535){
            newErrors[attrName] = errorMessages('too large number', attrName);
        }
    }
    return newErrors;
}

const judgeStartTimerError = (name, timerDate, timerTime, errors) => {
    let newErrors = {};
    const compareDate = new Date(formatDate(new Date()));
    if(name === "date"){
        const value = timerDate;
        const tryParseDate = Date.parse(value);
        if (!value || value === ""){
            newErrors[name] = errorMessages('empty', name);
        }
        else if(isNaN(tryParseDate)){
            newErrors[name] = errorMessages('wrong date format', name);
        }else{
           // valid start time
           if (new Date(tryParseDate).getTime() < compareDate.getTime()){
             newErrors[name] = errorMessages('wrong time', name);
           }
           //  else if(newErrors[name]){
           //     delete newErrors[name];
           // }
        }
    }

    if(name === "time"){ // change to a seperate utilitiy function
        const value =  timerTime;
        if(!value || value ===""){
            newErrors[name] = errorMessages('empty', name);
        }
        else if(!checkTimeValid(value)){
            newErrors[name] = errorMessages('wrong date format', name);
        }else{
            if(!errors.date && compareDate.getTime() === new Date(timerDate).getTime()){
                const todayHour = new Date().getHours();
                const todayMin = new Date().getMinutes();
                const times = value.split(":");
                const tryHour = parseInt(times[0], 10);
                const tryMin = parseInt(times[1], 10);
                if(tryHour < todayHour || (tryHour === todayHour && tryMin < todayMin)){
                    newErrors[name]  = errorMessages('wrong time', name);
                }
            }
            // else if(newErrors[name]){
            //     delete newErrors[name];
            // }
        }
    }

    return newErrors;
}



const getDefaultTimer = () => {
    const delayMin = 5;
    const curDefaultTime = new Date(new Date().getTime() + delayMin * 60000);
    const minDate = formatDate(curDefaultTime);
    const minTime = formatTime(curDefaultTime);
    
    const defaultTimerConfig =   {
        'title': 'new timer',
        'description': '',
        'breakTime': 5,
        'duration': 25,
        'round': 1,
        'date': minDate,
        'time': minTime,
    };
    return defaultTimerConfig;
  }
  

export {
    formatTask,
    isNumericAttr,
    errorMessages,
    checkTimeValid,
    judgeInputError,
    judgeStartTimerError,
    getDefaultTimer,
}