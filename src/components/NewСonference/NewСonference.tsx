import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Box, Button, Grid, FormControl, InputLabel, Input, InputAdornment, IconButton, TextField, FormHelperText, ListItem, ListItemIcon, ListItemText, List, ListItemAvatar, Avatar, ListItemSecondaryAction, Checkbox, Tooltip, FormControlLabel, ClickAwayListener } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {  KeyboardDatePicker } from '@material-ui/pickers';
import TimerIcon from '@material-ui/icons/Timer';
import './NewСonference.scss';
import SortBox from '../SortBox/SortBox';
import PersonalTable from '../bricks/PersonalTable';
import { NavLink, useHistory } from 'react-router-dom';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import { SetConferences, ConferenceParticipants } from '../../store/Conferences/types';
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification';
import Spinner from '../Spinner/Spinner';
import { SearchUsers } from '../../store/Account/types';
import { uuidv4 } from '../../utils/uuidv4';
import ArrowForwardIosRoundedIcon from '@material-ui/icons/ArrowForwardIosRounded';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import AddUsers from '../AddUsers/AddUsers';
import DeleteIcon from '@material-ui/icons/Delete';
import { randomColor } from '../../utils/randomColor';
import DeleteMobile from '../DeleteMobile/DeleteMobile';
import useClipboard from "react-use-clipboard";
import { CopyIcon } from '../../icons/menuIcons';
import { baseUrl } from '../../utils/baseUrl'

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const NewСonference: React.FC<Props> = (props) => {
    let history = useHistory();
    const { sessionId, userAccountSuccess, conferenceUsers, conferenceSuccessAction, conferenceSuccess, setLoaderAction,
            clearConferenceUsersAction, searchUsersAction, isPublic, publicRoomPassword, isPublicAction, publicRoomPasswordAction } = props;
    const [conferencePublicKey, setConferencePublicKey] = useState('');  

    const conferenceLink = `${baseUrl()}publicConference/#${conferencePublicKey}`;
    const [isCopied, setCopied] = useClipboard(conferenceLink);
    const [showPassword, setShowPassword] = useState(false);
    
    const publiclyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isPublicAction(event.target.checked);
    };

    const showPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShowPassword(event.target.checked);
    };

    const date = new Date();
    let hours = date.getHours();
    let minutes: any = date.getMinutes();
    if (minutes < 10) { 
        minutes = '0' + minutes; 
    } 
    const timeStartDefault = `${hours}:${minutes}`;
    const timeEndDefault = `${hours + 1}:${minutes}`;

    const [notification, setNotification] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
    const [timeStart, setTimeStart] = useState(timeStartDefault);
    const [timeEnd, setTimeEnd] = useState(timeEndDefault);
    // const [repeat, setRepeat] = useState('false');
    const [title, setTitle] = useState('');
    const [conferenceParticipants, setConferenceParticipants] = useState<ConferenceParticipants[]>([]);
    const [messageError, setMessageError] = useState({
        error: false,
        message: ''
    });
    const [deleteOpen, setDeleteOpen] = React.useState(false);
    const [user, setUser] = useState<SearchUsers>({
        userId: 0,
        userName: '',
        phone: '',
        positionName: '',
        departmentName: '',
        done: false,
    })

    const deleteOpenClick = (user: SearchUsers) => {
        setUser(user)
        setDeleteOpen(true);
    };

    const deleteCloseClick = () => {
        setDeleteOpen(false);
    };

    useEffect(() => {
        setConferencePublicKey(uuidv4());
    }, []);

    useEffect(() => {
        const newConferenceUsers:ConferenceParticipants[] = conferenceUsers.map(item => {
            const userId = item.userId;
            const userName = item.userName;
            const isModerator = true;
            return {
                userId,
                userName,
                isModerator
            }
        })
        setConferenceParticipants(newConferenceUsers);
    }, [conferenceUsers]);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    // const isTrueSet = (repeat === 'true');
    let setConferences: SetConferences = {
        conferenceId: 0,
        conferenceName: title,
        status: '',
        timeStart: timeStart,
        timeEnd: timeEnd,
        repeat: false,
        dayForRepeated: [],
        startDate: selectedDate,
        endDate: null,
        isPublic: isPublic,
        conferencePublicKey: conferencePublicKey,
        publicRoomPassword: publicRoomPassword,
        conferenceParticipants: conferenceParticipants,
    }

    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            if(sessionId) {
                AccountAPI.searchUsers(sessionId, '', 0, 0).then(data => {
                  searchUsersAction(data.users);
                  setLoaderAction(false);
                })
            }
        }
    }, [sessionId, searchUsersAction, userAccountSuccess, setLoaderAction])

    const saveConference = () => {
        if(sessionId) {
            ConferencesAPI.setConference(sessionId, setConferences).then(data => {
                if(data.success === true) {
                    conferenceSuccessAction(!conferenceSuccess);
                    setNotification(true);
                    setTimeout(() => {
                        clearConferenceUsersAction();
                        return history.push('/conferences');
                    }, 1000);
                }
            }).catch(({response}) => setMessageError({ error: true, message: 'Заполните это поле'}));
        }
    }

    const clearClick = () => {
        clearConferenceUsersAction();
    }

    const [openDrawer, setOpenDrawer] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const [openCopied, setOpenCopied] = React.useState(false);

    const setCopiedClose = () => {
        setOpenCopied(false);
    };

    const setCopiedOpen = () => {
        setOpenCopied(true);
        setCopied();
    };
    
    return (
        <>
        <Box className="content desktop-conference">
            <Spinner />
            <div className="whiteBg">
                <Box className="newСonference">
                    <Grid container spacing={3} justify="space-between" alignItems="center">
                        <Grid item xs>
                            <FormControl fullWidth className="boxForm searchBox" error={messageError.error}>
                                <InputLabel>Название конференции</InputLabel>
                                <Input
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    autoFocus
                                    endAdornment={
                                        <InputAdornment position="end" className="iconClear">
                                            <IconButton onClick={() => setTitle('')}>
                                                <CloseIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    } />
                                <FormHelperText>{messageError.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item className="maxWidth">
                            <KeyboardDatePicker
                                label="Дата проведения"
                                format="dd.MM.yyyy"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                InputAdornmentProps={{ position: "start" }}
                                className="dateControl"
                            />
                        </Grid>
                        <Grid item className="maxWidth">
                            <Box className="boxTime">
                                <span className="boxTime__title">Время проведения</span>
                                <div className="boxTime__item">
                                    <TextField
                                        className="boxForm"
                                        type="time"
                                        value={timeStart}
                                        onChange={e => setTimeStart(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TimerIcon />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <TextField
                                        className="boxForm"
                                        type="time"
                                        value={timeEnd}
                                        onChange={e => setTimeEnd(e.target.value)}
                                    />
                                </div>
                            </Box>
                        </Grid>
                        {/* <Grid item>
                            <TextField
                                select
                                label="Повторение"
                                value={repeat}
                                onChange={(e) => setRepeat(e.target.value)}
                                className="boxForm repeatWidth"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <RepeatIcon />
                                        </InputAdornment>
                                    ),
                                }}>
                                <MenuItem value={'false'}>Выключено</MenuItem>
                                <MenuItem value={'true'}>Включено</MenuItem>
                            </TextField>
                        </Grid> */}
                    </Grid>
                </Box>
                <SortBox conferencePublicKey={conferencePublicKey}/>
            </div>
            <div className="grayBg newConference">
                {conferenceUsers.length === 0 ?
                    <div className="emptyUsers">Пожалуйста добавьте участников конференции</div>
                    :
                    <PersonalTable />
                }
                <Box className="modalButtonGroup" mt={4}>
                    <NavLink to="/conferences" className="decorationNone" onClick={clearClick}>
                        <Button variant="outlined" color="primary">Отмена</Button>
                    </NavLink>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        disableElevation 
                        onClick={saveConference} 
                        disabled={title !== ''  ? false : true}>Создать конференцию</Button>
                </Box>                    
            </div>
        </Box>
        <div className="mobile-conference">
            <NavLink to="/conferences" className="back" onClick={clearClick}>
                <ArrowBackIosRoundedIcon />
                <span>Назад</span>
            </NavLink>
            <Grid container spacing={3} justify="space-between" alignItems="center">
                <Grid item xs={12}>
                    <FormControl fullWidth className="boxForm searchBox" error={messageError.error}>
                        <InputLabel>Название конференции</InputLabel>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            autoFocus
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setTitle('')}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText>{messageError.message}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <KeyboardDatePicker
                        label="Дата проведения"
                        format="dd.MM.yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        InputAdornmentProps={{ position: "start" }}
                        className="dateControl"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box className="boxTime">
                        <span className="boxTime__title">Время проведения</span>
                        <div className="boxTime__item">
                            <TextField
                                className="boxForm"
                                type="time"
                                value={timeStart}
                                onChange={e => setTimeStart(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TimerIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                className="boxForm"
                                type="time"
                                value={timeEnd}
                                onChange={e => setTimeEnd(e.target.value)}
                            />
                        </div>
                    </Box>
                </Grid>
                <Grid item xs={12} style={{padding: '6px 12px'}}>
                    <div className="mobilePassword">
                        <FormControlLabel
                            className="mobilePassword__item"
                            control={
                            <Checkbox
                                checked={showPassword}
                                onChange={showPasswordChange}
                                color="primary"
                            />
                            }
                            label="Пароль для входа"
                        />
                        {showPassword && 
                            <TextField 
                                placeholder="Пароль" 
                                value={publicRoomPassword} 
                                onChange={(event) => publicRoomPasswordAction(event.target.value)} />
                        }
                    </div>             
                </Grid>
                <Grid item xs={12} style={{padding: '0 12px'}}>
                    <div className="mobilePublic">
                        <Checkbox
                            checked={isPublic}
                            onChange={publiclyChange}
                            color="primary"
                        />
                        {isPublic ? 
                            <ClickAwayListener onClickAway={setCopiedClose}>
                                <div>
                                <Tooltip
                                    PopperProps={{
                                    disablePortal: true,
                                    }}
                                    onClose={setCopiedClose}
                                    open={openCopied}
                                    disableFocusListener
                                    disableHoverListener
                                    disableTouchListener
                                    title={isCopied ? "Скопировано" : "Скопировать"} 
                                    placement="top"
                                >
                                    <span className="publicLink" onClick={setCopiedOpen}>Сcылка <span><CopyIcon /></span></span>
                                </Tooltip>
                                </div>
                            </ClickAwayListener> 
                            : 'Публичная'}
                    </div>    
                </Grid>
            </Grid>
            <List component="nav" className="mobileAddList">
                <ListItem button onClick={handleDrawerOpen}>
                    <ListItemText primary="Добавить участников конференции" />
                    <ListItemIcon><ArrowForwardIosRoundedIcon /></ListItemIcon>
                </ListItem>
            </List>
            <span className="mobileAddListCount">Вы добавили {conferenceUsers.length} участников</span>
            <div className="modileConferenceList">
                {conferenceUsers.length === 0 ?
                    <span className="empty">Для организации конференции <br /> пожалуйста добавьте участников</span>
                    :
                    <List className="usersList">
                        {conferenceUsers.map(user => (
                            <ListItem button alignItems="flex-start" key={'usersList-' + user.userId}>
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
                                <ListItemSecondaryAction>
                                    <DeleteIcon color="secondary" onClick={() => deleteOpenClick(user)} />
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                }
            </div>
            <Button
                className="mobileBtn" 
                variant="contained" 
                color="primary" 
                disableElevation 
                onClick={saveConference} 
                disabled={title !== ''  ? false : true}>Создать конференцию</Button>
        </div>
        <AddUsers openDrawer={openDrawer} handleDrawerClose={handleDrawerClose} />
        <DeleteMobile deleteOpen={deleteOpen} deleteCloseClick={deleteCloseClick} user={user} />
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Вы успешно добавили конференцию!!!"
            severity="success" />       
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    conferenceSuccess: state.conferences.conferenceSuccess,
    userAccountSuccess: state.account.userAccountSuccess,
    conferenceUsers: state.conferences.conferenceUsers,
    isPublic: state.conferences.isPublic,
    publicRoomPassword: state.conferences.publicRoomPassword,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    conferenceSuccessAction: (conferenceSuccess: boolean) => dispatch(actions.conferences.conferenceSuccessAction(conferenceSuccess)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    clearConferenceUsersAction: () => dispatch(actions.conferences.clearConferenceUsersAction()),
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
    isPublicAction: (isPublic: boolean) => dispatch(actions.conferences.isPublicAction(isPublic)),
    publicRoomPasswordAction: (publicRoomPassword: string) => dispatch(actions.conferences.publicRoomPasswordAction(publicRoomPassword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewСonference);