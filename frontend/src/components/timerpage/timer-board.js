import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { useDataContext } from '../../context/data-context';
import { Container, Icon, Header, Label, Segment, Button, Dimmer, Loader} from 'semantic-ui-react';
import TimerDetailInfo  from '../timers/timer-detail-info';
import Timeline from './time-line';
import './timer-board-style.css';

const colors = ['red', 'orange', 'yellow',
'olive', 'green', 'teal', 'blue', 'violet',
'purple', 'pink', 'brown', 
]

const directions = ['left', 'right']

const TimelineBoard = () => {
    const { incomingTimers } = useDataContext();
    const MAX_DISPLAY_CNT = 5;
    const getDisplayTimers = (incomingTimers) => {
      if( incomingTimers && incomingTimers.length > MAX_DISPLAY_CNT){
       return incomingTimers.slice(0, MAX_DISPLAY_CNT)
     }
       return incomingTimers.slice(0)
    }
    // const displayTimerList =getDisplayTimers(incomingTimers)
    const [displayTimerList, setDisplayTimers] = React.useState(getDisplayTimers(incomingTimers));
    const [loading, setLoading] = React.useState(true);
    React.useEffect(()=>{
      let timeOut;
      setDisplayTimers(getDisplayTimers(incomingTimers));
      if (incomingTimers.length > 0){
        setLoading(false);
      }else{
        timeOut = setTimeout(()=>setLoading(false), 1500);
      }

      return ()=>clearTimeout(timeOut);
    }, [incomingTimers])


    return loading ? (  <Dimmer active inverted>
      <Loader size='massive'>Loading</Loader>
    </Dimmer>):
    (displayTimerList && displayTimerList.length > 0 ? (<Container className='Timeline-container'>
      <div className='Timeline-title'>
              <Label size ='massive' color = 'grey' pointing= 'below'>Incoming Timers </Label>
      </div>
  {
    displayTimerList.map((timer, i) => {
        // attrNameSize, contentSize, hideTasks
        const color = colors[i % colors.length];
        const detail = <TimerDetailInfo attrNameSize='medium' contentSize='medium' timer = {timer} color = {color} />
        return(<Timeline
          key = {i}
          icon = "clock"
          direction = {directions[i % directions.length]}
          color = {color}
          time = {timer.title}
        //   description = {formatDateAndTime(new Date(timer.startTime))}
          description = {detail}
          linkRoute = {`/timer/${timer.id}`}
          tags = {[]}
          lineHeight = {3}
        />
        )
    })
}
</Container>):(  <Container>
<Segment placeholder size='huge'>
      <Header icon>
        <Icon name='Clock' />
        No Incoming Timer
      </Header>
     <Link to='/new_timer'> <Button primary>Create One</Button></Link>
    </Segment>
</Container>))
}


export default TimelineBoard;