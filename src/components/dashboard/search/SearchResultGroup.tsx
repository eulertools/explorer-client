import { FC } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ISource, IESSearchItem } from 'src/types/search';
import Row from './Row';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    noResults: {
      marginTop: theme.spacing(2),
    },
    resultsNumber: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(1),
    },
  }),
);

interface ResultCategoryProps {
  source: ISource;
  onClose: () => void;
}

const ResultCategory: FC<ResultCategoryProps> = ({ source, onClose }) => {
  let body = null;
  switch (source.category) {
    case 'pool':
      body = <Row source={source} onClose={onClose} path={`/pair/${source.address}`} />;
      break;
    case 'pair':
      body = <Row source={source} onClose={onClose} path={`/pair/${source.address}`} />;
      break;
    case 'token':
      body = <Row source={source} onClose={onClose} path={`/token/${source.address}`} />;
      break;
    case 'lp-token':
      body = <Row source={source} onClose={onClose} path={`/address/${source.address}`} />;
      break;
    default:
      body = <Row source={source} onClose={onClose} path={`/address/${source.address}`} />;
      break;
  }
  return body;
};

interface SearchResultGroupProps {
  results: IESSearchItem[];
  closeDrawer: () => void;
}

const SearchResultGroup: FC<SearchResultGroupProps> = ({ results, closeDrawer }) => {
  const classes = useStyles();

  if (results === null || !results.length) {
    return null;
  }

  return (
    <>
      <Typography className={classes.resultsNumber} color="textPrimary" textAlign="center">
        {results.length.toString().toUpperCase()} RESULTS
      </Typography>
      {results.map((item) => {
        const { _source: source } = item;
        // eslint-disable-next-line no-underscore-dangle
        return <ResultCategory key={item._id} source={source} onClose={closeDrawer} />;
      })}
    </>
  );
};

export default SearchResultGroup;
