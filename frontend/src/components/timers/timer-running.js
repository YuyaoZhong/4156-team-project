import React  from 'react';
import { Container, Label, List, Header } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { DisplayTimer } from './timer-info';
import TimerDetailInfo from './timer-detail-info';
import './timer-running.css';

const formatTime = (timeLeftInSecond) => {
  let minute = Math.floor(timeLeftInSecond / 60);
  if (minute < 10) minute = '0' + minute;

  let second = timeLeftInSecond - 60 * minute;
  if (second < 10) second = '0' + second;

  return `${minute}:${second}`;
}

const getcurRound = (timer) =>{
   let curStartTime = new Date(timer.startTime);
   let curRound = 0;
   const minutes = timer.duration + timer.breakTime;
   while (new Date().getTime() - curStartTime.getTime() >= 0){
     if(curRound > timer.round) {
         return -1;
     }
     curRound += 1;
     curStartTime = new Date(curStartTime.getTime() + minutes * 60000);
   }
   return curRound;

};

// starttime1 - end - breaktime 
const inBreak = (timer, curRound) => {
    // const curRound = getcurRound(timer);
    if (curRound < 0){
        return false;
    }
    const timePast =  (curRound - 1)*(timer.duration + timer.breakTime) + timer.duration
    const shouldEnd = new Date(new Date(timer.startTime).getTime() + timePast * 60000);
    // console.log('in is break', shouldEnd)
    return new Date().getTime() > shouldEnd.getTime();
}

const getTimeLeft = (timer, curRound, isBreak) => {

    // const timePast =  curRound*(timer.duration + timer.breakTime);
    if (curRound < 0 || curRound > timer.round){
      return 0;
    }

    const timeWillPast = (curRound - 1) *(timer.duration + timer.breakTime) + timer.duration + (isBreak? timer.breakTime : 0);
    const willEndAtTime = new Date(new Date(timer.startTime).getTime() + timeWillPast * 60000);
    const timeLeft = Math.round((willEndAtTime.getTime() - new Date().getTime()) / 1000);
    return Math.max(timeLeft, 0);

};

// todo: write no timer
const NoTimer = () => {
    return (<div>There is no timer, to create one</div>)
}
const IncomingTimer = () => {
 const { timerList } = useDataContext();

  return timerList && timerList.length > 0 ? (
      <DisplayTimer timer = {timerList[0]} />
  ): (<NoTimer/>);
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
                <Label color='teal' pointing size ='huge'>
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
    const { timerRun } = useDataContext();
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
        <TimerDetailInfo timer = {timerRun} />
      </Container>
      )
}


const RunningTimerContainer = () => {
    const { timerRun } = useDataContext();
    return !timerRun || Object.keys(timerRun).length === 0 ?
      (<IncomingTimer/>): (<RunningTimer/>)
    
}

export default RunningTimerContainer;