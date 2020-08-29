import React, { useState } from 'react';
import { Box, Typography, Grid, Button, FormControl, Select, MenuItem, InputAdornment, IconButton, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { GridIcon, TableIcon, DocIcon } from '../../icons/menuIcons';
import TableImg from '../../img/table.jpg'
import DocImg from '../../img/doc.jpg'
import './Materials.scss'
import MaterialTable from '../bricks/MaterialTable';
import CloseIcon from '@material-ui/icons/Close';

const Materials = () => {
    const [date, setDate] = React.useState('1');
    const [search, setSearch] = useState('');

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setDate(event.target.value as string);
    };

    return (
        <Box className="content">
            <Box className="personal">
                <div className="whiteBg">
                    <Grid container spacing={3} justify="space-between" alignItems="center">
                        <Grid item xs>
                            <Grid container spacing={5}>
                                <Grid item>
                                    <Typography variant="h2" component="h2" className="title">Материалы</Typography>
                                </Grid>
                                <Grid item>
                                    <FormControl variant="outlined" size="small" className="search">
                                        <OutlinedInput
                                            placeholder="Поиск"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {search 
                                                        ? 
                                                            <IconButton edge="end" onClick={() => setSearch('')}>
                                                                <CloseIcon />
                                                            </IconButton>
                                                        :
                                                        <IconButton edge="end" onClick={() => setSearch('')}>
                                                            <SearchIcon />
                                                        </IconButton>
                                                    }
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item>
                                    <div className="sortBox__sortName">
                                        <div className="sortBox__sortLabel">Сортировка по:</div>
                                        <FormControl>
                                            <Select
                                                value={date}
                                                onChange={handleChange}>
                                                <MenuItem value={1}>Дате</MenuItem>
                                                <MenuItem value={2}>Названию</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                </Grid>
                                <Grid item>
                                <Box mt={1}><GridIcon /></Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Box className="alertDialog__group" textAlign="right">
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    disableElevation >Добавить</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <div className="grayBg">
                    <Box className="materials">
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="materials__title">Последние</div>            
                            </Grid>
                            <Grid item>
                                <div className="materials__item">
                                    <div className="materials__imgRow">
                                        <img src={TableImg} alt=""/>
                                    </div>
                                    <div className="materials__content">
                                        <span className="materials__content-icon"><TableIcon /></span>
                                        <div className="materials__content-title">SWOT - ana...</div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="materials__item">
                                    <div className="materials__imgRow">
                                        <img src={TableImg} alt=""/>
                                    </div>
                                    <div className="materials__content">
                                        <span className="materials__content-icon"><TableIcon /></span>
                                        <div className="materials__content-title">Таблица 123</div>
                                    </div>
                                </div>
                            </Grid>
                            <Grid item>
                                <div className="materials__item">
                                    <div className="materials__imgRow">
                                        <img src={DocImg} alt=""/>
                                    </div>
                                    <div className="materials__content">
                                        <span className="materials__content-icon"><DocIcon /></span>
                                        <div className="materials__content-title">Урок №15</div>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="materialsTable">
                    <div className="materialsTable__title">Все материалы</div>
                    <MaterialTable />               
                    </Box>                        
                </div>
            </Box>
        </Box>
    )
}

export default Materials;