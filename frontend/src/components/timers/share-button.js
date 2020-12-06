import React from 'react';
import { Button, Popup} from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getSharingUrl } from '../../utilities/timer-utilities';

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


export default ShareButton;