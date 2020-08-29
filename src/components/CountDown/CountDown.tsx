import React, { Dispatch, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Countdown, { CountdownRenderProps } from "react-countdown-now";
import { Button, Box } from '@material-ui/core';
import StartImg from '../../img/start.png';
import { ConferencesAPI } from '../../api/ConferencesAPI';
import { StartConferenceType } from '../../store/Conferences/types';
import Moment from 'react-moment';
import 'moment/locale/ru';
import './CountDown.scss';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const CountDown: React.FC<Props> = ({ startConferenceAction, sessionId, startConference }) => {

    const [conference, setConference] = useState({
        conferenceName: '',
        startDate: new Date(),
        timeStart: ''
    });

    const conferenceId = startConference ? startConference.conferenceId : 0;
    const password = startConference ? startConference.password : '';

    useEffect(() => {
        if(sessionId) {
            ConferencesAPI.getConference(sessionId, conferenceId).then(data => {
                setConference(prevStata => ({
                    ...prevStata,
                    conferenceName: data.conferenceName,
                    startDate: data.startDate,
                    timeStart: data.timeStart,
                }));
            })
        }
    }, [sessionId, conferenceId]);

    useEffect(() => {
        if(sessionId) {
            ConferencesAPI.startConference(sessionId, conferenceId, password).then(data => {
                const payload = {
                    resultType: data.resultType,
                    secondsToStart: data.secondsToStart,
                    conferenceId,
                    password,
                }
                startConferenceAction(payload);
            }).catch(({response}) => alert(response.data.message));
        }
    }, [sessionId, startConferenceAction, conferenceId, password]);

    const renderer = (props: CountdownRenderProps) => {
        const { days, hours, minutes, seconds, completed } = props;

        const joinClick = () => {
            var windowReference = window.open();
            if(sessionId && startConference) {
                ConferencesAPI.startConference(sessionId, startConference.conferenceId, startConference.password).then(data => {
                  if(data.resultType === "Success") {
                    if(windowReference) {
                        windowReference.location = data.conferenceJoinLink;
                    }
                  } else {
                      alert(data.message);
                  }
                }).catch(({response}) => alert(response.data.message));
            }
        }

        const payload = {
            resultType: '',
            secondsToStart: 0,
            conferenceId: 0,
            password: '',
        }

        if (completed) {
          // Render a complete state
          return (
            <>
                <div className="startRow">
                    <img src={StartImg} alt="Старт"/>
                </div>
                <div className="currentGoes">Конференция идет 0:10:05</div>
                <Box className="modalButtonGroup">
                    <Button variant="outlined" color="primary" onClick ={() => startConferenceAction(payload)}>Закрыть</Button>
                    <Button variant="contained" color="primary" disableElevation onClick={joinClick}>Присоедениться</Button>
                </Box>
            </>
          );
        } else {
          // Render a countdown
          return (
            <>
                <div className="countTimer">
                    <div className="timerTitle">до начала осталось</div>
                    <div className="countdown">
                        <div className="countdown__item">
                            <div className="number">{days}</div>
                            <div className="text">дней</div>
                        </div>
                        <span className="colon">:</span>
                        <div className="countdown__item">
                            <div className="number">{hours}</div>
                            <div className="text">часов</div>
                        </div>
                        <span className="colon">:</span>
                        <div className="countdown__item">
                            <div className="number">{minutes}</div>
                            <div className="text">минут</div>
                        </div>
                        <span className="colon">:</span>
                        <div className="countdown__item">
                            <div className="number">{seconds}</div>
                            <div className="text">секунд</div>
                        </div>
                    </div>
                </div>
                <Box className="modalButtonGroup">
                    <Button variant="outlined" color="primary" onClick ={() => startConferenceAction(payload)}>Закрыть</Button>
                </Box>
            </>
          );
        }
    };

    return (
        <div className="countDown">
            <div className="countDown__content">
                <div className="title"><span>{conference.conferenceName}</span> <Moment format="DD MMMM YYYY" locale="ru">{conference.startDate}</Moment> г. в {conference.timeStart}</div>
                <Countdown date={Date.now() + (startConference ? parseInt(startConference.secondsToStart + '000') : 0)} renderer={renderer} />
                {/* <Countdown date={Date.now() + 5000} renderer={renderer} /> */}
            </div>
        </div>
    );
}

const mapStateToProps = (state: RootState) => ({
    sessionId: state.auth.sessionId,
    startConference: state.conferences.startConference,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    startConferenceAction: (payload: StartConferenceType) => dispatch(actions.conferences.startConferenceAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CountDown);