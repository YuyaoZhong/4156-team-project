import React from 'react';
import { Button, Container, Card, Form, Header, Icon, List} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import NewTasklistCard from './new-tasklist-card';
import TasklistCard from './tasklist-card';
import { matchedTaskLists } from '../../utilities/tasklist-utilities';


export const TaskListArea = props => {
    const {curTaskLists, hideEdit} = props;
    return ( <Card.Group itemsPerRow = {3}>
        {curTaskLists.map((item, i)=>{
            return(<TasklistCard key = {i} tasklist = {item} hideEdit = {hideEdit}/>)
        })}
        </Card.Group>)
};


const AllTaskLists = () =>{
    const {
        tasks,
        tasklists,
        loading,
    } = useDataContext();
    console.log('in all task lists', tasks, tasklists)
    const [curTaskLists, setCurTaskLists] = React.useState(matchedTaskLists(tasks || [], tasklists || []));
     // console.log(curTaskLists, setCurTaskLists)
    const [addTaskListMode, setAddTaskListMode] = React.useState(false);
    const handleAddTaskListMode = (status) => setAddTaskListMode(status);
    const closeAddTaskListMode = () => setAddTaskListMode(false);
    const defaultNewList = {id: 0, name: "Default", tasks: Array(0)}


    React.useEffect(()=>{
        console.log(tasklists)
        setCurTaskLists(matchedTaskLists(tasks || [], tasklists || []));
    }, [tasks, tasklists, loading]);
    console.log(curTaskLists)

    return loading? "":(<Container>
        <Header as='h1' textAlign='center'>
            {/* <Icon name='tasks'/> */}
            Tasks
    <Button color = 'black' floated='right' onClick={()=>handleAddTaskListMode(!addTaskListMode)}>{
        !addTaskListMode? (<>
        <Icon name='plus'/> Add Task List
        </>) : ("Cancel Add")
    }</Button>
        </Header>


    
       <Card.Group itemsPerRow = {3}>
       {curTaskLists.map((item, i)=>{
        
           return(<TasklistCard key = {i} tasklist = {item}/>)
       })}
       {addTaskListMode?<NewTasklistCard tasklist = {defaultNewList} closeAddTaskListMode = {closeAddTaskListMode}/>:<h4></h4>}
       </Card.Group>
  
   </Container>)
}

export default AllTaskLists;
