import React from 'react';
import { Container, Header, Icon, Dimmer, Loader} from 'semantic-ui-react';
import { useDataContext } from '../../context/data-context';
import { SERVER_URL } from '../../constants/constants';
import { useParams } from 'react-router-dom'
import AddedTimerMessage from './timer-message';
import {  getTimerId} from '../../utilities/timer-utilities';
import DisplayTimerArea from './display-timer-area';

const NotFoundTimer = () => {
    return(<Container>
        <Header as='h2' textAlign='center' icon>
             <Icon name='clock outline'/>
            Not Found the Requested Timer
        </Header>
    </Container>)
};


const SingleTimer = props => {
    const {
        // timers
        getTimerById,
        userId,
    } = useDataContext();

    const {timerid} = useParams();
    const [displayTimer, setDisplayTimer] = React.useState({});
    const [popupStatus, setPopupstatus] = React.useState({open: false})

    const [loading, setLoading] = React.useState(false);
    const handleMessageClose = () => setPopupstatus({open: false});
    const [editMode, setEditMode] = React.useState(false);
    const closeEditMode = ()=> setEditMode(false);
    const openEditMode = () => setEditMode(true);

    const changeAddedStatus = (success, added) => {
        if(success){
            const newTimer = Object.assign({}, displayTimer);
            newTimer.added = added;
            setDisplayTimer(newTimer);

        }
        setPopupstatus({open: true, success:success});
        setTimeout(()=>setPopupstatus({open:false, success:success}), 2500);
    }
    React.useEffect(()=>{

        let loadingTimeout;

        async function fetchData(){
            setLoading(true);
           const parseTimerid = getTimerId(timerid);
           const isSharingUrl = isNaN(parseInt(timerid, 10));
           if(parseTimerid < 0 || userId === "" || !userId){
               setDisplayTimer({});
            //    return;
           }else{
            const timer = getTimerById(parseTimerid);
            if (timer && Object.keys(timer).length !== 0){
                setDisplayTimer(timer);
                loadingTimeout = setTimeout(()=>setLoading(false), 200);
                return;
            }
            const queryTimerUrl = `${SERVER_URL}/timerToUser/?timerId=${parseTimerid}&userId=${userId}`;
        
            await fetch(queryTimerUrl).then(r=>r.json()).then(res=>{
             //    console.log('fetch Timer', res);
                if(res.code === 200 && res.data && (res.data.added || isSharingUrl)){
                     setDisplayTimer(res.data);
                } else{
                    setDisplayTimer({});
                }
            })
           }
        
           if (!displayTimer || Object.keys(displayTimer).length === 0) {
                loadingTimeout = setTimeout(()=>setLoading(false), 200)
           } else {
               setLoading(false);
           }
        }

        fetchData();
        return ()=>clearTimeout(loadingTimeout)

    }, [timerid, userId, editMode])


    // find the user created timer => may need to change fetch
    // const targetTimer = getTimerById(timerid);



    return loading? (    <Dimmer active>
        <Loader size='massive'>Loading</Loader>
      </Dimmer>):
    !displayTimer || Object.keys(displayTimer).length === 0 ? (
        <NotFoundTimer/>
    ):(
       <>
        <DisplayTimerArea
            editMode={editMode}
            closeEditMode={closeEditMode}
            openEditMode = {openEditMode}
            timer = {displayTimer}
            changeAddedStatus= {changeAddedStatus} />
        <AddedTimerMessage handleClose = {handleMessageClose} messageStatus = {popupStatus} />
       </>
    )
};

export default SingleTimer;
