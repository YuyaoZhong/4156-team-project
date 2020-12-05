import React from 'react';
import { Redirect } from 'react-router-dom'
import { Button, Container, Form, Header, Icon, List, Label} from 'semantic-ui-react';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { useDataContext } from '../../context/data-context';
import { constructDate, formatDate, formatTime, formatValueToBeInBoundary} from '../../utilities/utilities';
import { upsertData, deleteData} from '../../utilities/apiMethods';
import { formatTask, isNumericAttr, errorMessages, checkTimeValid, judgeInputError, judgeStartTimerError, getDefaultTimer} from '../../utilities/timer-form-utilities';
import { useGoogleAuth } from '../../context/google-login-context';
import { SERVER_URL } from '../../constants/constants';
import AttachList from './attach-list';
import AttachedTasks from './display-attached-tasks';


const filterSelected = (x)=>(x.alterSelected);
const filterToDelete = (x) => (x.selected && !x.alterSelected && x.relId !== -1);
const filterToAdd = (x) => (!x.selected && x.alterSelected);


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
    const [errors, setErrors] = React.useState({}); 

    const handleChange = e => setTimerData({...timerData, [e.target.name]: formatValueToBeInBoundary(e.target.value)})
    const handleStartTimeChange = (e, attrs) =>{
        // const attrName = name || e.target.name ;
        // const attrValue = value || e.target.value;
        // setTimerData({...timerData, [attrName]: attrValue});
        const attrName = (attrs && attrs.name) ? attrs.name : e.target.name ;
        const attrValue = (attrs && attrs.value) ? attrs.value: e.target.value;
        setTimerData({...timerData, [attrName]: attrValue});
    }
    const {isSignedIn, googleUser} = useGoogleAuth();


  

    const validateInput = (e) => {
        const originErrors = Object.assign({}, errors);
        
        const attrName = e.target.name;
        const value = formatValueToBeInBoundary(e.target.value);
      
        let newErrors = judgeInputError(attrName, value);
        if(!newErrors[attrName] && originErrors[attrName]){
            delete originErrors[attrName];
        }

        newErrors = {...originErrors, ...newErrors}
        setErrors(newErrors);
    }

    const validateStartTime = (attrName, e) => {
        const value = (e && e.target && e.target.value)? e.target.value : undefined;
        const curDate = (attrName === 'date' && value !== undefined)? value : timerData.date;
        const curTime = (attrName === 'time' && value !== undefined)? value: timerData.time;
        const originErrors = Object.assign({}, errors);
        let newErrors = judgeStartTimerError(attrName, curDate, curTime, originErrors);
        if(!newErrors[attrName] && originErrors[attrName]){
            delete originErrors[attrName];
        }
        newErrors = {...originErrors, ...newErrors}
        setErrors(newErrors);
       
    }

 
    // const validateStartTime = (attrName) => {
    //     const originErrors = Object.assign({}, errors);
    //     let newErrors = judgeStartTimerError(attrName, timerData.date, timerData.time, originErrors);
    //     if(!newErrors[attrName] && originErrors[attrName]){
    //         delete originErrors[attrName];
    //     }
    //     newErrors = {...originErrors, ...newErrors}
    //     setErrors(newErrors);
       
    // }

    // const setErrorCallback = (errors) =>{
    //     const newErrors = Object.assign({}, errors);
    //     delete newErrors[name];
    //     return newErrors;
    // }

    // const deleteError = (e) => setErrors(errors=>{
    //     const newErrors = Object.assign({}, errors);
    //     delete newErrors[e.target.name];
    //     return newErrors;
    // })

    const deleteStartTimeError = (name)=>{
        const newErrors = Object.assign({}, errors);
        delete newErrors[name];
        setErrors(newErrors);
    }

    const deleteError = (e) => {
        const newErrors = Object.assign({}, errors);
        delete newErrors[e.target.name];
        setErrors(newErrors);
    }
   

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
        //    console.log('add promises')
        //    console.log(results);
       });
       await Promise.all(toDeletePromises).then((results)=> {
        // console.log('delete promises')
        // console.log(results);
    });


    }



    const handleSubmit = async () =>{
        // todo: pop up message
   
        if(Object.keys(errors).length !== 0){
            return;
        }
        console.log('AT SUBMIT')
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
           value = {timerData.title}
           onChange = {handleChange} 
           onFocus = {deleteError}
           onBlur = {validateInput}   
           maxLength =  {140}
           error={errors.title? errors.title :null}
         />

         <Form.Field 
            name = 'description' label = 'Description' control = 'input' type = 'text'
           value = {timerData.description}
           onChange = {handleChange}    
           maxLength =  {140} 
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
                            onBlur = {(e)=>validateStartTime("date", e)}
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
                                onBlur = {(e)=>validateStartTime("time", e)}
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
                     type = 'number'  
                     min = {1}
                     value = {timerData.duration}
                     onChange = {handleChange}
                     onFocus = {deleteError}
                     onBlur = {validateInput}
                     error={errors.duration? errors.duration :null}
                 />
                 <Form.Field 
                    name = 'breakTime' label = 'Break' 
                    control = 'input' type = 'number' min = {1} 
                    value = {timerData.breakTime} 
                    onChange = {handleChange}
                    onFocus = {deleteError}
                    onBlur = {validateInput}
                    error={errors.breakTime? errors.breakTime :null}
                  />
                  <Form.Field 
                    name = 'round' label = 'Round' 
                    control = 'input' type = 'number' min = {1} 
                    value = {timerData.round} 
                    onChange = {handleChange}
                    onFocus = {deleteError}
                    onBlur = {validateInput}
                    error={errors.round? errors.round :null}
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