import React, { Component } from 'react';
import { useDataContext } from '../../context/data-context';
import { Container, Icon, Header, Label} from 'semantic-ui-react';
import { formatDateAndTime } from '../../utilities/utilities';
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
    const displayTimerList = incomingTimers && incomingTimers.length > MAX_DISPLAY_CNT?
       incomingTimers.slice(0, MAX_DISPLAY_CNT) : incomingTimers.slice(0)
    return (<Container className='Timeline-container'>
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
                  lineHeight = {2}
                />
                )
            })
        }
    </Container>)
}


export default TimelineBoard;