import { FC, useContext } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { alpha } from '@material-ui/core/styles';
import ConfigurationContext from 'src/contexts/ConfigurationContext';
import useSettings from 'src/hooks/useSettings';
import MinusIcon from '../icons/Minus';
import Logo from './Logo';

const getSections = (eulerAddress) => [
  {
    title: 'Menu',
    links: [
      {
        title: 'Home Page',
        href: 'https://euler.tools',
      },
    ],
  },
  {
    title: 'Links',
    links: [
      {
        title: 'Github',
        href: 'https://github.com/eulertools',
      },
      {
        title: 'Token Contract',
        href: `https://bscscan.com/token/${eulerAddress}`,
      },
    ],
  },
  {
    title: 'Social',
    links: [
      {
        title: 'Medium',
        href: 'https://medium.com/@euler.tools',
      },
      {
        title: 'Twitter',
        href: 'https://twitter.com/eulertools',
      },
      {
        title: 'Telegram',
        href: 'https://t.me/eulertools_news',
      },
    ],
  },
];

const Footer: FC = (props) => {
  const { settings } = useSettings();
  const { chain } = useContext(ConfigurationContext);
  const eulerAddress = chain.bsc.tokens.euler.address;

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        pb: 3,
        pt: {
          md: 6,
          xs: 3,
        },
      }}
      {...props}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid
            item
            md={3}
            sm={4}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              order: {
                md: 1,
                xs: 4,
              },
            }}
            xs={12}
          >
            {settings.theme === 'DARK' ? (
              <Logo format="eulertools-navbar-logo-mode-night" heightValue={37} />
            ) : (
              <Logo format="eulertools-navbar-logo" heightValue={37} />
            )}
            <Box sx={{ mt: 1 }}>
              <Typography color="textSecondary" variant="caption">
                Euler Tools
                <br />
                general@euler.tools
              </Typography>
            </Box>
          </Grid>
          {getSections(eulerAddress).map((section, index) => (
            <Grid
              item
              key={section.title}
              md={3}
              sm={4}
              sx={{
                order: {
                  md: index + 2,
                  xs: index + 1,
                },
              }}
              xs={12}
            >
              <Typography color="textSecondary" variant="overline">
                {section.title}
              </Typography>
              <List disablePadding>
                {section.links.map((link) => (
                  <ListItem
                    disableGutters
                    key={link.title}
                    sx={{
                      pb: 0,
                      pt: 1,
                    }}
                  >
                    <ListItemAvatar
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        minWidth: 0,
                        mr: 0.5,
                      }}
                    >
                      <MinusIcon color="primary" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Link href={link.href} color="textPrimary" variant="subtitle2">
                          {link.title}
                        </Link>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          ))}
        </Grid>
        <Divider
          sx={{
            borderColor: (theme) => alpha(theme.palette.primary.contrastText, 0.12),
            my: 6,
          }}
        />
        <Typography color="textSecondary" variant="caption">
          All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
