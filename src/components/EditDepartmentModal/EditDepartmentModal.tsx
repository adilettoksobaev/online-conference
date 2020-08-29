import React, { Dispatch, useState, useEffect } from 'react';
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
    editDeportament: boolean;
    editDeportamentToggle: () => void;
    organizationId: number;
}

const initialError = {
    text: '',
    error: false,
};

const initialMessage = {
    value: initialError,
};

const EditDepartmentModal:React.FC<Props> = (props) => {
    const { editDeportament, editDeportamentToggle, organizationId, sessionId, departmentSuccessAction, departmentSuccess, parentDepartments } = props;
    const [value, setValue] = useState('');
    const [message, setMessage] = useState(initialMessage);
    const [notification, setNotification] = React.useState(false);

    useEffect(() => {
        setValue(parentDepartments[0]?.departmentName);
    }, [parentDepartments]);

    const validate = () => {
        let valueError = initialError;
        if(!value) {
            valueError = {
                text: 'Заполните обязательное поле',
                error: true,
            };
        }

        if (valueError) {
            setMessage({ ...message, value: valueError });
            return false;
        }
        return true;
    };

    const saveDepartment = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const isValid = validate();
        if(isValid) {
            setMessage(initialMessage);
        }

        if(sessionId) {
            AccountAPI.setDepartment(sessionId, parentDepartments[0]?.departmentId, value, null, organizationId).then(data => {
                if(data.success === true) {
                    departmentSuccessAction(!departmentSuccess);
                    setNotification(true);
                    editDeportamentToggle();
                    setValue('');
                }
            })
        }
    }

    return (
        <>
            <Dialog
                open={editDeportament}
                onClose={editDeportamentToggle}
                fullWidth
                className="addOrganizationModal">
                <IconButton className="modalClose" onClick={editDeportamentToggle}>
                    <CloseIcon />
                </IconButton>
                <DialogContent className="addOrganizationModal__content">
                    <div className="addOrganizationModal__title deportamentTitle">Редактировать подразделения</div>
                    {/* <div className="parentDeportament"><strong>Вышестоящие подразделение:</strong><span>Министерство экономического развития</span></div> */}
                    <FormControl fullWidth required error={message.value.error}>
                        <InputLabel>Название подразделения</InputLabel>
                        <Input
                            value={value}
                            autoFocus
                            onChange={e => setValue(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton onClick={() => setValue('')}>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText>{message.value.text}</FormHelperText>
                    </FormControl>
                    <Box className="modalButtonGroup">
                        <Button variant="outlined" color="primary" onClick={editDeportamentToggle}>Отмена</Button>
                        <Button variant="contained" color="primary" disableElevation onClick={saveDepartment}>Сохранить</Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Notification 
                notification={notification} 
                setNotification={setNotification}
                message="Вы успешно обновили подразделение!!!"
                severity="success" />
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    departmentSuccess: state.account.departmentSuccess,
    parentDepartments: state.account.parentDepartments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    departmentSuccessAction: (departmentSuccess: boolean) => dispatch(actions.account.departmentSuccessAction(departmentSuccess)),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditDepartmentModal)