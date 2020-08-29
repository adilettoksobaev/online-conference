import React, { Dispatch, useState } from 'react';
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
import { AccountAPI } from '../../api/AccountAPI';
import { SearchUsers, UserAccount } from '../../store/Account/types';
import StaffModal from '../StaffModal/StaffModal';
import MaskedInput from 'react-text-mask';
import { randomColor } from '../../utils/randomColor';

type Props = ReturnType<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps> & {
  search: string;
  newUsers: SearchUsers[]
}

const PeopleTable: React.FC<Props> = ({ newUsers, sessionId, getUserAccountAction }) => {
    const classes = useStyles();
    const [editOpen, setEditOpen] = useState(false);

    const handleEditOpen = (userId: number) => {
        setEditOpen(true);
        if(sessionId) {
            AccountAPI.getUserAccount(sessionId, userId).then(data => {
                getUserAccountAction(data);
            })
        }
    };

    return (
      <>
      <TableContainer component={Paper} className={classes.root}>
        <Table>
          <TableHead className={classes.head}>
            <TableRow>
              <TableCell align="left">№</TableCell>
              <TableCell>Имя и фамилия</TableCell>
              <TableCell align="left">Должность</TableCell>
              <TableCell align="left">Номер телефона</TableCell>
              <TableCell align="left">Подразделение</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {newUsers.map((user, i) => (
                <TableRow key={user.userId}>
                  <TableCell align="left">{i + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    <Box display="flex" alignItems="center">
                        <Avatar alt={user.userName} src="/broken-image.jpg" className={classes.small} style={{backgroundColor: randomColor()}}>
                            {user.userName.substr(0, 1)}
                        </Avatar>
                      <Box color="#2290E0" style={{cursor: 'pointer'}} onClick={() => handleEditOpen(user.userId)}>{user.userName}</Box>
                    </Box>
                  </TableCell>
                  <TableCell align="left">{user.positionName}</TableCell>
                  <TableCell align="left">
                    <MaskedInput
                      className="disabledInput"
                      value={user.phone}
                      disabled
                      mask={['+', /[1-9]/, ' ', /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, ' ' , /\d/, /\d/, ' ' , /\d/, /\d/]}
                      guide={false}
                      placeholder="+7 777 555 55 55"
                      showMask
                    />
                  </TableCell>
                  <TableCell align="left">{user.departmentName}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StaffModal 
          editOpen={editOpen}
          setEditOpen={setEditOpen} />
      </>
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
  sessionId: state.auth.sessionId
});

const mapDispatchToProps = (dispatch: Dispatch<Action> & ThunkDispatch<any, any, AnyAction>) => ({
  getUserAccountAction: (userAccount: UserAccount) => dispatch(actions.account.getUserAccountAction(userAccount)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PeopleTable)