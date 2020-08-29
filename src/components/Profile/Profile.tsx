import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import './Profile.scss'
import { randomColor } from '../../utils/randomColor';
import { UserAccount } from '../../store/Account/types';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Avatar, Box, FormControl, InputLabel, Button, InputAdornment, Input, Grid, FormHelperText, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import PhoneFormatted from '../bricks/PhoneFormatted';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import Notification from '../bricks/Notification';
import { ProfileAPI } from '../../api/ProfileAPI';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const initialError = {
    text: '',
    error: false,
};

const initialMessage = {
    userName: initialError,
    phone: initialError,
};

const Profile:React.FC<Props> = (props) => {
    const { sessionId, userAccountSuccessAction, userAccountSuccess } = props;
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [editBoolean, setEditBoolean] = useState(false);
    const [userAccount, setUserAccount] = useState({
        userId: 0,
        userName: '',
        phone: '',
        email: '',
        organizationName: '',
        positionName: '',
        departmentName: '',
        accessToCreateConferences: true
    });
    const [password, setPassword] = useState<string | null>(null);

    const textChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAccount({ ...userAccount, [prop]: event.target.value });
    };

    const handleEditClose = () => {
        setMessage(initialMessage);
    }

    const onPhoneChanged = (phone: string) => {
        setUserAccount({ ...userAccount, phone });
    }

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAccount({ ...userAccount, accessToCreateConferences: event.target.checked });
    };

    const editPenClick = () => {
        setEditBoolean(!editBoolean);
    }

    const cancelClick = () => {
        handleEditClose();
        setEditBoolean(false);
    }

    const validate = () => {
        let userName = initialError;
        let phone = initialError;

        if(!userAccount.userName) {
            userName = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }
        if(!userAccount.phone) {
            phone = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }

        if (userName || phone) {
            setMessage({ ...message, userName, phone });
            return false;
        }

        return true;
    
    };

    useEffect(() => {
        if(sessionId) {
            ProfileAPI.getUserProfile(sessionId).then(data => {
                setUserAccount(data);
            })
        }
    }, [sessionId]);

    const saveUserAccount = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const isValid = validate();
        if(isValid) {
            setMessage(initialMessage);
        }

        if(sessionId) {
            ProfileAPI.setUserProfile(sessionId, userAccount.userName, userAccount.phone, userAccount.email, password).then(res => {
                if(res.status === 200) {
                    userAccountSuccessAction(!userAccountSuccess);
                    setNotification(true);
                    setEditBoolean(false);
                }
            });
        }
    }

    return (
        <div className="profile">
            <div className="title">Профиль</div>
            <Avatar alt={userAccount.userName} src="/broken-image.jpg" className="profile__avatar" style={{backgroundColor: randomColor()}}>
                {userAccount.userName.substr(0, 1)}
            </Avatar>
            <Box className="profile__row">
                <div className="profile__title">{userAccount.userName}</div>
                <EditSharpIcon onClick={editPenClick} />
            </Box>
            <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth required disabled={!editBoolean} error={message.userName.error}>
                        <InputLabel>Фамилия Имя Отчество</InputLabel>
                        <Input
                            value={userAccount.userName}
                            onChange={textChange('userName')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => setUserAccount({ ...userAccount, userName: "" })}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                </InputAdornment>
                            }/>
                        <FormHelperText>{message.userName.text}</FormHelperText>
                    </FormControl>
                    <PhoneFormatted 
                        onPhoneChange={(e) => onPhoneChanged(e)} 
                        message={message.phone.text} 
                        error={message.phone.error} 
                        value={userAccount.phone} 
                        editBoolean={editBoolean}/>
                    <FormControl fullWidth disabled={!editBoolean}>
                        <InputLabel shrink>Введите пароль для входа</InputLabel>
                        <Input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => setPassword('')}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                </InputAdornment>
                            } />
                    </FormControl>
                    <FormControl fullWidth disabled={!editBoolean}>
                        <InputLabel>E-mail</InputLabel>
                        <Input
                            value={userAccount.email}
                            onChange={textChange('email')}
                            type="email"
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => setUserAccount({ ...userAccount, email: '' })}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                </InputAdornment>
                            } />
                    </FormControl>
                    <div className="addStaffModal__subTitle" style={editBoolean ? {opacity: '1'} : {opacity: '0.6'}}>Должности</div>
                    <Grid container justify="space-between" alignItems="center">
                        <Grid item>
                            <div className="addStaffModal__h3" style={editBoolean ? {opacity: '1'} : {opacity: '0.6'}}>Должность №1</div>            
                        </Grid>
                    </Grid>
                    <TextField 
                        fullWidth
                        disabled
                        multiline
                        label="Организация" 
                        value={userAccount.organizationName}
                        />
                    <TextField 
                        fullWidth
                        disabled
                        multiline
                        label="Подразделение" 
                        value={userAccount.organizationName}
                        />
                    <TextField 
                        fullWidth
                        disabled
                        multiline
                        label="Должность" 
                        value={userAccount.positionName}
                        />
                    <FormControlLabel
                        disabled={true}
                        className="checkbox"
                        control={
                            <Checkbox
                                checked={userAccount.accessToCreateConferences}
                                onChange={checkedChange}
                                color="primary"
                            />
                        }
                        label="Может организовывать конференции"
                    />
                    <Box className="modalButtonGroup">
                        {editBoolean && 
                            <>
                                <Button variant="outlined" color="primary" onClick={cancelClick}>Отмена</Button>
                                <Button variant="contained" color="primary" disableElevation onClick={saveUserAccount}>Сохранить</Button>
                            </>
                        }
                    </Box>
                </form>
                <Notification 
                    notification={notification} 
                    setNotification={setNotification}
                    message="Редактирование прошло успешно!!!"
                    severity="success" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    userAccountSuccess: state.account.userAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    userAccountSuccessAction: (userAccountSuccess: boolean) => dispatch(actions.account.userAccountSuccessAction(userAccountSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);