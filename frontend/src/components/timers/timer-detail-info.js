import React from 'react';
import { Label, List  } from 'semantic-ui-react';
import { TaskListArea } from '../taskList/task-list';
import { formatDateAndTime } from '../../utilities/utilities';

export const TimerDetailAttr = props =>{
    const {name, size} = props;
    return (  
    <Label  size = {size || 'huge'} >
     {name}
 </Label>)
}

const TimerDetailInfo = props => {
    const {timer, relatedTasklists,  attrNameSize, contentSize, hideTasks, color } = props;
    
    return (  <List divided>
           <List.Item>
          <TimerDetailAttr size ={ attrNameSize || 'huge'} name = 'Configuration'/>
          <Label circular  color = { color  || 'red'} size = {contentSize || 'large'} >
               {timer.round} rounds
          </Label>
          <Label circular color = { color  || 'orange'} size = {contentSize || 'large'} >
               {timer.duration} min 
          </Label>
  
          <Label circular color = {color || 'yellow'} size = {contentSize || 'large'} >
               {timer.breakTime} min break
          </Label>
       </List.Item>
      <List.Item>
      <TimerDetailAttr size ={ attrNameSize || 'huge'} name = 'Start Time'/>
           <span style={{"margin": "20px"}}>
           { formatDateAndTime(new Date(timer.startTime))}
           </span>
       </List.Item>
  
      {
          timer.description && timer.description.length > 0 ?

          <List.Item>
            <TimerDetailAttr size ={ attrNameSize || 'huge'} name = 'Description'/>
                <span style={{"margin": "20px"}}>
                {timer.description}
                </span>
            </List.Item> : ""
      }
      
      {
          !hideTasks && relatedTasklists && relatedTasklists.length > 0?
          <List.Item>
              <TimerDetailAttr name = "Related Tasks"/>
            <div style = {{marginTop: "20px", padding: "20px", background: "rgb(209 207 207 / 10%)"}}>
                <TaskListArea curTaskLists = {relatedTasklists} hideEdit = {true} /> 
            </div>
          </List.Item>:""
      }
     </List>)
  }
   
export default TimerDetailInfo;