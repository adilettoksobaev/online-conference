import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';

type Props = {
    startNowToggle: () => void
}

const AddConferenceIcon:React.FC<Props> = ({ startNowToggle }) => {
    let history = useHistory();
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);;

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const openNewConference = () => {
        return history.push('/new-conference');
    }

    const openStart = () => {
        startNowToggle();
        setOpen(!open);
    }

    return (
        <SpeedDial
            ariaLabel="SpeedDial example"
            className={`addMobile ${classes.speedDial}`}
            icon={<SpeedDialIcon />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            >
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Начать сейчас"
                    tooltipOpen
                    onClick={openStart}
                />
                <SpeedDialAction
                    icon={<AddIcon />}
                    tooltipTitle="Новая"
                    tooltipOpen
                    onClick={openNewConference}
                />
        </SpeedDial>
    );
}

export default AddConferenceIcon;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: 'fixed',
      '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: 66,
        right: 20,
      },
      '& .MuiSpeedDialAction-staticTooltipLabel': {
        textAlign: 'center',
        color: '#333',
      },
      '& #SpeedDialexample-action-0-label': {
        minWidth: 114,
      }
    },
  }),
);