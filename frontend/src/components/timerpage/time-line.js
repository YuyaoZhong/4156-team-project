import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, Label, Icon, Divider, Button, CardContent,} from 'semantic-ui-react';
import './timer-board-style.css';

const Timeline = props => {
    const {
        direction, icon,  time, description, linkRoute="/",
       lineHeight = 4, lineColor = 'grey', color = 'grey'
      } = props;
      const textDir = direction === 'left' ? 'right' : 'left';
      const card = (
          <Card fluid raised color={color}>
            <Card.Content>
             <Card.Header>
             <Label pointing={textDir} color={color} attached="top" style={{ marginLeft: '0', fontSize: '14px'}}>
                {time}
              </Label>
             </Card.Header>
           </Card.Content>
           <Card.Content style = {{marginTop: "10px"}}>
             {description}
              <Divider />
              <Link to = {linkRoute}>
                  <Button inverted color = {color} floated='right'>Details</Button>
              </Link>
          
            </Card.Content>
          </Card>
      );
  
      const left = direction === 'left' ? card : '';
      const right = direction === 'right' ? card : '';
      const isMobile = window.innerWidth <= 768;
      const iconSize = isMobile ? 'small' : 'large';
      const height = isMobile ? `${lineHeight * 350}px` : `${lineHeight * 250}px`;
  
      return (
        <div>
          <div className="Timeline-line" style={{ height, background: lineColor }} />
          <Grid>
            <Grid.Row>
              <Grid.Column width={2} />
              <Grid.Column width={5}>
                {left}
              </Grid.Column>
              <Grid.Column width={2}>
                <Icon name={icon} size={iconSize} color={color} inverted circular style={{ margin: 'auto', boxShadow: `0 0 0 0.1em ${lineColor} inset` }} />
              </Grid.Column>
              <Grid.Column width={5}>
                {right}
              </Grid.Column>
              <Grid.Column width={2} />
            </Grid.Row>
          </Grid>
        </div>
      );
}


export default Timeline;