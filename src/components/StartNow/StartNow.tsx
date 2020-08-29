import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, Box, TextField, FormControlLabel, Checkbox, Button, Tooltip, ClickAwayListener } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { VideoIcon, CopyIcon } from '../../icons/menuIcons';
import useClipboard from "react-use-clipboard";
import { baseUrl } from '../../utils/baseUrl';
import './StartNow.scss';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import { uuidv4 } from '../../utils/uuidv4';
import Notification from '../bricks/Notification';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    startNowOpen: boolean;
    startNowToggle: () => void;
}


const StartNow:React.FC<Props> = (props) => {
    const {startNowToggle, startNowOpen, sessionId, conferenceSuccessAction, conferenceSuccess} = props;
    const [notification, setNotification] = React.useState(false);
    const [conferencePublicKey, setConferencePublicKey] = useState('');

    useEffect(() => {
        setConferencePublicKey(uuidv4());
    }, []);

    // const conferenceName = `conference-${Date.now()}`;

    const [conferenceName, setConferenceName] = useState('');

    const [checked, setChecked] = useState(false);
    const [password, setPassword] = useState('');
    const conferenceLink = `${baseUrl()}publicConference/#${conferencePublicKey}`;
    const [isCopied, setCopied] = useClipboard(conferenceLink);

    const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    };

    const checkedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked)
    };

    const isEmpty = checked ? (password === '' ? true : false) : false;
    const isEmptyName = conferenceName === '' ? true : false;

    const startNowClick = () => {
        var windowReference = window.open();
        if(sessionId) {
            ConferencesAPI.createConferenceNow(sessionId, conferenceName, password, conferencePublicKey).then(data => {
                if(data.success === true) {
                    ConferencesAPI.startConference(sessionId, data.id, password).then(data => {
                        if(data.resultType === "Success") {
                            if(windowReference) {
                                windowReference.location = data.conferenceJoinLink;
                            }
                        } else {
                            alert(data.message);
                        }
                    }).catch(({response}) => alert(response.data.message));
                    setNotification(true);
                    startNowToggle();
                    conferenceSuccessAction(!conferenceSuccess);
                }
            });
        }
    }

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
        <Dialog
            open={startNowOpen}
            onClose={startNowToggle}
            className="startNowModal">
            <IconButton className="modalClose" onClick={startNowToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="startNowModal__content">
                <div className="title">Новая конференция</div>
                <Box className="castleIcon">
                    <VideoIcon />
                </Box>
                <form noValidate autoComplete="off">
                    <TextField 
                        fullWidth
                        autoFocus
                        className="startConferenceName"
                        label="Названия конференции" 
                        value={conferenceName}
                        onChange={(e) => setConferenceName(e.target.value)}/>
                    <div className="passwordRow">
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={checked}
                                    onChange={checkedChange}
                                    color="primary"
                                />
                            }
                            label="Пароль для входа"
                        />
                        {checked && 
                            <TextField
                                fullWidth
                                autoFocus
                                value={password} 
                                onChange={passwordChange}
                            />
                        }
                    </div>
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
                                <div className="link" onClick={setCopiedOpen}>
                                    <span className="icon"><CopyIcon /></span><span>Скопировать ссылку на конференцию</span>
                                </div>
                            </Tooltip>
                        </div>
                    </ClickAwayListener>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={startNowToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation disabled={isEmpty || isEmptyName} onClick={startNowClick}>Начать</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Вы успешно добавили конференцию!!!"
            severity="success" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    conferenceSuccess: state.conferences.conferenceSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    conferenceSuccessAction: (conferenceSuccess: boolean) => dispatch(actions.conferences.conferenceSuccessAction(conferenceSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StartNow);