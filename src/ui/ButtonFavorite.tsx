import { memo, useCallback, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { useModal } from 'src/components/modal';
import AuthDialog from 'src/components/modal/dialogs/AuthDialog';
import useAuth from 'src/hooks/useAuth';
import gtm from 'src/lib/gtm';
import { getFavoriteById, isFavoriteById } from 'src/selectors/favorites';
import { getFavorites, removeFavorite, addFavorite, FavoriteItem } from 'src/slices/user/favorites';
import { useDispatch } from 'src/store';
import { loggerWarn } from 'src/utils/logger';

const useStyles = makeStyles((theme) => ({
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  rightTableHeader: {
    fontWeight: 500,
    textAlign: 'right',
  },
  cell: {
    width: '100%',
  },
  positivePriceChange: {
    color: theme.palette.success.main,
  },
  negativePriceChange: {
    color: theme.palette.error.main,
  },
  starred: {
    color: '#EEBB21',
  },
}));

export interface ButtonFavoriteProps {
  idFavorite: string | number;
  addFavoriteItem: FavoriteItem;
  favoriteIcon?: ReactNode;
  favoriteIconStarred?: ReactNode;
}

export const ButtonFavorite = memo(
  ({ idFavorite, addFavoriteItem, favoriteIcon, favoriteIconStarred }: ButtonFavoriteProps) => {
    const classes = useStyles();
    const { showModal } = useModal();
    const { isAuthenticated } = useAuth();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isFavorite, setIsFavorite] = useState(isFavoriteById(idFavorite));

    const normal = favoriteIcon || <StarBorderIcon />;
    const starred = favoriteIconStarred || <StarIcon className={classes.starred} />;

    const _removeFavorite = useCallback(async () => {
      const fItem = getFavoriteById(idFavorite);

      // If we can't find it, it's bad data
      if (!fItem) {
        loggerWarn(`Favorite item was saved with inconsistent data ${idFavorite}`);
        return;
      }

      await dispatch(removeFavorite(fItem.identifier));

      await dispatch(getFavorites());

      setIsFavorite(false);
      gtm.push({ state: 'off' });
    }, [idFavorite]);

    const _addFavorite = useCallback(async () => {
      try {
        await dispatch(addFavorite(addFavoriteItem));
        setIsFavorite(true);
        gtm.push({ event: 'add_to_favorites', token: addFavoriteItem.name, state: 'on' });
      } catch {
        setIsFavorite(false);
      }
    }, [addFavoriteItem]);

    return (
      <Tooltip title={t('Favorites')}>
        <IconButton
          aria-label={t('Add to Favorites')}
          onClick={(ev) => {
            ev.stopPropagation();

            if (!isAuthenticated) {
              const authModal = showModal(AuthDialog, {
                onClose: () => {
                  authModal.hide();
                },
              });
              return;
            }

            if (!isFavorite) {
              _addFavorite();
              return;
            }

            _removeFavorite();
          }}
        >
          {!isFavorite ? normal : starred}
        </IconButton>
      </Tooltip>
    );
  },
  (pp, np) => pp.idFavorite === np.idFavorite,
);
