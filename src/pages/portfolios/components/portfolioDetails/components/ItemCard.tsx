import { FC } from 'react';
import Card from '@material-ui/core/Card';

const ItemCard: FC = ({ children }) => <Card sx={{ marginY: 2 }}>{children}</Card>;

export default ItemCard;
