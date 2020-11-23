import React from 'react';
import { Container, Header, Icon, Button} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { useParams} from 'react-router-dom'
import TimerDetailInfo  from './timer-detail-info';
import TimerForm from '../timerpage/timer-form';
import { matchedTaskLists } from '../../utilities/tasklist-utilities';

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
    const [editMode, setEditMode,] = React.useState(false);

    const {
        getRelatedTasksOfTimers,
        tasklists,
    } = useDataContext();
    const [relatedTaskLists, setRelatedTaskLists] = React.useState([]);

    React.useEffect(async ()=>{
        async function fetchData(){
          const relatedTasks = await getRelatedTasksOfTimers(timer.id);
        //   console.log(relatedTasks);
            setRelatedTaskLists(matchedTaskLists(relatedTasks, tasklists))
        }  
        // may change to edit state instead of
        if(editMode === false){
            await fetchData();
        }
    }, [editMode]);

    const closeEditMode = ()=> setEditMode(false);
    const displayTasklist = relatedTaskLists && relatedTaskLists.length > 0?
        relatedTaskLists.filter(item=>(item.tasks && item.tasks.length > 0)) : [];

    return editMode? (  <TimerForm editTimer = {timer} editMode = {true} closeEditMode = {closeEditMode}/> ):
      (<Container>
        <Header as='h2' textAlign='center' icon>
        <Icon name='clock outline'/>
           {timer.title}
       </Header>
        <TimerDetailInfo timer = {timer} relatedTasklists = {displayTasklist} />
           <Button primary size = 'big' onClick = {()=>setEditMode(true)}>Edit</Button>
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
        <DisplayTimer timer = {targetTimer}/>
    )
};

export default SingleTimer;