import React  from 'react';
import { SERVER_URL } from '../../constants/constants';
import { useLocation, Redirect} from 'react-router-dom'
import { upsertData } from '../../utilities/apiMethods';
import { useDataContext } from '../../context/data-context';

const CreateZoomPage = () => {

    // const [creating, setCreating ] = React.useState(true);
    // console.log(useLocation())
    const { updateTimerListState } = useDataContext();
    const [redirect, setRedirect] = React.useState(null);
    
    const location = useLocation();
    const path = location.pathname.slice(0);
    
    React.useEffect(()=>{

        async function createZoom(){
        
            const createZoomUrl =  `${SERVER_URL}${path}${location.search}`;
            // console.log(createZoomUrl);
            await upsertData(createZoomUrl, {}, 'PUT').then(res=>{
                console.log(res);
                if(res.code === 200){
                    const timerData = res.data.timer;
                    updateTimerListState(timerData.id, timerData, true);
                    setRedirect(`/timer/${timerData.id}`)
                }

            })

        }

        createZoom();

    }, [])


    return redirect && redirect.length > 0 ? (<Redirect push to = {redirect} /> ) : (<div>Creating...</div>)
}


export default CreateZoomPage;