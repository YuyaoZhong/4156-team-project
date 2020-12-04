import React from 'react';
import { Redirect } from 'react-router-dom'
import { Button, Container, Form, Header, Icon, List, Label} from 'semantic-ui-react';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { useDataContext } from '../../context/data-context';
import { constructDate, formatDate, formatTime } from '../../utilities/utilities';
import { upsertData, deleteData} from '../../utilities/apiMethods';
import { useGoogleAuth } from '../../context/google-login-context';
import { SERVER_URL } from '../../constants/constants';
import AttachList from './attach-list';
import AttachedTasks from './display-attached-tasks';


const filterSelected = (x)=>(x.alterSelected);
const filterToDelete = (x) => (x.selected && !x.alterSelected && x.relId !== -1);
const filterToAdd = (x) => (!x.selected && x.alterSelected);

const formatTask = (tasks, relatedTasks, tasklists) => {
    // console.log(relatedTasks, tasklists);
    return tasks.reduce((res, item, index)=>{
        const idx = relatedTasks.findIndex(relatedTask=>String(relatedTask.id) === String(item.id));
     
        let taskListName = "Default";
        if (item.taskListId && item.taskListId !== 0){
         
            const taskList = tasklists.find(y=>String(y.id) === String(item.taskListId))
            // console.log('here', taskList, tasklists)
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


const TimerForm = (props) => {
    const {
        handleCreateTimer,
        tasks,
        tasklists,
        getRelatedTasksOfTimers,
    } = useDataContext();
    
    const {editMode, editTimer, closeEditMode} = props;

    const [addedTasks, setAddTasks] = React.useState(formatTask(tasks, [], tasklists));

    // may change to a format that does not need to fetch the data again (though it works now)
    React.useEffect(()=>{
       async function fetchData(){
           if( editMode && editTimer){
               const relatedTasks = await getRelatedTasksOfTimers(editTimer.id);
               setAddTasks(formatTask(tasks, relatedTasks, tasklists));
           }
       }
       fetchData();
    }, [tasks, tasklists]);


    // React.useEffect(()=>{
       
    // }, [tasks, tasklists])

    const toggleSelectTask = (keyIndex) => {
      setAddTasks(state=>{
          const newState = state.splice(0);
          const targetIdx = newState.findIndex(item=>String(item.key) === String(keyIndex))
          if(targetIdx !== -1){
              newState[targetIdx].alterSelected = !newState[targetIdx].alterSelected;
          }
          return newState
      })
    }

 


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
    const defaultTimerData = editMode ? {...editTimer, 
        "date": formatDate(new Date(editTimer.startTime)),
        "time": formatTime(new Date(editTimer.startTime))}: 
        defaultTimerConfig;
     
   

    const [timerData, setTimerData] = React.useState(defaultTimerData);
    const [redirect, setRedirect] = React.useState(null);
    const [errors, setErrors] = React.useState({}); // for form validation

    const handleChange = e => setTimerData({...timerData, [e.target.name]: e.target.value})
    const handleStartTimeChange = (e, {name, value}) => setTimerData({...timerData, [name]: value});
    const {isSignedIn, googleUser} = useGoogleAuth();

   

    // todo: move to utilities;
    const errorMessages =(type, attrName) => {
        switch(type){
            case 'empty':
                return `${attrName} can not be empty!`;
            case 'non-positive number':
                return `${attrName} value can not be negative!`;
            case 'wrong time':
                return `Start time can not be later than current time!`;
            case 'wrong date format':
                return `Date format error`;
            default:
                return 'Error!';
        }
    }

    const validateInput = (e) => {
        // const newErrors = Object.assign({}, errors);
   
        const originErrors = Object.assign({}, errors);
        let newErrors = {};
        const attrName = e.target.name;
        const value = e.target.value;
        if ((attrName !== "description") && (!value || value === "" || value === undefined || value ===null || value.length === 0)){
            newErrors[attrName] = errorMessages('empty', attrName);
        }
        const tryParseInt = parseInt(value, 10);
        if(!isNaN(tryParseInt) && tryParseInt <= 0){
            newErrors[attrName] = errorMessages('non-positive number', attrName);
        }
        if(!newErrors[attrName] && originErrors[attrName]){
            delete originErrors[attrName];
        }

        newErrors = {...originErrors, ...newErrors}
        setErrors(newErrors);
        // if(!newErrors.attrName || )

        return newErrors;

    }

    // todo: move to utilities
    const checkTimeValie = (timeStr)=>{
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

    const validateStartTime = (name) => {
        const newErrors = Object.assign({}, errors);
        if(name === "date"){
            const value = timerData.date;
            const tryParseDate = Date.parse(value);
            if (!value || value === ""){
                newErrors[name] = errorMessages('empty', name);
            }
            else if(isNaN(tryParseDate)){
                newErrors[name] = errorMessages('wrong date format', name);
            }else{
               // valid start time

               if(newErrors[name]){
                   delete newErrors[name];
               }
            }
        }

        if(name === "time"){ // change to a seperate utilitiy function
            const value = timerData.time;
            if(!value || value ===""){
                newErrors[name] = errorMessages('empty', name);
            }
            else if(!checkTimeValie(value)){
                newErrors[name] = errorMessages('wrong date format', name);
            }else{
                if(newErrors[name]){
                    delete newErrors[name];
                }
            }
        }

        setErrors(newErrors);
        return newErrors;
    }

    const deleteStartTimeError = (name)=>setErrors(errros=>{
        const newErrors = Object.assign({}, errors);
        delete newErrors[name];
        return newErrors;
    })

    const deleteError = (e) => setErrors(errros=>{
        const newErrors = Object.assign({}, errors);
        delete newErrors[e.target.name];
        return newErrors;
    })

    const handleAddTasks = async (timerId) => {
        const userId = isSignedIn ? googleUser.googleId : ""
        const toAddTasks = addedTasks.filter(filterToAdd);
        const addRoute = `${SERVER_URL}/task_timers/`
        const toAddDataPromises = toAddTasks ? toAddTasks.map(item=>{
            const data = {
                userId: userId,
                taskId: item.id,
                timerId: timerId
            };
            return upsertData(addRoute, data, 'POST');
        }): []
    
       const toDeleteTasks = addedTasks.filter(filterToDelete);
       const toDeletePromises = toDeleteTasks ? toDeleteTasks.map(item=>{
           const deleteRoute = `${SERVER_URL}/task_timers/${item.relId}`;
           console.log(deleteRoute);
           return deleteData(deleteRoute);
       }) : [];


       await Promise.all(toAddDataPromises).then((results)=> {
           console.log('add promises')
           console.log(results);
       });
       await Promise.all(toDeletePromises).then((results)=> {
        console.log('delete promises')
        console.log(results);
    });


    }



    const handleSubmit = async () =>{
        // todo: pop up message
        if(Object.keys(errors).length !== 0){
            return;
        }
        const newTimerData = Object.assign({}, timerData);
        const startTime = `${newTimerData.date} ${newTimerData.time}`;
        const startTimeUtc = constructDate(startTime).toISOString();
        newTimerData.startTime = startTimeUtc;
        delete newTimerData.date;
        delete newTimerData.time;
        const timerId = await handleCreateTimer(newTimerData, editMode);
        if (timerId) {
            await handleAddTasks(timerId);
            if(!editMode){
                 setRedirect(`/timer/${timerId}`);}
            } 
            closeEditMode();
    };

    return redirect && redirect.length > 0 ? <Redirect push to = {redirect} />:(<Container>
        <Header as='h2' textAlign='center' icon>
             <Icon name='clock outline'/>
             {editMode? "Edit The Pomodoro" : "Create A New Pomodoro"}
        </Header>
         <Form size = 'big'>
         <Form.Field 
            name = 'title' label = 'Title' control = 'input' type = 'text'
           defaultValue = {timerData.title}
           onChange = {handleChange} 
           onFocus = {deleteError}
           onBlur = {validateInput}   
           maxLength =  {256}
           error={errors.title? errors.title :null}
         />

         <Form.Field 
            name = 'description' label = 'Description' control = 'input' type = 'text'
           defaultValue = {timerData.description}
           onChange = {handleChange}    
           maxLength =  {512} 
         />
             
             <Form.Group widths='equal'>
                   <Form.Field>
                    <DateInput
                            className = {errors.date? "error":""}
                            name="date"
                            placeholder="Date"
                            value={timerData.date}
                            iconPosition='left'
                            popupPosition='bottom right'
                            startMode = 'year'
                            dateFormat= 'YYYY-MM-DD'
                            minDate = {minDate}
                            onChange={handleStartTimeChange}
                            onFocus= {()=>deleteStartTimeError("date")}
                            onBlur = {()=>validateStartTime("date")}
                        />
                        {
                            errors.date? ( <Label className="prompt" pointing>
                            {errors.date}
                            </Label>):""
                        }
                   </Form.Field>
                  

                   <Form.Field>
                        
                        <TimeInput
                                name="time"
                                placeholder="Time"
                                value = {timerData.time}
                                iconPosition="left"
                                popupPosition='bottom right'
                                className = {errors.time? "error":""}
                                onChange={handleStartTimeChange}
                                onFocus= {()=>deleteStartTimeError("time")}
                                onBlur = {()=>validateStartTime("time")}
                                // minTime = {startTime.Date === minDate? formatTime(new Date()):""}
                            />
                        {
                            errors.time? ( <Label className="prompt" pointing>
                            {errors.time}
                            </Label>):""
                        }
                   </Form.Field>
                  
             </Form.Group>
             <Form.Group widths='equal'>
                 <Form.Field 
                     name = 'duration'
                     label = 'Duration' 
                     control = 'input' 
                     type = 'number'  min = {1}
                     defaultValue = {timerData.duration}
                     onChange = {handleChange}
                 />
                 <Form.Field 
                    name = 'breakTime' label = 'Break' 
                    control = 'input' type = 'number' min = {1} 
                    defaultValue= {timerData.breakTime} 
                    onChange = {handleChange}
                  />
                  <Form.Field 
                    name = 'round' label = 'Round' 
                    control = 'input' type = 'number' min = {1} 
                    defaultValue= {timerData.round} 
                    onChange = {handleChange}
                  />
             </Form.Group>
             <label><strong>Attached Tasks</strong></label>
             <AttachedTasks 
                data = {addedTasks ? addedTasks.filter(filterSelected) : []}
                selectHandler = {toggleSelectTask}    
            />
             <AttachList 
                data = {addedTasks ? addedTasks : []} 
                renderAttr = 'name'
                buttonName = 'Attach Tasks To Timer'
                selectHandler = {toggleSelectTask}
            />
             <Button secondary floated = 'right' type="button" size = 'large' onClick={props.closeEditMode}> Cancel </Button>    
             <Button primary floated = 'right' type="button" size = 'large' onClick={handleSubmit}>Save </Button>
         </Form>
     </Container>)

} 

export default TimerForm;