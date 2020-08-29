import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import './StaffModal.scss'
import { IconButton, Avatar, Box, FormControl, InputLabel, Select, MenuItem, Button, InputAdornment, Input, Grid, FormHelperText, FormControlLabel, Checkbox } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import AlertDialog from '../AlertDialog/AlertDialog';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import PositionsModal from '../PositionsModal/PositionsModal';
import { UserAccount } from '../../store/Account/types';
import Notification from '../bricks/Notification';
import { AccountAPI } from '../../api/AccountAPI';
import { randomColor } from '../../utils/randomColor';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    editOpen: boolean;
    setEditOpen: (value: React.SetStateAction<boolean>) => void
}

const initialError = {
    text: '',
    error: false,
};

const initialMessage = {
    userInn: initialError,
    userName: initialError,
    phone: initialError,
    email: initialError,
    role: initialError,
    positionId: initialError,
};

const StaffModal:React.FC<Props> = (props) => {
    const { editOpen, setEditOpen, position, sessionId, userAccountSuccessAction, userAccountSuccess, getUserAccountAction, userAccount } = props;
    const [alertOpen, setAlertOpen] = useState(false);
    const [positionOpen, setPositionOpen] = useState(false);
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [editBoolean, setEditBoolean] = useState(false);

    const positionToggle = () => {
        setPositionOpen(!positionOpen);
    }

    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
    };

    const textChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<HTMLInputElement>) => {
        getUserAccountAction({ ...userAccount, [prop]: event.target.value });
    };
    const selectChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<{ value: unknown }>) => {
        getUserAccountAction({ ...userAccount, [prop]: event.target.value as number });
    };
    const roleChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<{ value: unknown }>) => {
        getUserAccountAction({ ...userAccount, [prop]: event.target.value as string });
    };

    const handleEditClose = () => {
        setEditOpen(false);
        setMessage(initialMessage);
    }

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        getUserAccountAction({ ...userAccount, accessToCreateConferences: event.target.checked });
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
        let role = initialError;
        let positionId = initialError;

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
        if(!userAccount.role) {
            role = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }
        if(!userAccount.positionId) {
            positionId = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }

        if (userName || phone || role || positionId) {
            setMessage({ ...message, userName, phone, role, positionId });
            return false;
        }

        return true;
    
    };

    const saveUserAccount = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const isValid = validate();
        if(isValid) {
            setMessage(initialMessage);
        }

        if(sessionId) {
            AccountAPI.setUserAccount(sessionId, userAccount).then(res => {
                if(res.status === 200) {
                    userAccountSuccessAction(!userAccountSuccess);
                    setNotification(true);
                    setEditOpen(false);
                    setEditBoolean(false);
                }
            })
        }
    }
    
    return (
        <>
        <Dialog open={editOpen} className="staffModal" fullWidth scroll="body">
            <IconButton className="modalClose" onClick={cancelClick}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="staffModal__content">
                <div className="staffModal__info">
                    <Avatar alt={userAccount.userName} src="/broken-image.jpg" className="staffModal__avatar" style={{backgroundColor: randomColor()}}>
                        {userAccount.userName.substr(0, 1)}
                    </Avatar>
                    <Box className="staffModal__row">
                        <div className="staffModal__title">{userAccount.userName}</div>
                        <EditSharpIcon onClick={editPenClick} />
                    </Box>
                </div>
                <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth required disabled={!editBoolean} error={message.userName.error}>
                        <InputLabel>Фамилия Имя Отчество</InputLabel>
                        <Input
                            value={userAccount.userName}
                            onChange={textChange('userName')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => getUserAccountAction({ ...userAccount, userName: "" })}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                </InputAdornment>
                            }/>
                        <FormHelperText>{message.userName.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth disabled={!editBoolean}>
                        <InputLabel shrink>Телефон</InputLabel>
                        <Input
                            value={userAccount.phone}
                            onChange={textChange('phone')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => getUserAccountAction({ ...userAccount, phone: "" })}>
                                            <CloseIcon />
                                        </IconButton>
                                    }
                                </InputAdornment>
                            } />
                    </FormControl>
                    <FormControl fullWidth disabled={!editBoolean}>
                        <InputLabel shrink>Введите пароль для входа</InputLabel>
                        <Input
                            value={userAccount.password}
                            onChange={textChange('password')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    {editBoolean &&
                                        <IconButton onClick={() => getUserAccountAction({ ...userAccount, password: "" })}>
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
                                        <IconButton onClick={() => getUserAccountAction({ ...userAccount, email: "" })}>
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
                        {/* <Grid item>
                            <Button variant="outlined" color="secondary" className="staffModal__btn">Удалить</Button>           
                        </Grid> */}
                    </Grid>
                    <FormControl fullWidth required error={message.role.error} disabled={!editBoolean}>
                        <InputLabel>Права доступа</InputLabel>
                        <Select
                            value={userAccount.role}
                            onChange={roleChange('role')}>
                            <MenuItem value="User">Пользователь</MenuItem>
                            <MenuItem value="SuperAdmin">Суперадминистратор</MenuItem>
                            <MenuItem value="Admin">Админ</MenuItem>
                            <MenuItem value="ConferenceManager">Менеджер конференции</MenuItem>
                        </Select>
                        <FormHelperText>{message.role.text}</FormHelperText>
                    </FormControl>
                    <FormControlLabel
                        disabled={!editBoolean}
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
                    {/* <FormControl fullWidth required disabled>
                        <InputLabel>Организация</InputLabel>
                        <Select
                            value={userAccount.organizationId}
                            onChange={selectChange('organizationId')}>
                            {organization.map(item => (
                                <MenuItem key={item.organizationId} value={item.organizationId}>{item.organizationName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    {/* <FormControl fullWidth disabled={!editBoolean}>
                        <InputLabel>Подразделение</InputLabel>
                        <Select
                            value={userAccount.departmentId}
                            onChange={selectChange('departmentId')}>
                            {department.map(item => (
                                <MenuItem key={item.departmentId} value={item.departmentId}>{item.departmentName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    <FormControl fullWidth required error={message.positionId.error} disabled={!editBoolean}>
                        <InputLabel>Должность</InputLabel>
                        <Select
                            value={userAccount.positionId}
                            onChange={selectChange('positionId')}>
                            {position.map(item => (
                                <MenuItem key={item.positionId} value={item.positionId}>{item.positionName}</MenuItem>
                            )).reverse()}
                        </Select>
                        <FormHelperText>{message.positionId.text}</FormHelperText>
                    </FormControl>
                    {editBoolean && 
                        <Button 
                            color="primary"
                            startIcon={<AddCircleOutlineIcon />}
                            className="staffModalLink"
                            onClick={positionToggle}>Добавить новую должность</Button>
                    }
                    <Box className="modalButtonGroup">
                        {editBoolean ? 
                            <>
                                <Button variant="outlined" color="secondary" className="staffModal__btn" onClick={handleAlertToggle}>Удалить</Button>
                                <Button variant="outlined" color="primary" onClick={cancelClick}>Отмена</Button>
                                <Button variant="contained" color="primary" disableElevation onClick={saveUserAccount}>Сохранить</Button>
                            </>
                            :
                            <Button variant="outlined" color="primary" onClick={cancelClick}>Закрыть</Button>
                        }
                    </Box>
                </form>
            </DialogContent>
            <PositionsModal 
                positionOpen={positionOpen}
                positionToggle={positionToggle}
                organizationId={userAccount.organizationId as number} />
            <AlertDialog 
                alertOpen={alertOpen}
                handleAlertToggle={handleAlertToggle} 
                title={userAccount.userName}
                userId={userAccount.userId} 
                setEditOpen={setEditOpen} />
        </Dialog>
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Редактирование прошло успешно!!!"
            severity="success" />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    organization: state.account.organization,
    department: state.account.department,
    position: state.account.position,
    sessionId: state.auth.sessionId,
    userAccountSuccess: state.account.userAccountSuccess,
    userAccount: state.account.userAccount
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    userAccountSuccessAction: (userAccountSuccess: boolean) => dispatch(actions.account.userAccountSuccessAction(userAccountSuccess)),
    getUserAccountAction: (userAccount: UserAccount) => dispatch(actions.account.getUserAccountAction(userAccount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StaffModal);