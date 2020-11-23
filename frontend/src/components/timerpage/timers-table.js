import React from 'react';
import { Link } from 'react-router-dom'
import {  Container, Button} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import ReactSemanticTable from '../table/semantic-react-table';
import TimerForm from './timer-form';

const dateFormatter = ({cell}) =>{
    const {value} = cell;
    if(!value){
      return "";
    }
    return (value).split('T')[0];
  }

const linkFormatter = ({row, cell}) => {
    const {value } = cell;
    const {values} = row;
    const timerId = values ? values.id : 0;
    return (<Link to={`/timer/${timerId}`}>{value}</Link>)
}

const timerTableColumns = [ 
    {
        Header: 'Timer ID',
        accessor: 'id',
        width: '45',
        maxWidth: '50',
    },
    {
        Header: 'Title',
        accessor: 'title',
        Cell: linkFormatter,
    },
    {
        Header: 'Start',
        accessor: 'startTime',
        Cell: dateFormatter,
    },
    {
        Header: 'Sessions',
        accessor: 'round',
    },
    {
        Header: 'Duration',
        accessor: 'duration',
        
    },
    {
        Header: 'Break Time',
        accessor: 'breakTime',
        
    },
]

const TimerTable = () => {
    // todo: sepearate incoming one
    const {timerList} = useDataContext();
    const [editMode, setEditMode] = React.useState(false);

    return (<Container>
        <Button primary floated='right' onClick={()=>setEditMode(true)}>Add New Timer</Button>
        {editMode?<TimerForm/> :<ReactSemanticTable
             columns = {timerTableColumns}
             data = {timerList}/>}
    </Container>
)
}

export default TimerTable;


