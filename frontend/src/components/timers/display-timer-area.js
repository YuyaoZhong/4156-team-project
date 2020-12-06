import React from 'react';
import { Container, Header, Icon, Button} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { SERVER_URL } from '../../constants/constants';
import { Link} from 'react-router-dom'
import TimerForm from '../timerpage/timer-form';
import ZoomButton from '../zoom/zoom-button';
import ShareButton from './share-button';
import { upsertData } from '../../utilities/apiMethods';
import DisplayTimer from './display-timer';


const DisplayTimerArea = props => {
    const {timer, hideTitle, hideEdit, changeAddedStatus,
        editMode, closeEditMode, openEditMode,
    } = props;

    const {
        updateTimerListState,
    } = useDataContext();


    const handleAddTimer = async () => {

        const addTimerRoute = `${SERVER_URL}/timerToUser/`;
        const addTimerData = {
            userId: timer.timerToUserId,
            timerId: timer.id,
            status: timer.isCreator,
        };

        await upsertData(addTimerRoute, addTimerData, 'POST').then(res=>{
            if(res.code === 201 && res.data){

                const newTimer = Object.assign({}, timer);
                newTimer.added = true;
                updateTimerListState(newTimer.id, newTimer, true);
                changeAddedStatus(true, true);
            } else {
                changeAddedStatus(false, false);
            }
        })

    }

    return editMode?
    (  <TimerForm editTimer = {timer} editMode = {true} closeEditMode = {closeEditMode}/> ):
      (<Container>
        <Header as='h2' textAlign='center' icon>
            <Icon name='clock outline'/>
                {timer.title}
            </Header>
        <DisplayTimer timer = {timer} editMode = {editMode}/>
        {timer.isCreator?
            (<Button floated='right' primary size = 'big' onClick = {openEditMode}>Edit</Button>)
            :""}
            <Link to='/timers'><Button floated='right' color='grey' size = 'big'>All Timers</Button></Link>

            <ZoomButton link = {timer.zoomLink} timerId={timer.id}/>
            {timer.isCreator? (
               <ShareButton userId = {timer.userId} timerId = {timer.id}/>
            ):(!timer.added?
                ( <Button floated='right' primary size = 'big' onClick = {handleAddTimer}>Add Timer To My List</Button>):"")
        }
   </Container>)
};


export default DisplayTimerArea;