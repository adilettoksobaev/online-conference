import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import { Grid, Box, Checkbox, Tooltip } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { SearchUsers } from '../../store/Account/types';
import { baseUrl } from '../../utils/baseUrl';
import useClipboard from "react-use-clipboard";
import { CopyIcon } from '../../icons/menuIcons';
import './SortBox.scss';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    conferencePublicKey: string;
}

const SortBox: React.FC<Props> = (props) => {
    const { searchUsers, getConferenceUsersAction, conferenceUsers, searchUsersAction, isPublicAction, isPublic, conferencePublicKey } = props;
            
    const conferenceLink = `${baseUrl()}publicConference/#${conferencePublicKey}`;
    const [isCopied, setCopied] = useClipboard(conferenceLink);
    // const [showPassword, setShowPassword] = useState(false);
    
    const publiclyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        isPublicAction(event.target.checked);
    };

    // const showPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     setShowPassword(event.target.checked);
    // };

    const addUserAccount = (userAccount: SearchUsers) => {
        getConferenceUsersAction(userAccount);
        const idx = searchUsers.findIndex((item) => item.userId === userAccount.userId);
        const items = [
            ...searchUsers.slice(0, idx ),
            ...searchUsers.slice(idx + 1)
        ];
        return searchUsersAction(items);
    }

    return (
        <Box className="sortBox">
            <Grid container spacing={3} alignItems="center" justify="space-between">
                <Grid item xs>
                    <div className="sortBoxSelect">
                        <div className="sortBox__title">Добавьте участников</div>
                        <Autocomplete
                            className="sortBox__autocomplete"
                            size="small"
                            options={searchUsers}
                            getOptionLabel={(option) => ''}
                            freeSolo
                            renderOption={(option) => (
                                <span className="sortBoxOption" onClick={() => addUserAccount(option)}>
                                  <span>{option.userName}</span>
                                  <span className="sortBoxOptionAdd">Добавить</span>
                                </span>
                            )}
                            renderInput={(params) => <TextField {...params} placeholder="Поиск" variant="outlined" />}
                        />
                    </div>
                </Grid>
                <Grid item>
                    <div className="passwordBox">
                        <div className="passwordBox__item">Выбрано: <span className="defaultColor">{conferenceUsers.length}</span></div>
                        <div className="passwordBox__item minWidth">
                            <Checkbox
                                checked={isPublic}
                                onChange={publiclyChange}
                                color="primary"
                            />
                            {isPublic ? 
                                <Tooltip title={isCopied ? "Скопировано" : "Скопировать"} placement="top">
                                    <span className="publicLink" onClick={setCopied}>Сcылка <span><CopyIcon /></span></span>
                                </Tooltip> 
                                : 'Публичная'}
                        </div>
                        {/* <div className="passwordRight">
                            <FormControlLabel
                                className="passwordBox__item"
                                control={
                                <Checkbox
                                    checked={showPassword}
                                    onChange={showPasswordChange}
                                    color="primary"
                                />
                                }
                                label="Пароль для входа"
                            />
                            {showPassword && 
                                <TextField 
                                    placeholder="Пароль" 
                                    value={publicRoomPassword} 
                                    onChange={(event) => publicRoomPasswordAction(event.target.value)} />
                            }
                        </div>          */}
                    </div>
                </Grid>
            </Grid>
        </Box>
    )
}

const mapStateToProps = (state: RootState) => ({
    searchUsers: state.account.searchUsers,
    conferenceUsers: state.conferences.conferenceUsers,
    isPublic: state.conferences.isPublic,
    publicRoomPassword: state.conferences.publicRoomPassword,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    getConferenceUsersAction: (conferenceUsers: SearchUsers) => dispatch(actions.conferences.getConferenceUsersAction(conferenceUsers)),
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
    isPublicAction: (isPublic: boolean) => dispatch(actions.conferences.isPublicAction(isPublic)),
    publicRoomPasswordAction: (publicRoomPassword: string) => dispatch(actions.conferences.publicRoomPasswordAction(publicRoomPassword)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SortBox)
