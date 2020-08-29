import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { IconButton, DialogContent, Dialog, FormControl, Input, InputAdornment, Box, Button, InputLabel, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import './PositionsModal.scss'
import AlertDialog from '../AlertDialog/AlertDialog';
import { Position } from '../../store/Account/types';
import Notification from '../bricks/Notification';
import { AccountAPI } from '../../api/AccountAPI';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    positionOpen: boolean;
    positionToggle: () => void;
    organizationId: number;
}

const PositionsModal: React.FC<Props> = ({ positionOpen, positionToggle, position, organizationId, positionSuccess, sessionId, positionSuccessAction }) => {
    const [addPosition, setAddPosition] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [value, setValue] = useState('');
    const [allPosition, setAllPosition] = useState<Position[]>([
        {
            positionId: 0,
            positionName: '',
            organizationId: 0
        }
    ]);
    const [messageError, setMessageError] = useState({
        error: false,
        message: ''
    });

    const handleAlertToggle = () => {
        setAlertOpen(!alertOpen);
    };

    const addPositionToggle = () => {
        setAddPosition(!addPosition);
    }
    
    useEffect(() => {
        setAllPosition(position);
    }, [setAllPosition, position]);

    const [notification, setNotification] = React.useState(false);

    const savePosition = () => {
        if(sessionId) {
            AccountAPI.setPosition(sessionId, value, organizationId ).then(data => {
                if(data.success === true) {
                    positionSuccessAction(!positionSuccess);
                    setNotification(true);
                    addPositionToggle();
                    setValue('');
                }
            }).catch(({response}) => setMessageError({ error: true, message: 'Заполните это поле'}));
        }
    }
    
    return (
        <>
        <Dialog open={positionOpen} onClose={positionToggle} className="positionModal" fullWidth>
            <IconButton className="modalClose" onClick={positionToggle}>
                <CloseIcon />
            </IconButton>
            <DialogContent className="positionModal__content">
                <div className="positionModal__title">Должности</div>
                <form className="boxForm" noValidate autoComplete="off">
                    {allPosition.map(item => (
                        <FormControl fullWidth key={item.positionId}>
                            <Input
                                placeholder="Наименование должности"
                                value={item.positionName}
                                endAdornment={
                                    <InputAdornment position="end" className="delete">
                                        <span onClick={handleAlertToggle}>Удалить</span>
                                    </InputAdornment>
                                } />
                        </FormControl>
                    ))}
                    {addPosition && 
                        <FormControl fullWidth error={messageError.error}>
                            <InputLabel shrink>Новая должность</InputLabel>
                            <Input
                                value={value}
                                onChange={(event) => setValue(event.target.value)}
                                autoFocus
                                endAdornment={
                                    <InputAdornment position="end" className="iconClear">
                                        <IconButton onClick={() => setValue('')}>
                                            <CloseIcon />
                                        </IconButton>
                                    </InputAdornment>
                                } />
                            <FormHelperText>{messageError.message}</FormHelperText>
                        </FormControl>
                    }
                    <Button 
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        className="positionModalLink"
                        onClick={addPositionToggle}
                        disabled={addPosition}>Добавить новую должность</Button>
                    <Box className="modalButtonGroup">
                        {!addPosition ? 
                                <Button variant="outlined" color="primary" onClick={positionToggle}>Закрыть</Button>
                            :
                            <>
                                <Button variant="outlined" color="primary" onClick={addPositionToggle}>Отмена</Button>
                                <Button variant="contained" color="primary" disableElevation onClick={savePosition}>Сохранить</Button>
                            </>
                        }
                    </Box>
                </form>
            </DialogContent>
        </Dialog>
        <AlertDialog 
            alertOpen={alertOpen}
            handleAlertToggle={handleAlertToggle} 
            title="Администратор" />
        <Notification 
            notification={notification} 
            setNotification={setNotification}
            message="Вы успешно добавили новую должность!!!"
            severity="success" />
        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    position: state.account.position,
    sessionId: state.auth.sessionId,
    positionSuccess: state.account.positionSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    positionSuccessAction: (positionSuccess: boolean) => dispatch(actions.account.positionSuccessAction(positionSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PositionsModal);