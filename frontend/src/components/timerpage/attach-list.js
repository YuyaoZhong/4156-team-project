import React from 'react';
import { Button, Container, Card, Icon, List, ListItem } from 'semantic-ui-react';

// {id, name}
// todo: search box
// todo: with category
const AttachList = props => {
    const {data, renderAttr, buttonName, selectHandler} = props;
    const [show, setShow] = React.useState(false);

    return (<Container fluid style = {{position: "relative", marginBottom: "20px"}}>
        <Button onClick={()=>{setShow(!show)}}>{buttonName}</Button>
        {show ? <Card style = {{padding: "10px", position: "absolute", left: "0", zIndex: 1000}}>
                    <List divided>
                        {
                            data.map((item, i)=>{
                                return(<List.Item key = {i} onClick = {()=>selectHandler(item.key)} style = {{"cursor": "pointer"}}>
                                        {
                                            item.alterSelected?
                                        <Icon name = 'check' color = 'olive' /> :""   
                                        }
                                    {item[renderAttr]}

                                </List.Item>)
                            })
                        }
                    </List>
        </Card>: ""}
    </Container>)
}

export default AttachList;