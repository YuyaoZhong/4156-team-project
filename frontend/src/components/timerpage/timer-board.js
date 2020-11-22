import React, { Component } from 'react';
import { useDataContext } from '../../context/data-context';
import { Container, Icon, Header } from 'semantic-ui-react';
import Timeline from './time-line';
import './timer-board-style.css';

const colors = ['red', 'orange', 'yellow',
'olive', 'green', 'teal', 'blue', 'violet',
'purple', 'pink', 'browm', 'grey', 'black'
]

const directions = ['left', 'right']

// todo: change the NotFoundTimer
const NotFoundTimer = () => {
    return(<Container>
        <Header as='h2' textAlign='center' icon>
             <Icon name='clock outline'/>
            Not Found the Requested Timer
        </Header>
    </Container>)
}

const TimelineBoard = () => {
    const { timerList } = useDataContext();
    return (<Container>
        {
            timerList.map((timer, i) => {
                return(<Timeline
                  icon = "clock"
                  direction = {directions[i % directions.length]}
                  color = {colors[i % colors.length]}
                  time = {timer.title}
                  description = {new Date(timer.startTime).toString()}
                //   time = {new Date(timer.startTime).toString()}
                //   description = {timer.title}
                  linkRoute = {`/timer/${timer.id}`}
                  tags = {[]}
                  lineHeight = {4}
                />
                )
            })
        }
    </Container>)
}


export default TimelineBoard;