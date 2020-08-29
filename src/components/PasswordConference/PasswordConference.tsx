import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, Box, Button, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './PasswordConference.scss'
import { CastleIcon } from '../../icons/menuIcons';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import CountDown from '../CountDown/CountDown';
import { StartConferenceType } from '../../store/Conferences/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    loginOpen: boolean;
    handleLoginToggle: () => void;
    conferenceId: number;
}
  
  const PasswordConference:React.FC<Props> = ({ loginOpen, handleLoginToggle, conferenceId, sessionId, startConferenceAction }) => {
      const [password, setPassword] = useState('');
      const [passwordError, setPasswordError] = useState({
        error: false,
        message: ''
      });

      const passwordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
      };

      const isEmpty = password === '' ? true : false;
      const loginClick = () => {
        var windowReference = window.open();
        if(sessionId) {
          ConferencesAPI.startConference(sessionId, conferenceId, password).then(data => {
            if(data.resultType === "InvalidPassword") {
              return setPasswordError({ error: true, message: data.message});
            }
            setPasswordError({ error: false, message: '' });

            if(data.resultType === "Success") {
                if(windowReference) {
                    windowReference.location = data.conferenceJoinLink;
                }
                setPasswordError(prevState => ({...prevState, error: false, message: ''}));
                setPassword('');
                handleLoginToggle();
            } else if(data.resultType === "ConferenceHasNotYetStarted") {
                const payload = {
                    resultType: data.resultType,
                    secondsToStart: data.secondsToStart,
                    conferenceId: conferenceId,
                    password: password,
                }
                startConferenceAction(payload);
                return (<CountDown />)
            }
            else {
                alert(data.message)
            }

          }).catch(({response}) => setPasswordError({ error: true, message: response.data.message}));
        }
      }

    return (
      <Dialog
          open={loginOpen}
          onClose={handleLoginToggle}
          className="loginModal">
          <IconButton className="modalClose" onClick={handleLoginToggle}>
            <CloseIcon />
          </IconButton>
          <DialogContent className="loginModal__content">
                <div className="title">Вход в конференцию</div>
                <Box className="castleIcon">
                  <CastleIcon />
                </Box>
                <form noValidate autoComplete="off">
                  <div className="passwordRow">
                    <TextField
                      fullWidth
                      autoFocus
                      label="Введите пароль"
                      error={passwordError.error}
                      helperText={passwordError.message}
                      value={password} 
                      onChange={passwordChange}
                    />
                  </div>
                  <Box className="modalButtonGroup">
                      <Button variant="outlined" color="primary" onClick={handleLoginToggle}>Отмена</Button>
                      <Button variant="contained" color="primary" disableElevation disabled={isEmpty} onClick={loginClick}>Войти</Button>
                  </Box>
                </form>
          </DialogContent>
      </Dialog>
    );
  }
  
const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    userName: state.auth.userName
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    startConferenceAction: (payload: StartConferenceType) => dispatch(actions.conferences.startConferenceAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PasswordConference)