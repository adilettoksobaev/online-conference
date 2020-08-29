import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { Button, IconButton } from '@material-ui/core';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import CloseIcon from '@material-ui/icons/Close';
import './PlugModal.scss'

type Props = {
    plugOpen: boolean;
    handlePlugToggle: () => void;
}

const PlugModal:React.FC<Props> = ({ plugOpen, handlePlugToggle }) => {
  return (
    <Dialog
        open={plugOpen}
        onClose={handlePlugToggle}
        className="plugModal">
        <IconButton className="modalClose" onClick={handlePlugToggle}>
            <CloseIcon />
        </IconButton>
        <DialogContent className="plugModal__content">
            <ErrorOutlineIcon className="errorIcon" />
            <div className="plugModal__title">Конференция начнется <br /> 30 марта 2020 г. в 15:00</div>
            <Button 
                variant="contained" 
                color="primary" 
                disableElevation 
                className="plugModal__button" 
                onClick={handlePlugToggle}>ОК</Button>
        </DialogContent>
    </Dialog>
  );
}

export default PlugModal