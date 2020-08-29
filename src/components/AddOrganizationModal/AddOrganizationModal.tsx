import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, IconButton, FormControl, InputLabel, Input, InputAdornment, Box, FormHelperText, Select, MenuItem } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './AddOrganizationModal.scss'
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification'

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    addOrganization: boolean;
    addMemberToggle: () => void;
}

const initialError = {
    text: '',
    error: false,
};

const initialMessage = {
    value: initialError,
    conferenceServerDomain: initialError,
    conferenceServerKey: initialError,
};

const AddUnitModal:React.FC<Props> = (props) => {
    const { addOrganization, addMemberToggle, sessionId, organizationSuccessAction, organizationSuccess, cities } = props;
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [city, setCity] = useState(1);
    const [conferenceServerDomain, setConferenceServerDomain] = useState('https://');
    const [conferenceServerKey, setСonferenceServerKey] = useState('');
    const [message, setMessage] = useState(initialMessage);

    const cityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCity(event.target.value as number);
    };

    const validate = () => {
        let valueError = initialError;
        let conferenceServerDomainError = initialError;
        let conferenceServerKeyError = initialError;
        if(!value) {
            valueError = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }
        if(!conferenceServerDomain) {
            conferenceServerDomainError = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }
        if(!conferenceServerKey) {
            conferenceServerKeyError = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }

        if ( valueError || conferenceServerDomainError || conferenceServerKeyError) {
            setMessage({ ...message, value: valueError, conferenceServerDomain: conferenceServerDomainError, conferenceServerKey: conferenceServerKeyError });
            return false;
        }
        return true;
    };

    const saveOrganization = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const isValid = validate();
        if(isValid) {
            setMessage(initialMessage);
        }

        if(sessionId) {
            AccountAPI.setOrganization(sessionId, 0, value, city, conferenceServerDomain, conferenceServerKey).then(data => {
                if(data.success === true) {
                    organizationSuccessAction(!organizationSuccess);
                    setNotification(true);
                    addMemberToggle();
                    setValue('');
                    setCity(1);
                    setConferenceServerDomain('https://');
                    setСonferenceServerKey('');
                }
            })
        }
    }

    return (
        <>
            <Dialog
                open={addOrganization}
                onClose={addMemberToggle}
                fullWidth
                className="addOrganizationModal">
                <IconButton className="modalClose" onClick={addMemberToggle}>
                    <CloseIcon />
                </IconButton>
                <DialogContent className="addOrganizationModal__content">
                    <div className="addOrganizationModal__title">Добавление организации</div>
                    <FormControl fullWidth required error={message.value.error}>
                        <InputLabel>Наименование организации</InputLabel>
                        <Input
                            value={value}
                            autoFocus
                            onChange={e => setValue(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText>{message.value.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel shrink>Выберите город</InputLabel>
                        <Select
                            value={city}
                            onChange={cityChange}>
                            {cities.map(item => (
                                <MenuItem key={item.cityId} value={item.cityId}>{item.cityName}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required error={message.conferenceServerDomain.error}>
                        <InputLabel>Адрес сервера для проведения конференций</InputLabel>
                        <Input
                            value={conferenceServerDomain}
                            onChange={e => setConferenceServerDomain(e.target.value)}
                            placeholder="https://"
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                            <FormHelperText>{message.conferenceServerDomain.text}</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth required error={message.conferenceServerKey.error}>
                        <InputLabel>Ключ</InputLabel>
                        <Input
                            value={conferenceServerKey}
                            onChange={e => setСonferenceServerKey(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                            <FormHelperText>{message.conferenceServerKey.text}</FormHelperText>
                    </FormControl>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={addMemberToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveOrganization}>Создать</Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Notification 
                notification={notification} 
                setNotification={setNotification}
                message="Вы успешно добавили организацию!!!"
                severity="success" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    organizationSuccess: state.account.organizationSuccess,
    cities: state.account.cities,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    organizationSuccessAction: (organizationSuccess: boolean) => dispatch(actions.account.organizationSuccessAction(organizationSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddUnitModal)