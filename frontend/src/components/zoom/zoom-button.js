import React from 'react';
import { Button } from 'semantic-ui-react';
import { ZOOM_LINK_URL } from '../../constants/constants';

const ZoomButton = props => {
    const {link, timerId} = props
    const zoomUrl = ZOOM_LINK_URL +  `&state=${timerId}`;
    return link && link !== "None"?
    (<a href={link} target='_blank'><Button primary floated='right' size = 'big'>Join Zoom Meeting</Button></a>)
    :(<a href={zoomUrl} ><Button floated='right' color='grey' size = 'big'>Add a Zoom Session</Button></a>);
}


export default ZoomButton;