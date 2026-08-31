import React, { useCallback, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import { addItemToPortfolio, createPortfolio, IPortfolio, IPortfolioDetailsItem } from 'src/slices/user/portfolios';
import { useDispatch, useSelector } from 'src/store';

interface IProps extends DialogProps {
  item: IPortfolioDetailsItem;
  onCancel: () => void;
}

const ChoosePortfolio = ({ onCancel, item, ...dialogProps }: IProps) => {
  const dispatch = useDispatch();
  const { portfolios = null } = useSelector((state) => state.portfolios);

  const [selected, setSelected] = useState<IPortfolio>(null);
  const [portfolioName, setPortfolioName] = useState<string>(null);

  const onConfirm = useCallback(async () => {
    if (selected) {
      await dispatch(addItemToPortfolio(item, selected.identifier));
      onCancel();
    }
  }, [selected]);

  const handleChange = (event) => {
    const portfolio = portfolios.find((p) => p.identifier === event?.target?.value);

    if (portfolio) setSelected(portfolio);
  };

  const handleCreatePortfolio = async () => {
    if (!portfolioName) {
      return;
    }

    const newPortfolio = ((await dispatch(createPortfolio({ name: portfolioName }))) as unknown) as IPortfolio;
    setSelected(newPortfolio);
  };

  const hasPortfolios = !!portfolios.length;

  return (
    <Dialog fullWidth maxWidth="xs" {...dialogProps}>
      <DialogTitle>Choose a Portfolio</DialogTitle>
      <DialogContent>
        {hasPortfolios ? (
          <FormControl fullWidth>
            <InputLabel id="portfolio-select-label">Select a portfolio</InputLabel>
            <Select
              label="Select a portfolio"
              labelId="portfolio-select-label"
              value={selected?.identifier || ''}
              onChange={handleChange}
            >
              {portfolios.map((portfolio) => {
                const itemAlreadyInPortfolio = !!portfolio.items?.find((i) => i.identifier === item.identifier);

                return (
                  <MenuItem disabled={itemAlreadyInPortfolio} key={portfolio.identifier} value={portfolio.identifier}>
                    {itemAlreadyInPortfolio ? (
                      <>
                        <CheckIcon fontSize="small" />
                        &nbsp;
                      </>
                    ) : null}
                    {portfolio.name}
                  </MenuItem>
                );
              })}
            </Select>
            <FormHelperText>To remove item from a portfolio, go to the &quot;Portfolios&quot; section</FormHelperText>
          </FormControl>
        ) : (
          <>
            <Typography marginBottom={2}>
              You don&apos;t have any portfolio available. You can create a new one just now:
            </Typography>
            <TextField
              fullWidth
              label="Portfolio Name"
              variant="outlined"
              onChange={(ev) => setPortfolioName(ev?.target?.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        {hasPortfolios ? (
          <Button disabled={!selected} onClick={onConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        ) : (
          <Button onClick={handleCreatePortfolio} color="primary" autoFocus>
            Create Portfolio
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChoosePortfolio;
