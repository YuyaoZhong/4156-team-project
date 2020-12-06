import React from 'react';
import { useDataContext } from '../../context/data-context';
import TimerDetailInfo  from './timer-detail-info';
import { matchedTaskLists } from '../../utilities/tasklist-utilities';

const DisplayTimer = props => {

    const {timer, editMode} = props;
    const {
        getRelatedTasksOfTimers,
        tasklists,
    } = useDataContext();

    const [relatedTaskLists, setRelatedTaskLists] = React.useState([]);

    React.useEffect(async ()=>{
        async function fetchData(){
          const relatedTasks = await getRelatedTasksOfTimers(timer.id);
            setRelatedTaskLists(matchedTaskLists(relatedTasks, tasklists))
        }
        // may change to edit state instead of
        if(editMode === false){
            await fetchData();
        }
    }, [editMode]);

    const displayTasklist = relatedTaskLists && relatedTaskLists.length > 0?
    relatedTaskLists.filter(item=>(item.tasks && item.tasks.length > 0)) : [];

    return ( <TimerDetailInfo timer = {timer} relatedTasklists = {displayTasklist} />)

}


export default DisplayTimer;