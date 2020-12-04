import React  from 'react';
import { Container, Label, Header } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { DisplayTimer } from './timer-info';
import { formatTime, getcurRound, inBreak, getTimeLeft} from '../../utilities/timer-utilities';
import './timer-running.css';


// todo: write no timer
const NoTimer = () => {
    return (<div>There is no timer, to create one</div>)
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
    const {timerStatus, timer, children} = props;
    if(!timerStatus.isStart && timerStatus.curRound === 0){
        return (<Container>
            <Header textAlign='center'>
                <Label color='teal' pointing= 'below' size ='huge'>
                Incoming 
                </Label>
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

    return (
      <Container large>
          <Header as = "h1" textAlign='center'>
              {timerRun.title}
              
          </Header>
          <TimerLabel timer = {timerRun} timerStatus = {curTimerStatus}>
             <div className="times">
                <div className="times-content">
                    <span id="time-left">{formatTime(timeLeft)}</span>
                </div>
                </div>
        </TimerLabel>
        <DisplayTimer timer = {timerRun} editMode = {false} />
      </Container>
      )
}


const RunningTimerContainer = () => {
    const { timerRun } = useDataContext();
    return !timerRun || Object.keys(timerRun).length === 0 ?
      (<NoTimer/>): (<RunningTimer/>)
    
}

export default RunningTimerContainer;