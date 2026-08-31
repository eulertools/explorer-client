import clsx from 'clsx';
import { FC } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { selectFilterState } from 'src/selectors/filters';
import { UITableID } from 'src/slices/filter.types';
import { useSelector } from 'src/store';
import { INFTItem } from 'src/types/nft';

const useStyles = makeStyles((theme) => ({
  cardImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
  },
  cardMedia: {
    width: 'auto',
    height: '383px',
    margin: 'auto',
    [theme.breakpoints.down('md')]: {
      width: 'inherit',
      height: 'auto',
    },
  },
  cardMediaCompact: {
    height: '250px',
  },
}));

interface NFTCardProps {
  nft: INFTItem;
}

export const NFTCard: FC<NFTCardProps> = ({ nft }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { network } = useParams();
  const tableId = UITableID.nft_list;
  const filters = useSelector(selectFilterState(tableId));

  const onClick = () => navigate(`/${network}/nft/${nft.address}/${nft.token_id}`);

  // TODO: Expand upon details shown in card for Collections Detail Grid.
  return (
    <Grid item display="flex">
      <Card className={classes.cardImage}>
        <CardActionArea onClick={onClick}>
          <CardMedia
            className={clsx(classes.cardMedia, { [classes.cardMediaCompact]: filters.filter.compact })}
            component="img"
            image={nft.metadata.image}
          />
          <CardContent>
            <Grid container display="flex" flexDirection="row" spacing={0.5}>
              <Grid item xs={12}>
                <Typography color="textPrimary" fontSize={filters.filter.compact ? 14 : 18} fontWeight="bold">
                  #{nft.token_id}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};
