import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';

const EditTaskDiv = props => {
    const {taskListId, closeAddTaskMode} = props;
    const { handleUpsertTask } = useDataContext();
    const MAX_TITTLE_LENGTH = 140;
    const [taskName, setTaskName] = React.useState('New Task');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const handleChange = (e) => setTaskName(e.target.value.length > MAX_TITTLE_LENGTH ? 
         e.target.value.slice(0, MAX_TITTLE_LENGTH ): e.target.value);

    const validate = () => {
        if (!taskName || taskName === "" || taskName === undefined){
            setError("Task name can not be empty!")
        }
    }

    const handleSubmit = async () => {
        if (error != null){
            return;
        }
        setLoading(true);
        const newTask = {
            'taskListId': taskListId,
            'status': 0,
            'name': taskName
        };
        await handleUpsertTask(newTask, false);
        setLoading(false);
        closeAddTaskMode();
    }
     return loading? (<div>Creating...</div>):( <Form size = 'large'>
                   <Form.Field
                        name = 'task name' label = 'name' control = 'input' type = 'text'
                        value = {taskName}
                        // defaultValue = {taskName}
                        maxLength =  {MAX_TITTLE_LENGTH }
                        onChange = {handleChange}
                        onFocus = {()=>setError(null)}
                        onBlur = {validate}
                        error={error? error :null}
                     />
               <Button primary type="button" disabled ={error !== null} onClick={handleSubmit}>Save </Button>
               <Button secondary type="button" onClick={closeAddTaskMode}>Cancel</Button>
       </Form>)
   }

export default EditTaskDiv;