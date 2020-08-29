import React, { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootState, actions } from '../../store';
import { ThunkDispatch } from 'redux-thunk';
import { Action, AnyAction } from 'redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box, Avatar } from '@material-ui/core';
import { SearchUsers } from '../../store/Account/types';
import { randomColor } from '../../utils/randomColor';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>

const PersonalTable: React.FC<Props> = ({ conferenceUsers, deleteConferenceUsersAction, searchUsersAction, searchUsers }) => {
    const classes = useStyles();

    const deleteClick = (user: SearchUsers) => {
      const idx = conferenceUsers.findIndex((item) => item.userId === user.userId);
      const items = [
        ...conferenceUsers.slice(0, idx),
        ...conferenceUsers.slice(idx + 1)
      ];
      const newUsers = searchUsers.concat(user);
      searchUsersAction(newUsers);
      return deleteConferenceUsersAction(items);
    }

    return (
      <TableContainer component={Paper} className={classes.root}>
        {conferenceUsers.length > 0 && 
          <Table>
            <TableHead className={classes.head}>
              <TableRow>
                <TableCell align="left">№</TableCell>
                <TableCell>Имя и фамилия</TableCell>
                <TableCell align="left">Должность</TableCell>
                <TableCell align="left">Подразделение</TableCell>
                <TableCell align="center">Действие</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {conferenceUsers.map((user, i) => {
                return (
                  <TableRow key={user.userId}>
                    <TableCell align="left">{i + 1}</TableCell>
                    <TableCell component="th" scope="row">
                      <Box display="flex" alignItems="center">
                        <Avatar alt={user.userName} src="/broken-image.jpg" className={classes.small} style={{backgroundColor: randomColor()}}>
                            {user.userName.substr(0, 1)}
                        </Avatar>
                        {user.userName}
                      </Box>
                    </TableCell>
                    <TableCell align="left">{user.positionName}</TableCell>
                    <TableCell align="left">{user.departmentName}</TableCell>
                    <TableCell align="center"><Box style={{cursor: 'pointer'}} color="#FF827B" onClick={() => deleteClick(user)}>Удалить</Box></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        }
      </TableContainer>
    );
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& a': {
        color: '#085CFF',
        textDecoration: 'none',
        '&:hover': {
          textDecoration: 'underline'
        }
      }
    },
    head: {
        backgroundColor: '#F4F4F4',
        '& .MuiTableCell-root': {
          color: 'rgba(0, 0, 0, 0.54)',
          fontWeight: 700
        }
    },
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: 20,
      fontSize: 12,
    }
  }),
);

const mapStateToProps = (state: RootState) => ({
    conferenceUsers: state.conferences.conferenceUsers,
    searchUsers: state.account.searchUsers,
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
  deleteConferenceUsersAction: (conferenceUsers: SearchUsers[]) => dispatch(actions.conferences.deleteConferenceUsersAction(conferenceUsers)),
  searchUsersAction: (searchUsers: SearchUsers[]) => dispatch(actions.account.searchUsersAction(searchUsers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalTable)