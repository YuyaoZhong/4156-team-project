import React  from 'react';
import { Link } from 'react-router-dom';
import { Container, Label, Header, Icon, Segment, Button } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import DisplayTimer from './display-timer';
import DisplayTimerArea from './display-timer-area';
import { formatTime, getcurRound, inBreak, getTimeLeft} from '../../utilities/timer-utilities';
import './timer-running.css';



const NoTimer = () => {
    return (  <Container>
        <Segment placeholder size='huge'>
                <Header icon>
                  <Icon name='Clock' />
                  No Running Timer or Incoming Timer 
                </Header>
              </Segment>
      </Container>)
}

const getTimerState = (timer) => {
    const curRound = getcurRound(timer);
    const curIsBreak = inBreak(timer, curRound);
    const defaultState = {
        "curRound": curRound,
        'isBreak': curIsBreak,
        'isStart': curRound > 0,
    };
    return defaultState;
}

const TimerLabel = props => {
    const {timerStatus, timer, children, days} = props;
    if(!timerStatus.isStart && timerStatus.curRound === 0){
        return (<Container>
            <Header textAlign='center'>
                <Label color='teal' size ='huge'>
                Incoming 
                </Label>
                {days && days > 0 ? 

                <Label as='span' size = 'huge'> {days} Days</Label>
               
            :""}
            </Header>
            {children}
        </Container>)
    }

    if(timerStatus.isStart){
        if(timerStatus.isBreak){
            return(
               <Container textAlign='center'>
                    <Label  color='yellow' size ='huge'>
                        Break
                    </Label>
                    {children}

                    <Header textAlign='center'>
                    {
                        days && days > 0 ? (<>
                        <Label as='span' color='black'  size = 'massive'> {days} Days</Label></>):""
                    }
                    </Header>
                    <Header textAlign='center'>
                    Session Left 
                    <Label as='span' circular color = 'yellow' size = 'huge'>{Math.max(timer.round - timerStatus.curRound, 0)}</Label>
                    </Header>
               </Container>

            
            ) 
        } else {
            return (<Container textAlign='center'>
            
                <Label as='span' size = 'huge'>Session</Label>
                <Label as='span' color = 'blue' size = 'huge'>{timerStatus.curRound}</Label>
               
                {children}

                <Header textAlign='center'>
                {
                    days && days > 0 ? (<>
                    <Label as='span' color='black'  size = 'massive'> {days} Days</Label></>):""
                }
                </Header>
                <Header textAlign='center'>
               
                Session Left
                <Label as='span' circular color = 'teal' size = 'huge'>{Math.max(timer.round - timerStatus.curRound, 0)}</Label>
                </Header>
             </Container>)
        }
    }

    return (<Header textAlign='center'>
    <Label as='span'  color = 'grey' size = 'huge'>Stopped</Label>
    </Header>)
}

 
const RunningTimer = () => {
    const { timerRun} = useDataContext();
    const defaultState = getTimerState(timerRun);
    const curTimeLeft =  getTimeLeft(timerRun, defaultState.curRound, defaultState.isBreak);
    const [timeLeft, setTimeLeft] = React.useState(curTimeLeft);
    const [curTimerStatus, setCurTimer] = React.useState(defaultState);


    React.useEffect(()=>{
        setCurTimer(getTimerState(timerRun));
        const interval = setInterval(()=>{
            setTimeLeft(prev=>prev-1);
        }, 1000);
        return ()=>clearInterval(interval);

    }, [timerRun])

    React.useEffect(()=>{
       if(timeLeft <= 0){ // update state
           const newState = getTimerState(timerRun)
           setCurTimer(newState);
           setTimeLeft(getTimeLeft(timerRun, newState.curRound, newState.isBreak)); 
       }
    }, [timeLeft])

    const secondToDays = 60 * 60 * 24;
    const days =  Math.floor(timeLeft / secondToDays);
    return (
      <Container large>
          <Header as = "h1" textAlign='center' style ={{fontSize: "28px"}}>
              {timerRun.title}
        
          </Header>
          <TimerLabel timer = {timerRun} timerStatus = {curTimerStatus} days={days}>
          
             <div className="times">
                <div className="times-content">
                    <span id="time-left">{formatTime(timeLeft - days * secondToDays)}</span>
                </div>
                </div>
        </TimerLabel>
        <DisplayTimerArea hideEdit = {true} hideTitle={true} timer = {timerRun} editMode = {false} />
      </Container>
      )
}


const RunningTimerContainer = () => {
    const { timerRun } = useDataContext();
    return !timerRun || Object.keys(timerRun).length === 0 ?
      (<NoTimer/>): (<RunningTimer/>)
    
}

export default RunningTimerContainer;