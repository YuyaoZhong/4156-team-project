import React from 'react';
import { Button, Card, Form, Dimmer, Loader} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';


const NewTasklistCard  = props => {
    const {closeAddTaskListMode} = props;
    const [taskListName, setTaskListName] = React.useState('New TaskList');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const MAX_TITTLE_LENGTH = 140;
    const {
        handleUpsertTaskList,
    } = useDataContext();
     const handleChange = (e) => setTaskListName(e.target.value.length > MAX_TITTLE_LENGTH ? 
        e.target.value.slice(0, MAX_TITTLE_LENGTH ): e.target.value);

    const validate = () => {
        if (!taskListName|| taskListName === "" || taskListName === undefined){
            setError("Task list name can not be empty!")
        }
    }
     const handleSubmit = async () => {
        if (error !== null){
            return;
        }
        setLoading(true);
        const newTask = {
            'name': taskListName
        };
        await handleUpsertTaskList(newTask, false);
        setLoading(false);
        closeAddTaskListMode();
    }
    
    return (<Card>
            <Card.Content>
                <Card.Header>
                     Create new Tasklist
                </Card.Header>
            </Card.Content>

            
         {
             loading?
              <Card.Content>
                    <Loader active inline="centered"> Creating... </Loader> 
              </Card.Content>
             :(<>
                <Card.Content>
                    <Form size = 'large'>
                        <Form.Field
                        name = 'tasklist name'
                        label = '' control = 'input' type = 'text'
                        maxLength =  {MAX_TITTLE_LENGTH }
                        value = {taskListName}
                        onChange = {handleChange}
                        onFocus = {()=>setError(null)}
                        onBlur = {validate}
                        error = {error}
                    />

                    </Form>
                    </Card.Content>
                

                <Card.Content extra>
                    <Button secondary floated="right" type="button" onClick={closeAddTaskListMode}>Cancel</Button>
                    <Button primary floated="right" disabled = {error !== null} type="button" onClick={handleSubmit}>Add </Button>
                </Card.Content>
             </>)
         }
    </Card>)
}

export default NewTasklistCard;