import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';

const EditTaskDiv = props => {
    const {taskListId, closeAddTaskMode} = props;
    const { handleUpsertTask } = useDataContext();
    const MAX_TITTLE_LENGTH = 140;
    const [taskName, setTaskName] = React.useState('New Task');
    const handleChange = (e) => setTaskName(e.target.value.length > MAX_TITTLE_LENGTH ? 
         e.target.value.slice(0, MAX_TITTLE_LENGTH ): e.target.value);
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
                        maxLength =  {MAX_TITTLE_LENGTH }
                        onChange = {handleChange}
                     />
               <Button primary type="button" onClick={handleSubmit}>Save </Button>
               <Button secondary type="button" onClick={closeAddTaskMode}>Cancel</Button>
       </Form>)
   }

export default EditTaskDiv;