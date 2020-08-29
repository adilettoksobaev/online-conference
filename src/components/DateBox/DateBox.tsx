import React, { useState } from 'react'
import { Box, Grid, FormControl, InputLabel, Input, InputAdornment, IconButton, TextField, MenuItem, FormHelperText } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {  KeyboardDatePicker } from '@material-ui/pickers';
import TimerIcon from '@material-ui/icons/Timer';
import RepeatIcon from '@material-ui/icons/Repeat';
import './DateBox.scss';

const DateBox = () => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeStartDefault = `${hours}:${minutes}`;
    const timeEndDefault = `${hours + 1}:${minutes}`;

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
    const [timeStart, setTimeStart] = useState(timeStartDefault);
    const [timeEnd, setTimeEnd] = useState(timeEndDefault);
    const [repeat, setRepeat] = useState('false');
    const [title, setTitle] = useState('');
    const [error, setError] = useState(false);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    return (
        <Box className="newСonference">
            <Grid container spacing={3} justify="space-between" alignItems="center">
                <Grid item xs>
                    <FormControl fullWidth className="boxForm searchBox" error={error}>
                        <InputLabel>Название конференции</InputLabel>
                        <Input
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            endAdornment={
                                <InputAdornment position="end" className="iconClear">
                                    <IconButton>
                                        <CloseIcon />
                                    </IconButton>
                                </InputAdornment>
                            } />
                        <FormHelperText>{error ? 'Количество не меньше трех символов' : ''}</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item className="maxWidth">
                    <KeyboardDatePicker
                        label="Дата проведения"
                        format="dd.MM.yyyy"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        InputAdornmentProps={{ position: "start" }}
                        className="dateControl"
                    />
                </Grid>
                <Grid item className="maxWidth">
                    <Box className="boxTime">
                        <span className="boxTime__title">Время проведения</span>
                        <div className="boxTime__item">
                            <TextField
                                className="boxForm"
                                type="time"
                                value={timeStart}
                                onChange={e => setTimeStart(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <TimerIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                className="boxForm"
                                type="time"
                                value={timeEnd}
                                onChange={e => setTimeEnd(e.target.value)}
                            />
                        </div>
                    </Box>
                </Grid>
                <Grid item>
                    <TextField
                        select
                        label="Повторение"
                        value={repeat}
                        onChange={(e) => setRepeat(e.target.value)}
                        className="boxForm repeatWidth"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <RepeatIcon />
                                </InputAdornment>
                            ),
                        }}>
                        <MenuItem value={'false'}>Выключено</MenuItem>
                        <MenuItem value={'true'}>Включено</MenuItem>
                    </TextField>
                </Grid>
            </Grid>
        </Box>
    )
}

export default DateBox