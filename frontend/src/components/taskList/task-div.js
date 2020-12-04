import React from 'react';
import { Header,  List} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';


const TaskDiv = props => {
    const {task, hideEdit} = props;
    const {
        handleUpsertTask,
        handleDeleteTask,
     } = useDataContext();
    const [checked, setChecked] = React.useState(task.status);
    
    const toggleChecked = () =>{
        const newTask = Object.assign({}, task);
        const nextStatus = 1 - checked;
        newTask.status = nextStatus;
        handleUpsertTask(newTask, true);
        setChecked(nextStatus);
    }
    const deleteTask = () =>{
        const deletedTask = Object.assign({}, task);
        handleDeleteTask(deletedTask);
    }

    const iconClass = checked ? 'check square outline': 'square outline';
    return (<List.Item>
        <List.Icon name = {iconClass} size = "large" verticalAlign='middle' onClick = {toggleChecked} />
        <List.Content>
            <List.Header><Header as="h4">{task.name}</Header></List.Header>
        </List.Content>
     {
         hideEdit? "":   <List.Icon style ={{"cursor":"pointer"}} name = {'minus square'} verticalAlign='middle' onClick = {deleteTask} />
     }

    </List.Item>)
}

export default TaskDiv;