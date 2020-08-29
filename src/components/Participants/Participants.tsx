import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Typography, Box, Button, FormControl, OutlinedInput, InputAdornment, IconButton, Select, MenuItem } from '@material-ui/core';
import './Participants.scss'
import { NavLink } from 'react-router-dom';
import AddOrganizationModal from '../AddOrganizationModal/AddOrganizationModal';
import SearchIcon from '@material-ui/icons/Search';
import { Organization, Cities } from '../../store/Account/types';
import { AccountAPI } from '../../api/AccountAPI';
import Spinner from '../Spinner/Spinner';
import { CaseIcon, PeopleBlueIcon } from '../../icons/icons';
import CloseIcon from '@material-ui/icons/Close';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Participants: React.FC<Props> = (props) => {
    const { cities, getCitiesAction, organization, sessionId, getOrganizationsAction, organizationSuccess, setLoaderAction, role } = props;
    const [addOrganization, setAddOrganization] = useState(false);
    const [city, setCity] = React.useState(0);
    const [search, setSearch] = useState('');

    const cityChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCity(event.target.value as number);
    };

    const addMemberToggle = () => {
        setAddOrganization(!addOrganization);
    };

    useEffect(() => {
        if(sessionId) {
            AccountAPI.getCities(sessionId).then(data => {
                getCitiesAction(data);
            });
        }
    }, [sessionId, getCitiesAction]);

    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            AccountAPI.getOrganizations(sessionId, city).then(data => {
                getOrganizationsAction(data);
                setLoaderAction(false);
            });
        }
    }, [sessionId, getOrganizationsAction, organizationSuccess, city, setLoaderAction]);

    const searchOrganization = organization.filter((item) => {
        if (search.length === 0) {
            return item;
        }
        return item.organizationName.toLowerCase().indexOf(search.toLowerCase()) > -1;
    });

    return (
        <Box className="content">
            <Spinner />
            <div className="whiteBg">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item xs={3} >
                        <Typography variant="h2" component="h2" className="title">Участники</Typography>
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
                        <div className="sortBox__sortName">
                            <div className="sortBox__sortLabel">Город:</div>
                            <FormControl>
                                <Select
                                    value={city}
                                    onChange={cityChange}>
                                    <MenuItem value={0}>Все</MenuItem>
                                    {cities.map(item => (
                                        <MenuItem key={item.cityId} value={item.cityId}>{item.cityName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </Grid>
                    <Grid item>
                        {role === 'SuperAdmin' && 
                            <Box textAlign="right">
                                <Button variant="contained" color="primary" disableElevation onClick={addMemberToggle}>Добавить</Button>
                            </Box>
                        }
                    </Grid>
                </Grid>
            </div>
            <div className="grayBg">
                <Grid container spacing={2}>
                    {searchOrganization.map((item) => {
                        return (
                            <Grid item key={item.organizationId}>
                                <NavLink to={`/participants/${item.organizationId}`} className="participantsBox">
                                    <div className="participantsBox__title">{item.organizationName}</div>
                                    <div className="participantsBox__bottom">
                                        <div className="bottomItem">
                                            <span className="icon"><CaseIcon /></span>
                                            {item.countDepartments} подразделений
                                        </div>
                                        <div className="bottomItem">
                                            <span className="icon"><PeopleBlueIcon /></span>
                                            {item.countAccounts} сотрудников
                                        </div>
                                    </div>
                                </NavLink>
                            </Grid>
                        );
                    })}
                </Grid>
                <AddOrganizationModal 
                    addOrganization={addOrganization}
                    addMemberToggle={addMemberToggle}/>
            </div>
        </Box>
    )
}

const mapStateToProps = (state: RootState) => ({
    cities: state.account.cities,
    sessionId: state.auth.sessionId,
    organization: state.account.organization,
    organizationSuccess: state.account.organizationSuccess,
    role: state.auth.role,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getCitiesAction: (cities: Cities[]) => dispatch(actions.account.getCitiesAction(cities)),
    getOrganizationsAction: (organization: Organization[]) => dispatch(actions.account.getOrganizationsAction(organization)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Participants)