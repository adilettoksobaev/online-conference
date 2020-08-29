import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Button, Box, Avatar, FormControl, OutlinedInput, InputAdornment, IconButton } from '@material-ui/core';
import './Staff.scss'
import StaffModal from '../StaffModal/StaffModal';
import AddStaff from '../AddStaff/AddStaff';
import { AccountAPI } from '../../api/AccountAPI';
import { SearchUsers, UserAccount } from '../../store/Account/types';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from '@material-ui/lab/Pagination';
import CloseIcon from '@material-ui/icons/Close';
import { randomColor } from '../../utils/randomColor';
  

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    organizationId: number,
    departmentId: number,
    withoutDepartment?: boolean
}

const Staff:React.FC<Props> = (props) => {
    const { sessionId, organizationId, departmentId, searchUsersAction, searchUsers, organization, getUserAccountAction, userAccountSuccess, parentDepartments,
        withoutDepartment } = props;
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [page, setPage] = React.useState(1);

    useEffect(() => {
        if(sessionId) {
          AccountAPI.searchUsers(sessionId, search, organizationId, departmentId, withoutDepartment).then(data => {
            searchUsersAction(data.users);
          })
        }
      }, [sessionId, searchUsersAction, search, organizationId, userAccountSuccess, departmentId, withoutDepartment]);

    const handleEditOpen = (userId: number) => {
        setEditOpen(true);
        if(sessionId) {
            AccountAPI.getUserAccount(sessionId, userId).then(data => {
                getUserAccountAction(data);
            })
        }
    };

    const handleAddToggle = () => {
        setAddOpen(!addOpen);
    };

    const paginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const counts = searchUsers.length;
    const limit = 10;
    let currentCount = (counts - (counts % limit)) / limit;
    if (counts % limit > 0) {
        currentCount = currentCount + 1;
    }
    const min = (page -1) * limit;
    const max = Math.min(min + limit, counts);
    const newUsers = searchUsers.filter((item, index) => index >= min && index < max);

    const organizationName = organization.find(item => item.organizationId === organizationId)?.organizationName;

    return (
        <Box className="staff">
            <Box mb={1}>
                <Grid container spacing={3} alignItems="center" justify="space-between">
                    <Grid item>
                        <div className="staff__title">Сотрудники “{departmentId ? parentDepartments[0]?.departmentName : organizationName}”</div>
                    </Grid>
                    <Grid item>
                        <FormControl variant="outlined" size="small" className="search">
                            <OutlinedInput
                                placeholder="Поиск"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
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
                        <Button variant="contained" color="primary" disableElevation onClick={handleAddToggle}>Новый</Button>
                    </Grid>
                </Grid>
            </Box>
            <Grid container spacing={3}>
                {newUsers.map((user: SearchUsers) => {
                    return (
                        <Grid item key={user.userId}>
                            <div className="staffBox" onClick={() => handleEditOpen(user.userId)}>
                                <Avatar alt={user.userName} src="/broken-image.jpg" className="staffBox__avatar" style={{backgroundColor: randomColor()}}>
                                    {user.userName.substr(0, 1)}
                                </Avatar>
                                <div className="staffBox__title">{user.userName}</div>
                                <div className="staffBox__position">{user.positionName}</div>
                            </div>
                        </Grid>
                    );
                })}
            </Grid>
            {searchUsers.length > 9 && 
                <Grid container spacing={3} justify="center">
                    <Grid item>
                        <Pagination count={currentCount} page={page} onChange={paginationChange} shape="rounded" className="paginations" />
                    </Grid>
                </Grid>
            }
            <StaffModal 
                editOpen={editOpen}
                setEditOpen={setEditOpen} />
            <AddStaff 
                addOpen={addOpen} 
                handleAddToggle={handleAddToggle}
                organizationId={organizationId} 
                departmentId={departmentId}/>
        </Box>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    organization: state.account.organization,
    department: state.account.department,
    searchUsers: state.account.searchUsers,
    position: state.account.position,
    userAccountSuccess: state.account.userAccountSuccess,
    parentDepartments: state.account.parentDepartments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
    getUserAccountAction: (userAccount: UserAccount) => dispatch(actions.account.getUserAccountAction(userAccount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Staff);