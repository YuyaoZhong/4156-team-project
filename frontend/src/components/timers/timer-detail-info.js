import React from 'react';
import { Label, List  } from 'semantic-ui-react';


const TimerDetailInfo = props => {
    const {timer} = props;
    return (  <List divided textAlign="center" size = 'huge'>
           <List.Item>
       <Label  size = 'huge' >
              Configuration
           </Label>
          <Label circular  color = 'red' size = 'large' >
               {timer.round} rounds
          </Label>
          <Label circular color = 'orange' size = 'large' >
               {timer.duration} min 
          </Label>
  
          <Label circular color = 'yellow' size = 'large' >
               {timer.breakTime} min break
          </Label>
       </List.Item>
      <List.Item>
       <Label size = 'huge'>
               Start time
           </Label>
           <span style={{"margin": "20px"}}>
           { timer.startTime}
           </span>
       </List.Item>
  
      <List.Item>
       <Label size = 'huge' >
               Description
           </Label>
           <span style={{"margin": "20px"}}>
           {timer.description}
           </span>
       </List.Item>
     </List>)
  }
   
export default TimerDetailInfo;