import React from 'react';
import { Message, TransitionablePortal} from 'semantic-ui-react';

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

export default AddedTimerMessage;