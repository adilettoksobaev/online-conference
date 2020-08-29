import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { SearchUsers } from '../../store/Account/types';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
    deleteOpen: boolean;
    deleteCloseClick: () => void;
    user: SearchUsers;
}

const DeleteMobile:React.FC<Props> = ({ deleteOpen, deleteCloseClick, user, conferenceUsers, searchUsers, searchUsersAction, deleteConferenceUsersAction }) => {

    const deleteClick = () => {
        const idx = conferenceUsers.findIndex((item) => item.userId === user.userId);
        const items = [
          ...conferenceUsers.slice(0, idx),
          ...conferenceUsers.slice(idx + 1)
        ];
        const newUsers = searchUsers.concat(user);
        user.done = false;
        searchUsersAction(newUsers);
        deleteConferenceUsersAction(items);
        deleteCloseClick();
    }

    return (
        <Dialog
            open={deleteOpen}
            onClose={deleteCloseClick}>
            <DialogContent>
                <DialogContentText className="deleteText">Вы действительно хотите удалить участника</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteCloseClick} className="deleteText">Нет</Button>
                <Button onClick={deleteClick} className="deleteText" autoFocus>Да</Button>
            </DialogActions>
        </Dialog>
    );
}

const mapStateToProps = (state: RootState) => ({
    conferenceUsers: state.conferences.conferenceUsers,
    searchUsers: state.account.searchUsers,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
    searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
    deleteConferenceUsersAction: (conferenceUsers: SearchUsers[]) => dispatch(actions.conferences.deleteConferenceUsersAction(conferenceUsers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteMobile)