import React  from 'react';
import { useParams } from 'react-router-dom'

const CreateZoomPage = () => {

    const [creating, setCreating ] = React.useState(true);
    React.useEffect(()=>{

        async function createZoom(){


        }

        createZoom();

    }, [])


    return(<div>Creating...</div>)
}
