import React from 'react';
import { Button, Container, Form, Header, Icon } from 'semantic-ui-react';
import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { useDataContext } from '../../context/data-context';
import { constructDate, formatDate, formatTime } from '../../utilities/utilities';
// create a timer

const TimerForm = (props) => {
    const {
        handleCreateTimer 
    } = useDataContext();
    
    // todo: these default value should be changed to compatible with edit mode
    // todo: check box for zoom link

    const delayMin = 5;
    const curDefaultTime = new Date(new Date().getTime() + delayMin * 60000);
    const minDate = formatDate(curDefaultTime);
    const minTime = formatTime(curDefaultTime);

    const defaultTimerData = props.editMode ? props.timerData: {
        'title': 'new timer',
        'description': '',
        'breakTime': 5,
        'duration': 25,
        'round': 1,
        'date': minDate,
        'time': minTime,
    };
    
    const [timerData, setTimerData] = React.useState(defaultTimerData);
      
    const handleChange = e => setTimerData({...timerData, [e.target.name]: e.target.value})
    const handleStartTimeChange = (e, {name, value}) => setTimerData({...timerData, [name]: value});

    const handleSubmit = () =>{
        
        const newTimerData = Object.assign({}, timerData);
        const startTime = `${newTimerData.date} ${newTimerData.time}`;
        const startTimeUtc = constructDate(startTime).toISOString();
        newTimerData.startTime = startTimeUtc;
        delete newTimerData.date;
        delete newTimerData.time;

        handleCreateTimer(newTimerData);

    };

    return(<Container>
           <Header as='h2' textAlign='center' icon>
                <Icon name='clock outline'/>
                Create A New Pomodoro
           </Header>
            <Form size = 'big'>
            <Form.Field 
               name = 'title' label = 'Title' control = 'input' type = 'text'
              defaultValue = {timerData.title}
              onChange = {handleChange}     
            />

            <Form.Field 
               name = 'description' label = 'Description' control = 'input' type = 'text'
              defaultValue = {timerData.description}
              onChange = {handleChange}     
            />
                
                <Form.Group widths='equal'>
                    {/* <Form.label>Date</Form.label> */}
                    <DateInput
                            name="date"
                            placeholder="Date"
                            value={timerData.date}
                            iconPosition='left'
                            popupPosition='bottom right'
                            startMode = 'year'
                            dateFormat= 'YYYY-MM-DD'
                            minDate = {minDate}
                            onChange={handleStartTimeChange}
                        />
                        <TimeInput
                            name="time"
                            placeholder="Time"
                            value = {timerData.time}
                            iconPosition="left"
                            popupPosition='bottom right'
                            onChange={handleStartTimeChange}
                            // minTime = {startTime.Date === minDate? formatTime(new Date()):""}
                        />
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
                <Button primary type="button" onClick={handleSubmit}>Save </Button>  
            </Form>
        </Container>)

} 

export default TimerForm;