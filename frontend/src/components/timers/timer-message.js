import React from 'react';
import { Message, TransitionablePortal} from 'semantic-ui-react';

const ResponseMessage = props => {
    const {handleClose, messageStatus, message, style } = props;
    const messageStyle = style ? style : { left: '40%', position: 'fixed', bottom: '20%', zIndex: 1000 };
    return(<TransitionablePortal onClose={handleClose} open={messageStatus.open}>
          {messageStatus.success === true? <Message positive  style={messageStyle}>
            <Message.Header>Success</Message.Header>
                <p>{message? message : "Sucessfuly Added!"}</p>
            </Message> :
                (messageStatus.success === false? (<Message negative  style={messageStyle}>
                    <Message.Header>Error</Message.Header>
                    <div style={{whiteSpace: 'pre-wrap'}}>{message? message: "Request Fail."}</div>
                </Message> ): <p></p>)
        }

      </TransitionablePortal>)
}

export default ResponseMessage;
