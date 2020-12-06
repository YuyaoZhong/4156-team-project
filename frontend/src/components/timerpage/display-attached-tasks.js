import { Icon, List, Label} from 'semantic-ui-react';
import './attach-list.css';

const AttachedTasks =  props => {
    const {data, selectHandler, hideRemove, noBorder} = props;
    return  data && data.length > 0 ? (   <List>
         {
                data.map((item, i)=>{
                        return(<List.Item key = {i}>
                            <Label basic size = 'big' className ={noBorder? "no-border-label" : ""}>
                            <Label circular size = 'medium' style ={{marginRight: "5px"}}>
                                {item.taskListName}
                            </Label>
                            {item.name}
                            {
                                hideRemove? "":
                                <Icon name = 'close' color = 'red' onClick = {()=>{selectHandler(item.key)}}/>
                            }
                            </Label>
                        </List.Item>)
                    })
                }
    </List>):""
};

export default AttachedTasks;