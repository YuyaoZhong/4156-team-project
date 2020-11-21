import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, Image, Menu, Segment} from 'semantic-ui-react';
import { useGoogleAuth } from '../../context/google-login-context';



const GoogleButton = () => {
 const {isSignedIn, signIn, signOut, googleUser} = useGoogleAuth();
//  console.log(clientId)
// console.log(googleUser);

 return isSignedIn? 
 (<Menu.Item>
   <Image src = {googleUser.profileObj.imageUrl} avatar />
   <span>{googleUser.profileObj.name}</span>
   <Button secondary onClick={signOut}>Log Out</Button>
 </Menu.Item> )

 :(<Button primary onClick={signIn}>Sign In</Button>)
}


const NavBar = () => {
   const [activeItem, setActiveItem] = React.useState('');
   const handleItemClick = (e, {name}) => setActiveItem(name);
   return (
    <Segment inverted>
         <Menu inverted secondary size='massive'>
          <Menu.Item
              name = 'Dashboard'
              active = {activeItem === 'Dashboard'}
              as = {NavLink}
              to = '/dashboard'
              onClick = {handleItemClick}
          />
            <Menu.Item
              name = 'Tasks'
              active = {activeItem === 'Tasks'}
              as = {NavLink}
              to = '/tasks'
              onClick = {handleItemClick}
          />
           <Menu.Item
              name = 'Timers'
              active = {activeItem === 'Timers'}
              as = {NavLink}
              to = '/timers'
              onClick = {handleItemClick}
          />
          <Menu.Item
                name = 'Running Timer'
                active = {activeItem === 'Running Timer'}
                as = {NavLink}
                to = '/running_timer'
                onClick = {handleItemClick}
            />
          <Menu.Menu position='right'>
              <GoogleButton/>
          </Menu.Menu>
     </Menu>
     </Segment>
   )
}

export default NavBar;
