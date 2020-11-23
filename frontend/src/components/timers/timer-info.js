import React from 'react';
import { Button, Container, Header, Icon } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { useParams} from 'react-router-dom'
import TimerDetailInfo from './timer-detail-info';

// this.props.match.params.number

const NotFoundTimer = () => {
    return(<Container>
        <Header as='h2' textAlign='center' icon>
             <Icon name='clock outline'/>
            Not Found the Requested Timer
        </Header>
    </Container>)
};

export const DisplayTimer = props => {
    const {timer} = props;
   
    return (<Container>
        <Header as='h2' textAlign='center' icon>
        <Icon name='clock outline'/>
           {timer.title}
       </Header>
        <TimerDetailInfo timer = {timer} />
   </Container>)
};

const SingleTimer = () => {
    const {
        // timers
        getTimerById,
    } = useDataContext();

    const {timerid} = useParams();
    // find the user created timer => may need to change fetch
    const targetTimer = getTimerById(timerid); 

    return !targetTimer || Object.keys(targetTimer) === 0 ? (
        <NotFoundTimer/>
    ):(
        <DisplayTimer timer = {targetTimer} />
    )
};

export default SingleTimer;