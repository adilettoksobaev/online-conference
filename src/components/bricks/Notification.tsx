import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

type Props = {
    notification: boolean;
    setNotification: React.Dispatch<React.SetStateAction<boolean>>;
    message: string;
    severity: "success" | "info" | "warning" | "error" | undefined;
}

const Notification: React.FC<Props> = (props) => {
    const { notification, setNotification, message, severity } = props;

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
        return;
        }
        setNotification(false);
    };

    return (
        <Snackbar 
            anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            open={notification} 
            autoHideDuration={6000} 
            onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity}>
            {message}
            </Alert>
        </Snackbar>
    );
}

export default Notification;