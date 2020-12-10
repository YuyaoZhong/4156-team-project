import React from 'react';
import { Button, Card,  Icon, List} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import TaskDiv from './task-div';
import EditTaskDiv from './edit-task-div';

const TasklistCard  = props => {
    const {tasklist, hideEdit} = props;

    const [addTaskMode, setAddTaskMode] = React.useState(false);
    const {
        handleDeleteTaskList,
     } = useDataContext();

    const deleteTaskList = () =>{
        const deletedTaskList = Object.assign({}, tasklist);
        handleDeleteTaskList(deletedTaskList);
    }

    const handleAddTaskMode = (status) => setAddTaskMode(status);
    const closeAddTaskMode = () => setAddTaskMode(false);
    return(<Card>
        <Card.Content extra style={{alignItems:"center"}}>
            <Card.Header>
            {tasklist.name}
            {
                (hideEdit || tasklist.id ===0) ?"": 
                <Button floated = 'right'  color ='grey'  animated>
                    <Button.Content  visible>Delete</Button.Content>
                    <Button.Content onClick = {deleteTaskList} hidden>
                    <Icon name="trash alternate" />
                    </Button.Content>
                </Button>

                // <Button  style={{"padding": "5px"}} icon inverted  floated='right'>
                //     <Icon color ='red' name="trash alternate"/></Button>
                // <Icon name="trash alternate icon" color = "red" onClick = {deleteTaskList}/>
            }
            
            </Card.Header>

        </Card.Content>
        <Card.Content>
        <List divided relaxed>
            {tasklist.tasks && tasklist.tasks.length > 0 ?
              tasklist.tasks.map((task, i) => {
                  return(<TaskDiv key = {i} task = {task} hideEdit={hideEdit}/>)
              })
            :""}
        </List>
           
        </Card.Content>

      {hideEdit? "":
        <Card.Content extra>
        {addTaskMode? <EditTaskDiv
              taskListId = {tasklist.id}
              closeAddTaskMode = {closeAddTaskMode}
            />: <Button  fluid size="tiny" onClick={()=>handleAddTaskMode(true)}><Icon name="plus"/></Button>}
        </Card.Content>
      }
    </Card>)
}

export default TasklistCard;