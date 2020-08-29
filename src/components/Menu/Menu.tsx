import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@material-ui/core';
import { MainIcon, ConferenceIcon, ParticipantIcon, PersonalIcon, MaterialsIcon } from '../../icons/menuIcons';
import './Menu.scss'
import { NavLink } from 'react-router-dom';

type Props = ReturnType<typeof mapStateToProps>

const Menu: React.FC<Props> = ({ role}) => {
    const [access, setAccess] = useState(true);
    
    useEffect(() => {
        if(role === 'User') {
            setAccess(false);
        }
        else {
            setAccess(true);
        }
    }, [role]);

    return (
        <Drawer
            variant="permanent"
            className="menuDrawer">
            <List>
                <NavLink className="menuNav" to="/" exact>
                    <ListItem button>
                        <ListItemIcon>
                            <MainIcon />
                        </ListItemIcon>
                        <ListItemText primary="Главная" />
                    </ListItem>
                </NavLink>
                <NavLink className="menuNav" to="/conferences">
                    <ListItem button>
                        <ListItemIcon>
                            <ConferenceIcon />
                        </ListItemIcon>
                        <ListItemText primary="Конференции" />
                    </ListItem>
                </NavLink>
                {access && 
                    <NavLink className="menuNav" to="/participants">
                        <ListItem button>
                            <ListItemIcon>
                                <ParticipantIcon />
                            </ListItemIcon>
                            <ListItemText primary="Участники" />
                        </ListItem>
                    </NavLink>
                }
                {access && 
                    <NavLink className="menuNav" to="/personal">
                        <ListItem button>
                            <ListItemIcon>
                                <PersonalIcon />
                            </ListItemIcon>
                            <ListItemText primary="Персонал" />
                        </ListItem>
                    </NavLink>
                }
                <Box className="menuNav">
                    <ListItem>
                        <ListItemIcon>
                            <MaterialsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Материалы" />
                    </ListItem>
                </Box>
                {/* <NavLink className="menuNav" to="/materials">
                    <ListItem button>
                        <ListItemIcon>
                            <MaterialsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Материалы" />
                    </ListItem>
                </NavLink> */}
            </List>
        </Drawer>
    )
}

const mapStateToProps = (state: RootState) => ({
    role: state.auth.role,
});
  
export default connect(mapStateToProps)(Menu);