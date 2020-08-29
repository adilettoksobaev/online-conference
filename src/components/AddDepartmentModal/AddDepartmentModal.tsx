import React, { Dispatch, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, IconButton, FormControl, InputLabel, Input, InputAdornment, Box, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { AccountAPI } from '../../api/AccountAPI';
import Notification from '../bricks/Notification'

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    openDeportament: boolean;
    deportamentToggle: () => void;
    organizationId: number;
    departmentId: number;
}

const AddDepartmentModal:React.FC<Props> = (props) => {
    const { openDeportament, deportamentToggle, sessionId, departmentSuccessAction, departmentSuccess, organizationId, departmentId } = props;
    const [value, setValue] = useState('');
    const [error, setError] = useState(false);
    const [notification, setNotification] = React.useState(false);

    const saveDepartment = () => {
        if(value.length <= 3) {
            return setError(true);
        }
        if(sessionId) {
            AccountAPI.setDepartment(sessionId, 0, value, departmentId, organizationId).then(data => {
                if(data.success === true) {
                    departmentSuccessAction(!departmentSuccess);
                    setNotification(true);
                    deportamentToggle();
                    setValue('');
                }
            })
        }
    }

    return (
        <>
            <Dialog
                open={openDeportament}
                onClose={deportamentToggle}
                fullWidth
                className="addOrganizationModal">
                <IconButton className="modalClose" onClick={deportamentToggle}>
                    <CloseIcon />
                </IconButton>
                <DialogContent className="addOrganizationModal__content">
                    <div className="addOrganizationModal__title deportamentTitle">Добавление подразделения</div>
                    {/* <div className="parentDeportament"><strong>Вышестоящие подразделение:</strong><span>Министерство экономического развития</span></div> */}
                    <FormControl fullWidth error={error}>
                        <InputLabel>Название подразделения</InputLabel>
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
                        <FormHelperText>{error ? 'Количество не меньше трех символов' : ''}</FormHelperText>
                    </FormControl>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={deportamentToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveDepartment}>Создать</Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Notification 
                notification={notification} 
                setNotification={setNotification}
                message="Вы успешно добавили подразделение!!!"
                severity="success" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    departmentSuccess: state.account.departmentSuccess
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    departmentSuccessAction: (departmentSuccess: boolean) => dispatch(actions.account.departmentSuccessAction(departmentSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddDepartmentModal)