import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Drawer, FormControl, OutlinedInput, InputAdornment, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, Button } from '@material-ui/core';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import { SearchUsers } from '../../store/Account/types';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import { randomColor } from '../../utils/randomColor';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    openDrawer: boolean;
    handleDrawerClose: () => void;
}

const AddUsers:React.FC<Props> = (props) => {
    const { openDrawer, handleDrawerClose, searchUsers, getConferenceUsersAction, conferenceUsers } = props;
    const [search, setSearch] = useState('');

    const searchHandle = searchUsers.filter((item) => {
        if (search.length === 0) {
            return item;
        }
        return item.userName.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });

    const addUserAccount = (userAccount: SearchUsers) => {
        userAccount.done = true
        getConferenceUsersAction(userAccount);
        
    }

    return (
        <Drawer
            variant="persistent"
            anchor="right"
            className="drawerFullWidth"
            open={openDrawer}>
                <div className="back" onClick={handleDrawerClose}>
                    <ArrowBackIosRoundedIcon />
                    <span>Назад</span>
                </div>
                <div className="title">Добавьте участников конференции</div>
                <FormControl variant="outlined" fullWidth size="small" className="search">
                    <OutlinedInput
                        placeholder="Введите имя сотрудника"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        endAdornment={
                            <InputAdornment position="end">
                                {search 
                                    ? 
                                        <IconButton edge="end" onClick={() => setSearch('')}>
                                            <CloseIcon />
                                        </IconButton>
                                    :
                                        <IconButton edge="end" onClick={() => setSearch('')}>
                                            <SearchIcon />
                                        </IconButton>
                                }
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <List className="usersList">
                    {searchHandle.map(user => (
                        <ListItem 
                            disabled={user.done ? true : false} 
                            button alignItems="flex-start" 
                            key={'drawer-' + user.userId + Math.random()} 
                            onClick={() => addUserAccount(user)}>
                            <ListItemAvatar>
                                <Avatar alt={user.userName} src="/broken-image.jpg" className="staffBox__avatar" style={{backgroundColor: randomColor()}}>
                                    {user.userName.substr(0, 1)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={user.userName}
                                secondary={
                                    <span className="position">{user.positionName}</span>
                                }
                            /> 
                            {user.done && 
                                <ListItemSecondaryAction>
                                    <DoneRoundedIcon />
                                </ListItemSecondaryAction>
                            }
                        </ListItem>
                    ))}
                </List>
                <Button
                    className="mobileBtn" 
                    variant="contained" 
                    color="primary" 
                    disableElevation 
                    disabled={conferenceUsers.length !== 0  ? false : true}
                    onClick={handleDrawerClose}>Далее</Button>
        </Drawer>
    );
}

const mapStateToProps = (state: RootState) => ({
    searchUsers: state.account.searchUsers,
    conferenceUsers: state.conferences.conferenceUsers,
    sessionId: state.auth.sessionId,
    userAccountSuccess: state.account.userAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getConferenceUsersAction: (conferenceUsers: SearchUsers) => dispatch(actions.conferences.getConferenceUsersAction(conferenceUsers)),
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUsers);