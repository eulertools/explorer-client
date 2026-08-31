import { FC } from 'react';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import avatar from 'src/assets/Avatar1.png';

const useStyles = makeStyles(() => ({
  avatar: {
    height: '80px',
    objectFit: 'contain',
  },
  commentsInputRoot: {
    backgroundColor: '#f9f9f9',
  },
}));

const BlockDetailComments: FC = () => {
  const classes = useStyles();

  return (
    <Box>
      <Grid p={3} container spacing={2}>
        <Grid item xs={2}>
          <Box display="flex" justifyContent="center">
            <img src={avatar} alt="Avatar" className={classes.avatar} />
          </Box>
        </Grid>
        <Grid item xs={10}>
          <TextField
            fullWidth
            name="comments"
            required
            multiline
            rows={4}
            variant="outlined"
            placeholder="Type your comment here"
            classes={{ root: classes.commentsInputRoot }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlockDetailComments;
