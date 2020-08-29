import React, { Dispatch, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Typography, Box, Button, ButtonGroup, Avatar } from '@material-ui/core'
import './Сonferences.scss';
import PlugModal from '../PlugModal/PlugModal';
import { NavLink, useHistory } from 'react-router-dom';
import PasswordConference from '../PasswordConference/PasswordConference';
import { Conferences, StartConferenceType } from '../../store/Conferences/types';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import Spinner from '../Spinner/Spinner';
import { CalendarIcon, TimeIcon, PeopleIcon } from '../../icons/icons';
import StartNow from '../StartNow/StartNow';
import Moment from 'react-moment';
import 'moment/locale/ru';
import { randomColor } from '../../utils/randomColor';
import EditSharpIcon from '@material-ui/icons/EditSharp';
import CountDown from '../CountDown/CountDown';
import AddConferenceIcon from '../AddConferenceIcon/AddConferenceIcon';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const Сonferences:React.FC<Props> = (props) => {
    const { sessionId, getConferencesAction, conferences, setLoaderAction, role, accessToCreateConferences, conferenceSuccess, startConferenceAction } = props;
    let history = useHistory();
    const [access, setAccess] = useState(true);
    const [plugOpen, setPlugOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [startNowOpen, setStartNowOpen] = useState(false);
    const [conferenceId, setConferenceId] = useState(0);
    const [interval, setIntervals] = useState("week");
    const [intervalActive, setIntervalActive] = useState(1);

    const intervalClick = (value: string, index: number) => {
        setIntervals(value);
        setIntervalActive(index);
    }

    const handleLoginToggle = () => {
        setLoginOpen(!loginOpen);
    };

    const startNowToggle = () => {
        setStartNowOpen(!startNowOpen);
    };

    const handlePlugToggle = () => {
        setPlugOpen(!plugOpen);
    };

    const conferenceClick = (conference: Conferences) => {
        
        setConferenceId(conference.conferenceId);
        if(conference.needPassword) {
            handleLoginToggle();
        } else {
            if(sessionId) {
                ConferencesAPI.startConference(sessionId, conference.conferenceId, null).then(data => {
                    if(data.resultType === "Success") {
                        var windowReference = window.open();
                        if(windowReference) {
                            windowReference.location = data.conferenceJoinLink;
                        }
                    } else if(data.resultType === "ConferenceHasNotYetStarted") {
                        const payload = {
                            resultType: data.resultType,
                            secondsToStart: data.secondsToStart,
                            conferenceId: conference.conferenceId,
                            password: null,
                        }
                        startConferenceAction(payload);
                        return (<CountDown />)
                    } else {
                        alert(data.message);
                    }
                }).catch(({response}) => alert(response.data.message));
            }
        }
    }

    useEffect(() => {
        setLoaderAction(true);
        if(sessionId) {
            ConferencesAPI.getConferences(sessionId, interval).then(data => {
                getConferencesAction(data);
                setLoaderAction(false);
            });
        }
    }, [sessionId, getConferencesAction, setLoaderAction, interval, conferenceSuccess]);

    const dateInterval = () => {
        const dateToFormat = new Date();
        if(interval === 'today') {
            return (<Moment format="DD MMMM YYYY" locale="ru">{dateToFormat}</Moment>)
        } else if (interval === 'week') {
            return (
                <>
                    <Moment format="DD">{dateToFormat}</Moment>-
                    <Moment add={{ days: 7 }} format="DD ">{dateToFormat}</Moment>
                    <Moment format="MMMM YYYY" locale="ru">{dateToFormat}</Moment>
                </>
            )
        } else { 
            return <Moment format="MMMM YYYY" locale="ru">{dateToFormat}</Moment>
        }
    }

    useEffect(() => {
        if(role === 'User' && !accessToCreateConferences) {
            setAccess(false);
        } else if (role === 'User' && accessToCreateConferences) {
            setAccess(true);
        }
        else {
            setAccess(true);
        }
    }, [role, accessToCreateConferences]);

    const editConference = (conferenceId: number) => {
        return history.push(`/conferences/${conferenceId}`);
    }

    return (
        <Box className="content conferences">
            <Spinner />
            <div className="whiteBg">
                <Grid container spacing={3} justify="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h2" component="h2" className="title">Конференции</Typography>
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Box textAlign="center">
                            <ButtonGroup className="conferenceTab">
                                <Button className={intervalActive === 0 ? 'active' : ''} onClick={() => intervalClick('today', 0)}>Сегодня</Button>
                                <Button className={intervalActive === 1 ? 'active' : ''} onClick={() => intervalClick('week', 1)}>Неделя</Button>
                                <Button className={intervalActive === 2 ? 'active' : ''} onClick={() => intervalClick('month', 2)}>Месяц</Button>
                            </ButtonGroup>
                        </Box>
                    </Grid>
                    <Grid item className="desktopBtn">
                        {access && 
                            <Box textAlign="right" className="btnRow">
                                <Button variant="outlined" color="primary" onClick={startNowToggle}>Начать сейчас</Button>
                                <NavLink to="/new-conference" className="decorationNone">
                                    <Button variant="contained" color="primary" disableElevation>Новая</Button>
                                </NavLink>
                            </Box>
                        }
                    </Grid>
                </Grid>
                {access &&
                    <AddConferenceIcon startNowToggle={startNowToggle} />
                }
            </div>
            <div className="grayBg">
                <Grid container>
                    <Grid item>
                    <Box className="dateTitle">{dateInterval()}</Box>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {conferences.map((item) => (
                        <Grid item key={item.conferenceId} xs={12} sm={'auto'}>
                            <Box className="conferenceBox">
                                {access &&
                                    <EditSharpIcon className="conferenceBox__edit" onClick={() => editConference(item.conferenceId)} />
                                }
                                <div onClick={() => conferenceClick(item)}>
                                    <div className="conferenceBox__title">{item.conferenceName}</div>
                                    <div className="conferenceBox__info">
                                        <Avatar alt={item.creatorName} src="/broken-image.jpg" className="conferenceBox__avatar" style={{backgroundColor: randomColor()}}>
                                            {item.creatorName.substr(0, 1)}
                                        </Avatar>
                                        <div>
                                            <div className="conferenceBox__name">{item.creatorName}</div>
                                            <div className="conferenceBox__position">{item.creatorPosition}</div>
                                        </div>
                                    </div>
                                    <div className="conferenceBox__bottom">
                                        <div className="bottomItem">
                                            <span className="icon"><CalendarIcon /></span>
                                            <Moment format="DD MMMM YYYY" locale="ru">{item.startDate}</Moment>
                                        </div>
                                        <div className="bottomItem">
                                            <span className="icon"><TimeIcon /></span>
                                            {item.timeStart} - {item.timeEnd}
                                        </div>
                                        <div className="bottomItem">
                                            <span className="icon"><PeopleIcon /></span>
                                            {item.countParticipants}
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
                <PlugModal 
                    plugOpen={plugOpen}
                    handlePlugToggle={handlePlugToggle}/>
                <PasswordConference 
                    loginOpen={loginOpen}
                    handleLoginToggle={handleLoginToggle} 
                    conferenceId={conferenceId}/>
                <StartNow 
                    startNowOpen={startNowOpen}
                    startNowToggle={startNowToggle}/>
            </div>
        </Box>
    )
};

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    conferences: state.conferences.conferences,
    role: state.auth.role,
    accessToCreateConferences: state.auth.accessToCreateConferences,
    conferenceSuccess: state.conferences.conferenceSuccess,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getConferencesAction: (conferences: Conferences[]) => dispatch(actions.conferences.getConferencesAction(conferences)),
    setLoaderAction: (loading: boolean) => dispatch(actions.auth.setLoaderAction(loading)),
    startConferenceAction: (payload: StartConferenceType) => dispatch(actions.conferences.startConferenceAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Сonferences)