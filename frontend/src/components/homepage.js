/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, { Component } from 'react'
import {
  Button,
  Container,
  Header,
  Icon,
  Segment

} from 'semantic-ui-react'

import { useGoogleAuth} from '../context/google-login-context';

const GoogleButton = () => {
    const {isSignedIn, signIn } = useGoogleAuth();
   
    return isSignedIn? 
     <Button primary size='huge'>
      Get Started!
    </Button>
   
    :(<Button primary size='huge' onClick={signIn}>Sign In With Google Account</Button>)
   }
   

const HomepageHeading = ({ mobile }) => (
        <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em' }}
            vertical
          >
  <Container text>
    <Header
      as='h1'
      content='Time Management'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Efficiency, Collobartion, Sharing'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <GoogleButton/>
    {/* <Button primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button> */}
  </Container>
  </Segment>
)



export default HomepageHeading