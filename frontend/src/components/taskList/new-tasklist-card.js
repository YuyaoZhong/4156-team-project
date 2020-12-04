import React from 'react';
import { Button, Card, Form} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';


const NewTasklistCard  = props => {
    const {closeAddTaskListMode} = props;
    const [taskListName, setTaskListName] = React.useState('New TaskList');
    const MAX_TITTLE_LENGTH = 140;
    const {
    handleUpsertTaskList,
 } = useDataContext();
     const handleChange = (e) => setTaskListName(e.target.value.length > MAX_TITTLE_LENGTH ? 
        e.target.value.slice(0, MAX_TITTLE_LENGTH ): e.target.value);
     const handleSubmit = () => {
        const newTask = {
            'name': taskListName
        };
        handleUpsertTaskList(newTask, false);
        closeAddTaskListMode();
 }
    return(
        <Card>
            <Card.Content>
                <Card.Header>
                     Create new Tasklist
                </Card.Header>
            </Card.Content>

            <Card.Content>

            <Form size = 'large'>
                <Form.Field
                name = 'tasklist name'
                label = '' control = 'input' type = 'text'
                maxLength =  {MAX_TITTLE_LENGTH }
                value = {taskListName}
                onChange = {handleChange}
            />

            </Form>
            </Card.Content>
          

        <Card.Content extra>
            <Button secondary floated="right" type="button" onClick={closeAddTaskListMode}>Cancel</Button>
            <Button primary floated="right" type="button" onClick={handleSubmit}>Add </Button>
        </Card.Content>
    </Card>)
}

export default NewTasklistCard;