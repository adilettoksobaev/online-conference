import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Typography, Box, Breadcrumbs } from '@material-ui/core';
import { HomeIcon } from '../../icons/menuIcons'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import './Units.scss'
import Staff from '../Staff/Staff';
import AddDepartmentModal from '../AddDepartmentModal/AddDepartmentModal';
import { Department } from '../../store/Account/types';
import { AccountAPI } from '../../api/AccountAPI';
import { useRouteMatch, NavLink } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';
import PositionsModal from '../PositionsModal/PositionsModal';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import EditOrganizationModal from '../EditOrganizationModal/EditOrganizationModal';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>
const Units:React.FC<Props> = (props) => {
    const { sessionId, getDepartmentAction, organization, department, getPositionAction, position, departmentSuccess, positionSuccess, setLoaderAction } = props;
    const [openDeportament, setOpenDeportament] = useState(false);
    const [showToggle, setShowToggle] = useState(false);
    const [positionOpen, setPositionOpen] = useState(false);
    const [editOrganization, setEditOrganization] = useState(false);

    const match = useRouteMatch();
    //@ts-ignore
    const organizationId = parseInt(match.params.organizationId);
    //@ts-ignore
    const departmentId = parseInt(match.params.departmentId);

    useEffect(() => {
        if(sessionId) {
            AccountAPI.getDepartments(sessionId, organizationId, 0).then(data => {
                getDepartmentAction(data);
            });
        }
    }, [sessionId, organizationId, getDepartmentAction, departmentSuccess]);

    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            AccountAPI.getPositions(sessionId, organizationId).then(data => {
                getPositionAction(data);
                setLoaderAction(false);
            });
        }
    }, [sessionId, organizationId, getPositionAction, positionSuccess, setLoaderAction]);

    const positionToggle = () => {
        setPositionOpen(!positionOpen);
    }

    const deportamentToggle = () => {
        setOpenDeportament(!openDeportament);
    };

    const title = organization.find(item => item.organizationId === organizationId)?.organizationName;
    const countPosition = position.filter(pos => pos.organizationId === organizationId);

    const startDepartment = department.slice(0, 3);
    const allDepartment = department.slice(startDepartment.length)

    const showToggleClick = () => {
        setShowToggle(!showToggle);
    }

    const editOrganizationToggle = () => {
        setEditOrganization(!editOrganization)
    }

    return (
        <Box className="content">
            <Spinner />
            <div className="whiteBg">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h2" component="h2" className="title">{title} <EditSharpIcon className="editPen" onClick={editOrganizationToggle} /></Typography>
                        <Breadcrumbs separator={<ArrowForwardIcon fontSize="small" />} className="breadcrumbs">
                            <NavLink to={`/participants/`} className="homeIcon">
                                <HomeIcon />
                            </NavLink>
                            <NavLink to={`/participants/`} >{title}</NavLink>
                        </Breadcrumbs>
                    </Grid>
                </Grid>
                <Box mb={3}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <div className="untils">
                                <div className="untils__title">
                                    Подразделения
                                </div>
                                <Box color="inherit" className="untils__add" onClick={deportamentToggle}>+ Новое подразделение</Box>
                                <ul>
                                    {startDepartment.map(item => (
                                        <li key={item.departmentId}>
                                            <NavLink 
                                                color="inherit" to={`/participants/${organizationId}/${item.departmentId}`}>
                                                {item.departmentName}
                                            </NavLink>
                                        </li>
                                    ))}
                                    {showToggle && 
                                        allDepartment.map(item => (
                                            <li key={item.departmentId}>
                                                <NavLink color="inherit" to={`/participants/${organizationId}/${item.departmentId}`}>
                                                    {item.departmentName}
                                                </NavLink>
                                            </li> 
                                        ))
                                    }
                                    {department.length > 2 &&
                                        <li><span className="untils__more" onClick={showToggleClick}>{!showToggle ? 'Показать еще' : 'Скрыть'}</span></li>
                                    }
                                </ul>
                            </div>
                        </Grid>
                        <Grid item>
                            <div className="untils">
                                <div className="untils__title">
                                    Должности
                                </div>
                                <Box onClick={positionToggle} className="untils__positionLink">{countPosition.length} должностей</Box>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <div className="grayBg">
                <Staff 
                    organizationId={organizationId}
                    departmentId={departmentId} 
                    withoutDepartment={true} />
                <AddDepartmentModal 
                    openDeportament={openDeportament}
                    deportamentToggle={deportamentToggle}
                    organizationId={organizationId}
                    departmentId={0} />                      
            </div>
            <PositionsModal 
                positionOpen={positionOpen}
                positionToggle={positionToggle}
                organizationId={organizationId} />
            <EditOrganizationModal 
                editOrganization={editOrganization}
                editOrganizationToggle={editOrganizationToggle}
                organizationId={organizationId}/>
        </Box>
    )
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    organization: state.account.organization,
    department: state.account.department,
    position: state.account.position,
    departmentSuccess: state.account.departmentSuccess,
    positionSuccess: state.account.positionSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getDepartmentAction: (department: Department[]) => dispatch(actions.account.getDepartmentAction(department)),
    getPositionAction: (position: Position[]) => dispatch(actions.account.getPositionAction(position)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Units)