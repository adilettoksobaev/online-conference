import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Route, Switch, withRouter } from 'react-router-dom'
import Header from '../Header/Header';
import Menu from '../Menu/Menu';
import { Box } from '@material-ui/core';
import Сonferences from '../Сonferences/Сonferences';
import Participants from '../Participants/Participants';
import Units from '../Units/Units';
import NewСonference from '../NewСonference/NewСonference';
import Personal from '../Personal/Personal';
import Authorization from '../Authorization/Authorization';
import { AuthAPI } from '../../api/AuthAPI';
import { PhonePinConfirm } from '../../store/Auth/types';
import { AccountAPI } from '../../api/AccountAPI';
import { Organization } from '../../store/Account/types';
import Category from '../Category/Category';
import Main from '../Main/Main';
import CountDown from '../CountDown/CountDown';
import EditСonference from '../EditСonference/EditСonference';
import PublicConference from '../PublicConference/PublicConference';
import MobileMenu from '../MobileMenu/MobileMenu';
import Profile from '../Profile/Profile';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const AppStack:React.FC<Props> = (props) => {
    const { isAuthorized, sessionId, checkSessionAction, setLoaderAction, getOrganizationsAction, organizationSuccess, role, 
            accessToCreateConferences, startConference } = props;
    const { pathname } = window.location
    const [access, setAccess] = useState(true);
    const [createConferences, setCreateConferences] = useState(true);
    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            AuthAPI.checkSession(sessionId).then(res => {
                if(res.status === 200) {
                    checkSessionAction(res.data, true);
                    setLoaderAction(false);
                }
            });
        }
    }, [sessionId, checkSessionAction, setLoaderAction]);

    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            AccountAPI.getOrganizations(sessionId, 0).then(data => {
                getOrganizationsAction(data);
                setLoaderAction(false);
            });
        }
    }, [sessionId, getOrganizationsAction, organizationSuccess, setLoaderAction]);

    useEffect(() => {
        if(role === 'User' && !accessToCreateConferences) {
            setAccess(false);
            setCreateConferences(false);
        } else if (role === 'User' && accessToCreateConferences) {
            setAccess(false);
            setCreateConferences(true);
        } else {
            setAccess(true);
            setCreateConferences(true);
        }
    }, [role, accessToCreateConferences]);

    if (pathname.match(/publicConference/) && !isAuthorized) {
        return (<PublicConference />)
    }
    
    if(!isAuthorized) {
        return (<Authorization />)
    }

    //ConferenceHasNotYetStarted
    if(startConference?.resultType === 'ConferenceHasNotYetStarted') {
        return (<CountDown />)
    }

    return (
        <>
            <Header />
            <Box className="mainContainer">
                <Menu />
                <MobileMenu />
                <Switch>
                    <Route 
                        path="/" 
                        component={Main}  
                        exact />
                    <Route 
                        path="/conferences" 
                        component={Сonferences} 
                        exact />
                    <Route 
                        path="/conferences/:conferenceId" 
                        component={EditСonference} />
                    {createConferences && 
                        <Route 
                            path="/new-conference" 
                            component={NewСonference}
                            exact />
                    }
                    {access && 
                        <Route 
                            path="/participants" 
                            component={Participants} 
                            exact />
                    }
                    {access && 
                        <Route path="/participants/:organizationId"
                            component={Units} 
                            exact />
                    }
                    {access && 
                        <Route path="/participants/:organizationId/:departmentId"
                            component={Category} />
                    }
                    {access &&
                        <Route 
                            path="/personal" 
                            component={Personal} />
                    }
                    {/* <Route 
                        path="/materials" 
                        component={Materials} /> */}
                    <Route 
                        path="/publicConference/" 
                        component={PublicConference} />
                    <Route 
                        path="/profile" 
                        component={Profile} />
                </Switch>
            </Box>
        </>
    );
}

const mapStateToProps = (state: RootState) => ({
    isAuthorized: state.auth.isAuthorized,
    sessionId: state.auth.sessionId,
    organizationSuccess: state.account.organizationSuccess,
    role: state.auth.role,
    accessToCreateConferences: state.auth.accessToCreateConferences,
    startConference: state.conferences.startConference,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    checkSessionAction: (payload: PhonePinConfirm, isAuthorized: boolean) => dispatch(actions.auth.checkSessionAction(payload, isAuthorized)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    getOrganizationsAction: (organization: Organization[]) => dispatch(actions.account.getOrganizationsAction(organization)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AppStack));
