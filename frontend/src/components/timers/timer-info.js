import React from 'react';
import { Container, Header, Icon, Button, Popup, Segment, Message, TransitionablePortal} from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDataContext } from '../../context/data-context';
import { ZOOM_LINK_URL, CLIENT_URL, SERVER_URL } from '../../constants/constants';
import { useParams, Link} from 'react-router-dom'
import TimerDetailInfo  from './timer-detail-info';
import TimerForm from '../timerpage/timer-form';
import { matchedTaskLists } from '../../utilities/tasklist-utilities';
import { upsertData } from '../../utilities/apiMethods';
// import { isCompositeComponent } from 'react-dom/cjs/react-dom-test-utils.production.min';

// this.props.match.params.number

const NotFoundTimer = () => {
    return(<Container>
        <Header as='h2' textAlign='center' icon>
             <Icon name='clock outline'/>
            Not Found the Requested Timer
        </Header>
    </Container>)
};

const ZoomButton = props => {
    const {link, timerId} = props
    const zoomUrl = ZOOM_LINK_URL +  `&state=${timerId}`;
    return link && link !== "None"?
    (<a href={link} target='_blank'><Button primary floated='right' size = 'big'>Join Zoom Meeting</Button></a>)
    :(<a href={zoomUrl} ><Button floated='right' color='grey' size = 'big'>Add a Zoom Session</Button></a>);
}

// todo: move to utilts
const getSharingUrl = (timerId, userId) =>{

    const toEncodeString = `timerId=${timerId}&creator=${userId}`;
    const encodedString = btoa(toEncodeString)
    const sharingUrl = `${CLIENT_URL}/timer/${encodedString}`
    return sharingUrl;
}

const getTimerId = (paramTimerId) => {
    
    let tryParseInt = parseInt(paramTimerId, 10);
    if (isNaN(tryParseInt)) {
      const decodeString = atob(paramTimerId);
      const params = decodeString.split('&')
      const paraObject = {};
      for(var i = 0; i < params.length; i++){
          if(params[i].includes('=')){
              const paramsAttr = params[i].split('=')
              if(paramsAttr.length == 2){
                  paraObject[paramsAttr[0]] = paramsAttr[1];
              }
          }
        }
    
        tryParseInt = parseInt(paraObject.timerId);
        if(isNaN(tryParseInt)){
           tryParseInt = -1;
        }
    } 

    return tryParseInt;


}
// const decodeSharingUrl = (sharingUrl)=>{
//     const paras = sharingUrl.split('/');
// }


const ShareButton = props => {
    const {timerId, userId} = props;
    const [open, setOpen] = React.useState(false);
    const buttonRef = React.useRef();
    const POPUP_LAST_SEC = 2500;
    const sharingUrl = getSharingUrl(timerId, userId);
    let timeout;
    const toggleButton = () => {
        if(!open){
            setOpen(true);
            timeout = setTimeout(()=>{
                setOpen(false);
            }, POPUP_LAST_SEC);
        } else {
            setOpen(false);
            clearTimeout(timeout);
        }
    }

   return( <div>
            <CopyToClipboard text={sharingUrl}>
                <Button  onClick={toggleButton} floated='right' color='grey' size = 'big'> Sharing Timer </Button>
            </CopyToClipboard>
            <div ref={buttonRef} style = {{minHeight: "50px"}}>
                <Popup
                    context={buttonRef}
                    content= {`Link copied! ${sharingUrl}`}
                    on='click'
                    open={open}
                    position = 'bottom center'
                />
            </div>
   </div>)
}


export const DisplayTimer = props => {

    const {timer, editMode} = props;
    const {
        getRelatedTasksOfTimers,
        tasklists,
    } = useDataContext();

    const [relatedTaskLists, setRelatedTaskLists] = React.useState([]);

    React.useEffect(async ()=>{
        async function fetchData(){
          const relatedTasks = await getRelatedTasksOfTimers(timer.id);
            setRelatedTaskLists(matchedTaskLists(relatedTasks, tasklists))
        }  
        // may change to edit state instead of
        if(editMode === false){
            await fetchData();
        }
    }, [editMode]);

    const displayTasklist = relatedTaskLists && relatedTaskLists.length > 0?
    relatedTaskLists.filter(item=>(item.tasks && item.tasks.length > 0)) : [];

    return ( <TimerDetailInfo timer = {timer} relatedTasklists = {displayTasklist} />)

}

export const DisplayTimerArea = props => {
    const {timer, hideTitle, hideEdit, canAddTimer, changeAddedStatus} = props;
    const [editMode, setEditMode] = React.useState(false);

    const {
        updateTimerListState,
    } = useDataContext();

    const closeEditMode = ()=> setEditMode(false);

    const handleAddTimer = async () => {
      
        const addTimerRoute = `${SERVER_URL}/timerToUser/`;
        const addTimerData = {
            userId: timer.timerToUserId,
            timerId: timer.id,
            status: timer.isCreator,
        };

        await upsertData(addTimerRoute, addTimerData, 'POST').then(res=>{
            if(res.code === 201 && res.data){
         
                const newTimer = Object.assign({}, timer);
                newTimer.added = true;
                updateTimerListState(newTimer.id, newTimer, true);
                changeAddedStatus(true, true);
            }
        })

    }

    return editMode? 
    (  <TimerForm editTimer = {timer} editMode = {true} closeEditMode = {closeEditMode}/> ):
      (<Container>
        <Header as='h2' textAlign='center' icon>
            <Icon name='clock outline'/>
                {timer.title}
            </Header>
        <DisplayTimer timer = {timer} editMode = {editMode}/>
        {timer.isCreator?
            (<Button floated='right' primary size = 'big' onClick = {()=>setEditMode(true)}>Edit</Button>)
            :""}
            <Link to='/timers'><Button floated='right' color='grey' size = 'big'>All Timers</Button></Link>

            <ZoomButton link = {timer.zoomLink} timerId={timer.id}/>
            {timer.isCreator? (
               <ShareButton userId = {timer.userId} timerId = {timer.id}/>
            ):(!timer.added?
                ( <Button floated='right' primary size = 'big' onClick = {handleAddTimer}>Add Timer To My List</Button>):"")
        }
   </Container>)
};

const AddedTimerMessage = props => {
    const {handleClose, messageStatus} = props;
    const messageStyle = { left: '40%', position: 'fixed', bottom: '20%', zIndex: 1000 };
    return(<TransitionablePortal onClose={handleClose} open={messageStatus.open}>
          {messageStatus.success? <Message positive  style={messageStyle}>
            <Message.Header>Success</Message.Header>
                <p>Sucessfuly Added!</p>
            </Message> :  
                (messageStatus.success === false? (<Message negative  style={messageStyle}>
                    <Message.Header>Error</Message.Header>
                    <p>Request failed.</p>
                </Message> ): "")
        }   
     
      </TransitionablePortal>)
}

const SingleTimer = props => {
    const {
        // timers
        getTimerById,
        userId,
    } = useDataContext();

    const {timerid} = useParams();
    const [displayTimer, setDisplayTimer] = React.useState({});
    const [popupStatus, setPopupstatus] = React.useState({open: false})

    const handleMessageClose = () => setPopupstatus({open: false});

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
        

        async function fetchData(){
           const parseTimerid = getTimerId(timerid);
           const isSharingUrl = isNaN(parseInt(timerid, 10));
           if(parseTimerid < 0 || userId === "" || !userId){
               setDisplayTimer({});
               return;
           }
           const queryTimerUrl = `${SERVER_URL}/timerToUser/?timerId=${parseTimerid}&userId=${userId}`;
           await fetch(queryTimerUrl).then(r=>r.json()).then(res=>{
               console.log('fetch Timer', res);
               if(res.code === 200 && res.data && (res.data.added || isSharingUrl)){
                    setDisplayTimer(res.data);
               } else{
                   setDisplayTimer({});
               }
           })
        }

        fetchData();

    }, [timerid, userId])
   
 
    // find the user created timer => may need to change fetch
    // const targetTimer = getTimerById(timerid); 

   

    return !displayTimer || Object.keys(displayTimer).length === 0 ? (
        <NotFoundTimer/>
    ):(
       <>
        <DisplayTimerArea  timer = {displayTimer} changeAddedStatus= {changeAddedStatus} />
        <AddedTimerMessage handleClose = {handleMessageClose} messageStatus = {popupStatus} />
       </>
    )
};

export default SingleTimer;