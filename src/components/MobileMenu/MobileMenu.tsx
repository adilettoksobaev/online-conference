import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListItem, ListItemIcon, ListItemText, List } from '@material-ui/core';
import { ConferenceIcon, ProfileIcon } from '../../icons/menuIcons';

const MobileMenu = () => {
    const { pathname } = window.location;

	if (pathname.match(/new-conference/)) {
		return null
    }
    
    return (
        <List className="mobileMenu">
            <NavLink to="/conferences">
                <ListItem button>
                    <ListItemIcon>
                        <ConferenceIcon />
                    </ListItemIcon>
                    <ListItemText primary="Конференции" />
                </ListItem>
            </NavLink>
            <NavLink to="/profile">
                <ListItem button>
                    <ListItemIcon>
                        <ProfileIcon />
                    </ListItemIcon>
                    <ListItemText primary="Профиль" />
                </ListItem>
            </NavLink>
        </List>
    );
}

export default MobileMenu;