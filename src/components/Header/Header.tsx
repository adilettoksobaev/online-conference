import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { LogoIcon } from '../../icons/logo';
import { Box, Avatar, Typography } from '@material-ui/core';
import './Header.scss'
import { NavLink } from 'react-router-dom';
import { AuthAPI } from '../../api/AuthAPI';
import { randomColor } from '../../utils/randomColor';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Header:React.FC<Props> = ({ sessionId, logoutAction, userName }) => {
    const handleLogout = () => {
        if(sessionId) {
            AuthAPI.logout(sessionId);
            logoutAction();
        }
    }
    return (
        <AppBar position="fixed" className="header">
            <Toolbar className="header__toolbar">
                <LogoIcon />
                <Box className="header__profile-box">
                    <Box className="header__profile">
                        <Avatar alt={userName ? userName : ''} src="/broken-image.jpg" style={{backgroundColor: randomColor()}}>
                            {userName?.substr(0, 1)}
                        </Avatar>
                        <Typography>{userName}</Typography>
                    </Box>
                    <NavLink to="/" className="decorationNone white">
                        <Button color="inherit" className="header__button" onClick={handleLogout}>Выйти</Button>
                    </NavLink>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    userName: state.auth.userName,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    logoutAction: () => dispatch(actions.auth.logoutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);