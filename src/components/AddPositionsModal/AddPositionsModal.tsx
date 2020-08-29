import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, FormControl, InputLabel, Input, Box, Button, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './AddPositionsModal.scss'
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification';

type Props =  ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    addPosition: boolean;
    addPositionToggle: () => void;
    organizationId: number;
}

const AddPositionsModal: React.FC<Props> = (props) => {
    const { addPosition, addPositionToggle, sessionId, organizationId, positionSuccessAction, positionSuccess } = props;
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [notification, setNotification] = React.useState(false);

    const savePosition = () => {
        if(value.length <= 3) {
            return setError(true);
        }
        if(sessionId) {
            AccountAPI.setPosition(sessionId, value, organizationId ).then(data => {
                if(data.success === true) {
                    positionSuccessAction(!positionSuccess);
                    setNotification(true);
                    addPositionToggle();
                }
            });
        }
    }

    return (
        <>
        <Dialog open={addPosition} onClose={addPositionToggle} className="addPositionModal" fullWidth>
            <IconButton className="modalClose" onClick={addPositionToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="addPositionModal__content">
                <div className="addPositionModal__title">Добавить новую должность</div>
                <form className="boxForm" noValidate autoComplete="off">
                    <FormControl fullWidth error={error}>
                        <InputLabel>Наименование должности</InputLabel>
                        <Input
                            value={value}
                            onChange={e => setValue(e.target.value)} />
                        <FormHelperText>{error ? 'Количество не меньше трех символов' : ''}</FormHelperText>
                    </FormControl>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary">Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={savePosition}>Сохранить</Button>
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Вы успешно добавили новую должность!!!"
            severity="success" />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    organization: state.account.organization,
    position: state.account.position,
    sessionId: state.auth.sessionId,
    positionSuccess: state.account.positionSuccess
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    positionSuccessAction: (positionSuccess: boolean) => dispatch(actions.account.positionSuccessAction(positionSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddPositionsModal);