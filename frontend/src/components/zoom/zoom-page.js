import React  from 'react';
import { SERVER_URL } from '../../constants/constants';
import { useLocation, Redirect} from 'react-router-dom'
import { upsertData } from '../../utilities/apiMethods';
import { useDataContext } from '../../context/data-context';
import { Loader, Dimmer } from 'semantic-ui-react';


const CreateZoomPage = () => {

    // const [creating, setCreating ] = React.useState(true);
    // console.log(useLocation())
    const { updateTimerListState } = useDataContext();
    // const [loading, setLoading] = React.useState(false);
    const [redirect, setRedirect] = React.useState(null);
    const [popupStatus, setPopupstatus] = React.useState({message:"", success:true})

    const location = useLocation();
    const path = location.pathname.slice(0);
    
    React.useEffect(()=>{

        let timeOutRedirect;
        async function createZoom(){
        
            const createZoomUrl =  `${SERVER_URL}${path}${location.search}`;
            // console.log(createZoomUrl);
            await upsertData(createZoomUrl, {}, 'PUT').then(res=>{
                console.log(res);
                if(res.code === 200){
                    const timerData = res.data.timer;
                    if(timerData.isCreator !== true && timerData.isCreator !== false){
                        timerData.isCreator = true;
                        timerData.timerToUserId = timerData.userId;
                    }
                    setPopupstatus({message: res.message, success:true})
                    updateTimerListState(timerData.id, timerData, true);
                    setRedirect(`/timer/${timerData.id}`)
                }else{
                    setPopupstatus({message: res.message, success:false})
                    if(res.data.timer && res.data.timer.id){
                        timeOutRedirect = setTimeout(()=>{
                            setRedirect(`/timer/${res.data.timer.id}`)
                        }, 4000);
                    }else{
                      
                        timeOutRedirect= setTimeout(()=>{
                            setRedirect(`/timers`)
                        }, 4000)
                    }
                }

            })

        }

        createZoom();

        return ()=>{
                clearTimeout(timeOutRedirect);
        };

    }, [])


    return redirect && redirect.length > 0 ? 
    (<Redirect push to = {redirect} /> ) : (<>
        {
            popupStatus.success !== false? 
            ( <Dimmer active inverted>
                <Loader size='massive'>Creating A Zoom Meeting...</Loader>
              </Dimmer>):  ( <Dimmer active inverted>

                <Loader size='large'>
                    <div><h4>Error</h4></div>
                    <div>We are sorry there is an error occurred.</div>
                    Will be redirected to timer page...
                    
                    <div><small>Details:{popupStatus.message}</small></div>
                   </Loader>
              </Dimmer>)
        }
          {/* <ResponseMessage 
                handleClose = {handleMessageClose} 
                messageStatus = {popupStatus}
                style  = {{ left: '40%', position: 'fixed', top: '25%', minHeight: '100px', minWidth: '200px',zIndex: 1000 }}
            
            /> */}
    </>)
}


export default CreateZoomPage;