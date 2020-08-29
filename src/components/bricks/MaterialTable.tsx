import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import { DocIcon } from '../../icons/menuIcons';

function createData(title: string, owner: string, date: string, size: string ) {
  return { title, owner, date, size };
}

const rows = [
  createData('SWOT - анализ состояния экономики', 'Айтурган А.В.', '21 февраля 2020',  '3 Мб'),
  createData('Видео-презентация выступления пр. Вишневского А.В.', 'Айтурган А.В.', '21 февраля 2020',  '3 Мб'),
  createData('Таблица ввода раличных данных исследований', 'Айтурган А.В.', '21 февраля 2020',  '3 Мб'),
  createData('Презентация по экономическому росту', 'Айтурган А.В.', '21 февраля 2020',  '3 Мб'),
];

const MaterialTable = () => {
    const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table>
        <TableHead className={classes.head}>
          <TableRow>
            <TableCell align="left">№</TableCell>
            <TableCell>Название</TableCell>
            <TableCell align="left">Владелец</TableCell>
            <TableCell align="left">Последние изменение</TableCell>
            <TableCell align="left">Размер</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              <TableCell align="left">{i + 1}</TableCell>
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center">
                  <span className={classes.icon}><DocIcon /></span>
                  <NavLink to="/materials">{row.title}</NavLink>
                </Box>
              </TableCell>
              <TableCell align="left">{row.owner}</TableCell>
              <TableCell align="left">{row.date}</TableCell>
              <TableCell align="left">{row.size}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
    icon: {
      marginRight: 12,
      display: 'flex',
    }
  }),
);

export default MaterialTable