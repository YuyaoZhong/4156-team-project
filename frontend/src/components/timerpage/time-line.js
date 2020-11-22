import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Card, Label, Icon, Divider, Button,} from 'semantic-ui-react';
import './timer-board-style.css';

const Timeline = props => {
    const {
        direction, icon, title, time, description, linkRoute="/",
       tags, labelColor, lineHeight = 4, lineColor = 'grey', color = 'grey'
      } = props;
      const textAlign = direction === 'left' ? 'right' : 'left';
      const card = (
          <Card fluid raised color={color}>
            <Card.Content>
              <Label pointing={textAlign} color={labelColor} attached="top" style={{ marginLeft: '0' }}>
                {time}
              </Label>
              <Card.Header>
                {title}
              </Card.Header>
              <Card.Description>
                {description}
              </Card.Description>
              <Divider />
              <Link to = {linkRoute}>
                  <Button inverted color = {color} floated='right'>Details</Button>
              </Link>
              {/* <Label.Group color={color}>
             
                {tags.map((tag, i) => (
                  <Label key={i.toString()}>
                    {tag}
                  </Label>
                ))}
              </Label.Group> */}
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