import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, IconButton, FormControl, InputLabel, Input, InputAdornment, Box, FormHelperText, Select, MenuItem } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification'
import { Cities } from '../../store/Account/types';
import AlertDialog from '../AlertDialog/AlertDialog';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    editOrganization: boolean;
    editOrganizationToggle: () => void;
    organizationId: number;
}

const initialError = {
    text: '',
    error: false,
};

const initialMessage = {
    value: initialError,
    conferenceServerDomain: initialError
};

const EditOrganizationModal:React.FC<Props> = (props) => {
    const { editOrganization, editOrganizationToggle, sessionId, organization, organizationSuccessAction, organizationSuccess, cities, organizationId, getCitiesAction } = props;
    const [value, setValue] = useState('');
    const [notification, setNotification] = useState(false);
    const [city, setCity] = useState(1);
    const [conferenceServerDomain, setConferenceServerDomain] = useState('https://');
    const [conferenceServerKey, setСonferenceServerKey] = useState('');
    const [message, setMessage] = useState(initialMessage);
    const [alertOpen, setAlertOpen] = useState(false);

    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
    };

    useEffect(() => {
        const intitialVlaue = organization.filter(item => item.organizationId === organizationId);
        setValue(intitialVlaue[0]?.organizationName);
        setCity(intitialVlaue[0]?.cityId);
        setConferenceServerDomain(intitialVlaue[0]?.conferenceServerDomain);
        setСonferenceServerKey(intitialVlaue[0]?.conferenceServerKey);
    }, [organization, organizationId]);

    useEffect(() => {
        if(sessionId) {
            AccountAPI.getCities(sessionId).then(data => {
                getCitiesAction(data);
            });
        }
    }, [sessionId, getCitiesAction]);

    const cityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCity(event.target.value as number);
    };

    const validate = () => {
        let valueError = initialError;
        let conferenceServerDomainError = initialError;
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

        if ( valueError || conferenceServerDomainError) {
            setMessage({ ...message, value: valueError, conferenceServerDomain: conferenceServerDomainError });
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
            AccountAPI.setOrganization(sessionId, organizationId, value, city, conferenceServerDomain, conferenceServerKey).then(data => {
                if(data.success === true) {
                    organizationSuccessAction(!organizationSuccess);
                    setNotification(true);
                    editOrganizationToggle();
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
                open={editOrganization}
                onClose={editOrganizationToggle}
                fullWidth
                className="addOrganizationModal">
                <IconButton className="modalClose" onClick={editOrganizationToggle}>
                    <CloseIcon />
                </IconButton>
                <DialogContent className="addOrganizationModal__content">
                    <div className="addOrganizationModal__title">Редактировать организацию</div>
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
                    <FormControl fullWidth>
                        <InputLabel>Для замены ключа впишите его</InputLabel>
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
                    </FormControl>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="secondary" className="staffModal__btn" onClick={handleAlertToggle}>Удалить</Button>
                        <Button variant="outlined" color="primary" onClick={editOrganizationToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveOrganization}>Сохранить</Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Notification 
                notification={notification} 
                setNotification={setNotification}
                message="Вы успешно обновили организацию!!!"
                severity="success" />
            <AlertDialog 
                alertOpen={alertOpen}
                handleAlertToggle={handleAlertToggle} 
                title={value}
                organizationId={organizationId} />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    organizationSuccess: state.account.organizationSuccess,
    cities: state.account.cities,
    organization: state.account.organization,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    organizationSuccessAction: (organizationSuccess: boolean) => dispatch(actions.account.organizationSuccessAction(organizationSuccess)),
    getCitiesAction: (cities: Cities[]) => dispatch(actions.account.getCitiesAction(cities)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditOrganizationModal)