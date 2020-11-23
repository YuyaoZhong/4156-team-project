import React from 'react';
import { Button, Container, Card, Form, Header, Icon, List } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';

const defaultTaskList = {"id": 0, "name": "Default"};
const matchedTaskLists = (tasks, tasklists) => {
    const newTaskLists = tasklists.slice(0);
    newTaskLists.unshift(defaultTaskList);
    const matchedTaskLists = newTaskLists.reduce((res, item)=>{
        if (String(item.id) === '0') {
            const relatedTasks = tasks && tasks.length > 0 ? 
            tasks.filter(task=>(!task.taskListId || task.taskListId === 0 || parseInt(String(task.taskListId)) <= 0)) 
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

const EditTaskDiv = props => {
 const {taskListId, closeAddTaskMode} = props;
 const {
    handleUpsertTask,
 } = useDataContext();
 const [taskName, setTaskName] = React.useState('New Task');
 const handleChange = (e) => setTaskName(e.target.value);
 const handleSubmit = () => {
     const newTask = {
         'taskListId': taskListId,
         'status': 0,
         'name': taskName
     };
     handleUpsertTask(newTask, false);
     closeAddTaskMode();
 }
  return ( <Form size = 'large'>
                <Form.Field 
                name = 'task name' label = 'name' control = 'input' type = 'text'
                value = {taskName}
                // defaultValue = {taskName}
                onChange = {handleChange}        
            />
            <Button primary type="button" onClick={handleSubmit}>Save </Button> 
            <Button secondary type="button" onClick={closeAddTaskMode}>Cancel</Button>   
    </Form>)
}

export const TaskDiv = props => {
    const {task} = props;
    const {
        handleUpsertTask,
     } = useDataContext();
    const [checked, setChecked] = React.useState(task.status);
    const toggleChecked = () =>{
        const newTask = Object.assign({}, task);
        const nextStatus = 1 - checked;
        newTask.status = nextStatus;
        handleUpsertTask(newTask, true);
        setChecked(nextStatus);
    }

    const iconClass = checked ? 'check square outline': 'square outline';
    return (<List.Item>
        <List.Icon name = {iconClass} size = "large" verticalAlign='middle' onClick = {toggleChecked} />
        <List.Content>
            <List.Header><Header as="h4">{task.name}</Header></List.Header>
        </List.Content>
        
    </List.Item>)
}

const TasklistCard  = props => {
    const {tasklist, hideAddTask} = props;

    const [addTaskMode, setAddTaskMode] = React.useState(false);
    const handleAddTaskMode = (status) => setAddTaskMode(status);
    const closeAddTaskMode = () => setAddTaskMode(false);
    return(<Card>
        <Card.Content>
            <Card.Header>{tasklist.name}</Card.Header>
          
        </Card.Content>
        <Card.Content>
        <List divided relaxed>
            {tasklist.tasks && tasklist.tasks.length > 0 ? 
              tasklist.tasks.map((task, i) => {
                  return(<TaskDiv task = {task}/>)
              })
            :""}
        </List>
           
        </Card.Content>

      {hideAddTask? "":
        <Card.Content extra>
        {addTaskMode? <EditTaskDiv
              taskListId = {tasklist.id}
              closeAddTaskMode = {closeAddTaskMode}
            />: <Button color='grey' fluid onClick={()=>handleAddTaskMode(true)}><Icon name="plus"/></Button>}
        </Card.Content>
      }
    </Card>)
}


export const TaskListArea = props => {
    const {curTaskLists, hideAddTask} = props;
    return ( <Card.Group itemsPerRow = {3}>
        {curTaskLists.map((item, i)=>{
            return(<TasklistCard key = {i} tasklist = {item} hideAddTask = {hideAddTask}/>)
        })}
        </Card.Group>)
}

const AllTaskLists = () =>{
    const {
        tasks,
        tasklists,
        loading,
    } = useDataContext();
        // console.log('task lists', tasklists)
    //  console.log('in all task lists', tasks, tasklists)
    const [curTaskLists, setCurTaskLists] = React.useState(matchedTaskLists(tasks || [], tasklists || []));


    React.useEffect(()=>{
        console.log(tasklists)
        setCurTaskLists(matchedTaskLists(tasks || [], tasklists || []));
    }, [tasks, tasklists, loading]);

    return loading? "":(<Container>
        <Header as='h2' textAlign='center'>
           <Icon name='tasks'/>
           <Header.Content>
               Tasks
           <Header.Subheader>Manage your tasks</Header.Subheader>
           </Header.Content>
       </Header>
       <Card.Group itemsPerRow = {3}>
       {curTaskLists.map((item, i)=>{
           return(<TasklistCard key = {i} tasklist = {item}/>)
       })}
       </Card.Group>
   </Container>)
}

export default AllTaskLists;