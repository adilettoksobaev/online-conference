import React, { useState } from 'react';
import './PublicConference.scss';
import { FormControl, InputLabel, Input, Box, Button, FormHelperText } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { ConferencesAPI } from '../../api/ConferencesAPI';

const PublicConference = () => {
    let location = useLocation();
    const conferenceKey = location.hash.slice(1);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState({
        error: false,
        message: ''
    });

    const enterClick = () => {
        ConferencesAPI.startPublicConference(conferenceKey, userName, password).then(data => {
            if(data.resultType === "InvalidPassword") {
                return setPasswordError({ error: true, message: data.message});
            }
            setPasswordError({ error: false, message: '' });

            if(data.resultType === "Success") {
                window.location.assign(data.conferenceJoinLink); 
            } else {
                alert(data.message)
            }
        })
    }

    return (
        <div className="publicConference">
            <div className="publicConference__content">
                <div className="title">Вход в конференцию</div>
                {/* <div className="conferenceTitle">Сотрудничество в сфере аграрного сельхозпроизводства Республики Ка...</div> */}
                <FormControl fullWidth>
                    <InputLabel shrink>Введите ваше имя</InputLabel>
                    <Input
                        autoFocus
                        value={userName}
                        onChange={e => setUserName(e.target.value)} />
                </FormControl>
                <FormControl fullWidth error={passwordError.error}>
                    <InputLabel shrink>Введите пароль</InputLabel>
                    <Input
                        value={password}
                        onChange={e => setPassword(e.target.value)} />
                    <FormHelperText>{passwordError.message}</FormHelperText>
                </FormControl>
                <Box className="modalButtonGroup">
                    <Button variant="contained" color="primary" disableElevation onClick={enterClick}>Войти</Button>
                </Box>
            </div>
        </div>
    );
}

export default PublicConference;