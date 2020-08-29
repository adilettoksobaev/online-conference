import React from 'react';
import { Grid, Typography, Button, Box } from '@material-ui/core';

type Props = {
    title: string;
    buttonTitle: string;
}

const Title:React.FC<Props> = ({ title, buttonTitle }) => {
    return (
        <Grid container spacing={3} justify="space-between" alignItems="center">
            <Grid item xs={9}>
                <Typography variant="h2" component="h2" className="title">{title}</Typography>
            </Grid>
            <Grid item xs={3}>
                <Box textAlign="right">
                    <Button variant="contained" color="primary" disableElevation>{buttonTitle}</Button>
                </Box>
            </Grid>
        </Grid>
    )
}

export default Title