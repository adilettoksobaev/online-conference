import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Dialog, IconButton, DialogContent, FormControl, InputLabel, Select, MenuItem, Box, Button, Input, InputAdornment, FormHelperText, FormControlLabel, Checkbox } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './AddStaff.scss';
import PositionsModal from '../PositionsModal/PositionsModal';
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification';
import { Role, UserAccount } from '../../store/Account/types';
import InputPhoneFormated from '../bricks/InputPhoneFormated';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    addOpen: boolean;
    handleAddToggle: () => void;
    organizationId: number;
    departmentId: number;
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

const AddStaff:React.FC<Props> = (props) => {
    const { addOpen, handleAddToggle, sessionId, position, userAccountSuccessAction, userAccountSuccess, organizationId, departmentId } = props;
    const initialUserAccount = {
        userId: 0,
        userAccountId: 0,
        userName: '',
        userInn: '',
        phone: '',
        email: '',
        role: Role.User,
        organizationId: organizationId,
        positionId: 0,
        departmentId: departmentId,
        accessToCreateConferences: false,
        password: ''
    };
    const [positionOpen, setPositionOpen] = useState(false);
    const [notification, setNotification] = useState(false);
    const [message, setMessage] = useState(initialMessage);
    const [userAccount, setUserAccount] = React.useState<UserAccount>(initialUserAccount);

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAccount({ ...userAccount, accessToCreateConferences: event.target.checked });
    };

    const positionToggle = () => {
        setPositionOpen(!positionOpen);
    }

    const textChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setUserAccount({ ...userAccount, [prop]: event.target.value });
    };
    const selectChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<{ value: unknown }>) => {
        setUserAccount({ ...userAccount, [prop]: event.target.value as number });
    };
    const roleChange = (prop: keyof UserAccount) => (event: React.ChangeEvent<{ value: unknown }>) => {
        setUserAccount({ ...userAccount, [prop]: event.target.value as string });
    };

    const onPhoneChanged = (phone: string) => {
        setUserAccount({ ...userAccount, phone });
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

        if ( userName || phone || role || positionId) {
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
                    userAccountSuccessAction(!userAccountSuccess)
                    setNotification(true);
                    handleAddToggle();
                }
            })
        }
    }

    const clearFormClick = () => {
        setUserAccount(initialUserAccount);
        setMessage(initialMessage);
        handleAddToggle();
    }

    // const lastItem = position[position.length - 1];

    // console.log(lastItem);

    return (
        <>
        <Dialog open={addOpen} className="addStaffModal" fullWidth scroll="body">
            <IconButton className="modalClose" onClick={handleAddToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="addStaffModal__content">
                <div className="addStaffModal__title">Новый</div>
                <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth required error={message.userName.error}>
                        <InputLabel shrink>Фамилия Имя Отчество</InputLabel>
                        <Input
                            value={userAccount.userName}
                            onChange={textChange('userName')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setUserAccount(prevState => ({ ...prevState, userName: "" }))}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                            <FormHelperText>{message.userName.text}</FormHelperText>
                    </FormControl>
                    {/* <PhoneFormatted 
                        onPhoneChange={(e) => onPhoneChanged(e)} 
                        message={message.phone.text} 
                        error={message.phone.error} /> */}
                    <InputPhoneFormated 
                        label="Телефон"
                        value={userAccount.phone}
                        onPhoneChange={(newState) => onPhoneChanged(newState.value)}
                        fullWidth />
                    <FormControl fullWidth>
                        <InputLabel shrink>Введите пароль для входа</InputLabel>
                        <Input
                            value={userAccount.password}
                            onChange={textChange('password')}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setUserAccount(prevState => ({ ...prevState, password: "" }))}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel shrink>E-mail</InputLabel>
                        <Input
                            value={userAccount.email}
                            onChange={textChange('email')}
                            type="email"
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setUserAccount(prevState => ({ ...prevState, email: "" }))}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                    </FormControl>
                    <div className="addStaffModal__subTitle">Должности</div>
                    <div className="addStaffModal__h3">Должность №1</div>
                    <FormControl fullWidth required error={message.role.error}>
                        <InputLabel shrink>Права доступа</InputLabel>
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
                        <InputLabel shrink>Организация</InputLabel>
                        <Select
                            value={userAccount.organizationId}
                            onChange={selectChange('organizationId')}>
                            {organization.map(item => (
                                <MenuItem key={item.organizationId} value={item.organizationId}>{item.organizationName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    {/* <FormControl fullWidth>
                        <InputLabel shrink>Подразделение</InputLabel>
                        <Select
                            value={userAccount.departmentId}
                            onChange={selectChange('departmentId')}>
                            {department.map(item => (
                                <MenuItem key={item.departmentId} value={item.departmentId}>{item.departmentName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl> */}
                    <FormControl fullWidth required error={message.positionId.error}>
                        <InputLabel shrink>Должность</InputLabel>
                        <Select
                            value={userAccount.positionId}
                            onChange={selectChange('positionId')}>
                            <MenuItem value="" className="addNewPosition">
                                <Button 
                                    color="primary"
                                    startIcon={<AddCircleOutlineIcon />}
                                    className="addStaffModalLink"
                                    onClick={positionToggle}>Добавить новую должность</Button>
                            </MenuItem>
                            {position.map((item) => (
                                <MenuItem key={item.positionId} value={item.positionId}>{item.positionName}</MenuItem>
                            )).reverse()}
                        </Select>
                        <FormHelperText>{message.positionId.text}</FormHelperText>
                    </FormControl>
                    <Button 
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        className="addStaffModalLink"
                        onClick={positionToggle}>Добавить новую должность</Button>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={clearFormClick}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveUserAccount}>Сохранить</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <PositionsModal 
            positionOpen={positionOpen}
            positionToggle={positionToggle}
            organizationId={userAccount.organizationId as number} />
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Вы успешно добавили пользователя!!!"
            severity="success" />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    organization: state.account.organization,
    department: state.account.department,
    position: state.account.position,
    userAccountSuccess: state.account.userAccountSuccess
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    userAccountSuccessAction: (userAccountSuccess: boolean) => dispatch(actions.account.userAccountSuccessAction(userAccountSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddStaff)