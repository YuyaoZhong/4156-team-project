import React from 'react';
import { Button, Icon } from 'semantic-ui-react';
import { ZOOM_LINK_URL } from '../../constants/constants';

const ZoomButton = props => {
    const {link, timerId, valid} = props
    const zoomUrl = ZOOM_LINK_URL +  `&state=${timerId}`;
    return link && link !== "None"?
    (<a href={link} target='_blank'><Button primary floated='right' size = 'big' disabled={!valid}>
         <Icon name="video"/>
        {valid?(<>
           Join Zoom Meeting
        </>): "Zoom Meeting Expired"
    }</Button></a>)
    : valid? (<a href={zoomUrl} ><Button floated='right' color='grey' size = 'big'>
        <Icon name="add"/>
        Add a Zoom Session</Button></a>):"";
}
export default ZoomButton;