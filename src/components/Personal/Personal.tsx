import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Box, Typography, Grid, FormControl, InputAdornment, IconButton, OutlinedInput } from '@material-ui/core';
import PeopleTable from '../bricks/PeopleTable';
import SearchIcon from '@material-ui/icons/Search';
import './Personal.scss'
import AddStaff from '../AddStaff/AddStaff';
import CloseIcon from '@material-ui/icons/Close';
import Pagination from '@material-ui/lab/Pagination';
import { AccountAPI } from '../../api/AccountAPI';
import { SearchUsers } from '../../store/Account/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Personal:React.FC<Props> = ({ searchUsers, sessionId, searchUsersAction, userAccountSuccess }) => {
    // const [name, setName] = React.useState('1');
    const [addOpen, setAddOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = React.useState(1);

    const handleAddToggle = () => {
        setAddOpen(!addOpen);
    };

    // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     setName(event.target.value as string);
    // };

    const paginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    useEffect(() => {
        if(sessionId) {
          AccountAPI.searchUsers(sessionId, search, 0, 0).then(data => {
            searchUsersAction(data.users);
          })
        }
    }, [sessionId, searchUsersAction, search, userAccountSuccess]);

    const counts = searchUsers.length;
    const limit = 10;
    let currentCount = (counts - (counts % limit)) / limit;
    if (counts % limit > 0) {
        currentCount = currentCount + 1;
    }
    const min = (page -1) * limit;
    const max = Math.min(min + limit, counts);
    const newUsers = searchUsers.filter((item, index) => index >= min && index < max);

    return (
        <Box className="content">
            <div className="whiteBg">
                <Box className="personal">
                    <Grid container spacing={3} justify="space-between" alignItems="center">
                        <Grid item xs>
                            <Grid container spacing={5}>
                                <Grid item xs={5}>
                                    <Typography variant="h2" component="h2" className="title">Персонал</Typography>
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
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Box className="alertDialog__group personalGroup" textAlign="right">
                                {/* <div className="sortBox__sortName">
                                    <FormControl>
                                        <Select
                                            value={name}
                                            onChange={handleChange}>
                                            <MenuItem value={1}>Работающие</MenuItem>
                                            <MenuItem value={2}>Работающие</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div> */}
                                {/* <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    disableElevation>Добавить XLS</Button> */}
                                {/* <Button 
                                    variant="contained" 
                                    color="primary" 
                                    disableElevation 
                                    onClick={handleAddToggle}>Добавить</Button> */}
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <div className="grayBg">
                <Box mt={3} mb={3}>
                    <Grid container>
                        <Grid item xs>
                            <PeopleTable 
                                search={search} 
                                newUsers={newUsers}/>
                        </Grid>
                    </Grid>
                </Box>
                {searchUsers.length > 9 && 
                    <Grid container spacing={3} justify="center">
                        <Grid item>
                            <Pagination count={currentCount} page={page} onChange={paginationChange} shape="rounded" className="paginations" />
                        </Grid>
                    </Grid>
                }
                <AddStaff 
                    addOpen={addOpen} 
                    handleAddToggle={handleAddToggle} 
                    organizationId={0}
                    departmentId={0}/>                            
            </div>
        </Box>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    searchUsers: state.account.searchUsers,
    userAccountSuccess: state.account.userAccountSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
});
  
  export default connect(mapStateToProps, mapDispatchToProps)(Personal)