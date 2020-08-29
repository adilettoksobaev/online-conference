import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Box, IconButton } from '@material-ui/core';
import CloseSharpIcon from '@material-ui/icons/CloseSharp';
import './AlertDialog.scss'
import { AccountAPI } from '../../api/AccountAPI';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import { useHistory } from 'react-router-dom';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
  alertOpen: boolean;
  handleAlertToggle: () => void;
  title?: string;
  organizationId?: number;
  userId?: number;
  conferenceId?: number;
  setEditOpen?: (value: React.SetStateAction<boolean>) => void;
}

const AlertDialog:React.FC<Props> = ({ alertOpen, handleAlertToggle, title, sessionId, organizationId, userId, setEditOpen, userAccountSuccessAction, userAccountSuccess, conferenceId }) => {
    let history = useHistory();
    
    const deleteOrganization = () => {
        if(sessionId && organizationId) {
            AccountAPI.deleteOrganization(sessionId, organizationId).then(data => {
                if(data.success) {
                    return history.push('/participants');
                }
            });
        }
    }

    const deleteUser = () => {
        if(sessionId && userId) {
            AccountAPI.deleteUser(sessionId, userId).then(data => {
                if(data.success) {
                    userAccountSuccessAction(!userAccountSuccess);
                    setEditOpen && setEditOpen(false);
                    handleAlertToggle();
                }
            });
        }
    }

    const deleteConference = () => {
        if(sessionId && conferenceId) {
            ConferencesAPI.deleteConference(sessionId, conferenceId).then(data => {
                handleAlertToggle();
                return history.push('/conferences');
            });
        }
    }

    const alertTitle = () => {
        if(organizationId) {
            return 'оргнизации';
        } else if(userId) {
            return 'пользователя';
        } else if(conferenceId) {
            return 'конференции'
        } else {
            return 'должности'
        }
    }

    const alertQuestion = () => {
        if(organizationId) {
            return 'оргнизацию';
        } else if(userId) {
            return 'пользователя';
        } else if(conferenceId) {
            return 'конференцию'
        } else {
            return 'должность'
        }
    }

    const deleteClick = () => {
        if(organizationId) {
            deleteOrganization();
        } else if(userId) {
            deleteUser();
        } else if(conferenceId) {
            deleteConference();
        } else {
            console.log('Удалить должнось')
        }
    }
    
    return (
        <Dialog
            open={alertOpen}
            onClose={handleAlertToggle}
            className="alertDialog">
            <IconButton className="alertDialog__close" onClick={handleAlertToggle}>
            <CloseSharpIcon />
            </IconButton>
            <DialogContent>
            <div className="alertDialog__title">Удаление {alertTitle()}</div>
            <div className="alertDialog__question">Вы уверены, что хотите удалить {alertQuestion()} ?</div>
            <div className="alertDialog__name">{title}</div>
            <Box className="alertDialog__group">
                <Button variant="outlined" color="secondary" onClick={deleteClick}>Удалить</Button>
                <Button variant="outlined" color="primary" onClick={handleAlertToggle}>Отмена</Button>
            </Box>
            </DialogContent>
        </Dialog>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    userAccountSuccess: state.account.userAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    userAccountSuccessAction: (userAccountSuccess: boolean) => dispatch(actions.account.userAccountSuccessAction(userAccountSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertDialog);