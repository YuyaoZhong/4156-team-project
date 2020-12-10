import React from 'react';
import { Link } from 'react-router-dom'
import {  Container, Button, Icon, Modal, Header} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import ReactSemanticTable from '../table/semantic-react-table';
import { formatDateAndTime } from '../../utilities/utilities';
import TimerForm from './timer-form';
import './timer-table.css';


const dateFormatter = ({cell}) =>{
    const {value} = cell;
    if(!value){
      return "";
    }
    return formatDateAndTime(new Date(value));
  }

// const idFormat = ({row, cell})=>{
//   const {value } = cell;
//   const {values} = row;
//   return (<>
//       {!values.isCreator? <Label color='blue' size='small' ribbon>Shared</Label>:""}
        
//         <div>
//         {value}  
//         </div>
 
//   </>)
// }
const linkFormatter = ({row, cell}) => {
    const {value } = cell;
    const {values} = row;
    const timerId = values.id || 0;
    return (
      <>
         
        <div>
          <Link to={`/timer/${timerId}`}>{value}</Link>
        </div>
        {!values.isCreator?(<small>shared from other users</small>):""}
      </>
    )
}


const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef()
      const resolvedRef = ref || defaultRef
  
      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])
  
      return (
        <>
          <input type="checkbox" ref={resolvedRef} {...rest} />
        </>
      )
    }
  )

const selectionColumn = {
    id: 'selection',
    // The header can use the table's getToggleAllRowsSelectedProps method
    // to render a checkbox
    Header: ({ getToggleAllPageRowsSelectedProps }) => (
      <div>
        <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
      </div>
    ),
    // The cell can use the individual row's getToggleRowSelectedProps method
    // to the render a checkbox
    Cell: ({ row }) => (
      <div>
        <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
      </div>
    ),
  }

const timerTableColumns = [


    {
        Header: 'Timer ID',
        accessor: 'id',
        width: '45',
        maxWidth: '50',
        show: false,
        // Cell: idFormat,
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
    {
      Header: 'timerToUserId',
      accessor: 'timerToUserId',
      show: false,
      
    },
    {
      Header: 'Creator',
      accessor: 'isCreator',
      show: false, 
    },
]


const DeleteConfirmModal = props => {
  // const [open, setOpen] = React.useState(false)
  const {open, handleOpen, handleClose, handleDelete, num} = props;
  const [deleting, setDeleting] = React.useState(false);

  // React.useEffect(()=>{

  //   let timeOut;
  //   if(deleting){
  //     timeOut = setTimeout(()=>{
  //       setDeleting(false);
  //       handleClose();
      
  //     }, 100);
  //   }

  //   return ()=>clearTimeout(timeOut);
  // },[]);

  return (
    <Modal
      basic
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      size='small'
      // trigger={<Button>Basic Modal</Button>}
    >
      <Header icon>
        <Icon name='archive' />
        Confirm To Delete Timers
      </Header>
     {
       (!num || num === 0 && !deleting)?(<Modal.Content>
         <p>
           No timers to delete.
         </p>
       </Modal.Content>):(<>
        
        <Modal.Content>
        <p>
          {!deleting?
            `Are you sure to delete selected ${num} timers ?`:"Successfully Deleted!"
          }
        </p>
      </Modal.Content>
     </>)
     }

      <Modal.Actions>
        {
          (deleting || !num || num === 0 )?(<>
         
        <Button color='green' inverted onClick={()=>{
          setDeleting(false);
          handleClose();
        }}>
          <Icon name='checkmark' /> OK
        </Button>
          </>):(<>
        <Button basic color='red' inverted onClick={()=>{
            setDeleting(false);
            handleClose();
        }}>
          <Icon name='remove' /> No
        </Button>
        <Button color='green' inverted onClick={async () => {
           await handleDelete();
           handleClose();
        }}>
          <Icon name='checkmark' /> Yes
        </Button>
          </>)
        }
      </Modal.Actions>
    </Modal>
  )
}

const TimerTable = () => {

    const {
        timerList,
        handleDeleteTimer, 
    } = useDataContext();

    const [editMode, setEditMode] = React.useState(false);
    const closeEditMode = () => setEditMode(false);
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [deleteMode, setDeleteMode] = React.useState(false);
    const [deleteOpen, setDeleteOpen] = React.useState(false);

    const handleDelete = async () => {
        const selectedTimerIds = [...selectedRows];
        
        await  handleDeleteTimer(selectedTimerIds);
        // console.log(selectedTimerId);   setSelectedRows([]);
        setDeleteMode(false);

    }

    const handleClose = () => {
      setDeleteOpen(false);
      setSelectedRows([]);
    }
    const handleOpen = () => setDeleteOpen(true);

    return (<Container>
      
        {editMode?<TimerForm
          closeEditMode = {closeEditMode}
        /> :
         <>
        <div className='button-group'>
        <Button primary floated='right' onClick={()=>setEditMode(true)}>Add New Timer</Button>
          {
              !deleteMode?(
                  <Button color= 'grey' floated='right' onClick={()=>{
                     setSelectedRows([]);
                      setDeleteMode(true);
              
                  }}>Delete Mode</Button>
              ):  (<>
                
                  <Button color= 'grey' floated='right' onClick={()=>{
                      setSelectedRows([]);
                      setDeleteMode(false);
                  }}>Cancel</Button>
                  {
                  !deleteOpen?( <Button color= 'red' floated='right' onClick={handleOpen}>Confirm</Button>):""
                  }
              </>
              )
          }
        </div>
         <ReactSemanticTable
             columns = {deleteMode === false? timerTableColumns: [selectionColumn, ...timerTableColumns]}
             data = {timerList}
             selectedRows={selectedRows}
             onSelectedRowsChange={setSelectedRows} 
            />
         </>}

         <DeleteConfirmModal 
          open={deleteOpen} 
          handleClose={handleClose} 
          handleOpen={handleOpen} 
          handleDelete = {handleDelete}
          num = {selectedRows.length}
          />
    </Container>
)
}

export default TimerTable;


