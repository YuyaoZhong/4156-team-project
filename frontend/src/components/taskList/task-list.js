import React from 'react';
import { Button, Container, Card, Form, Header, Icon } from 'semantic-ui-react';
// import { DateInput, TimeInput } from 'semantic-ui-calendar-react';
import { useDataContext } from '../../context/data-context';
// import { constructDate, formatDate, formatTime } from '../../utilities/utilities';

const defaultTaskList = {"id": 0, "name": "Default"};
const matchedTaskLists = (tasks, tasklists) => {
    const newTaskLists = tasklists.splice(0);
    newTaskLists.unshift(defaultTaskList);
    const matchedTaskLists = newTaskLists.reduce((res, item)=>{
        if (String(item.id) === 0) {
            const relatedTasks = tasks && tasks.length > 0 ? 
            tasks.filter(task=>(!task.taskListId || parseInt(String(task.taskListId)) <= 0)) 
            : [];
            res.push({...item, "tasks": relatedTasks});
        } else {
            const relatedTasks = tasks && tasks.length > 0 ? 
            tasks.filter(task=>(task.taskListId && String(task.taskListId) === String(item.id)))
            : [];
            res.push({...item, "tasks": relatedTasks});
        }
        return res;
    }, [])    
  return matchedTaskLists;
}

const EditTaskDiv = () => {

}

const AllTaskLists = () =>{
    const {
        tasks,
        tasklists,
    } = useDataContext();
   
    const [curTaskLists, setCurTaskLists] = React.useState(matchedTaskLists(tasks || [], tasklists || []));

    return (<Container>
    <Card.Group itemsPerRow = {3}>
    {curTaskLists.map((item, i)=>{
          return(<Card key = {i}>
                    <Card.Content header = {item.name}/>
                 </Card>)
       })}
    </Card.Group>
    </Container>)
}

export default AllTaskLists;