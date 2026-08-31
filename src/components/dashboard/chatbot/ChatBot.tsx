import React, { FC, useState } from 'react';
import { makeStyles, createStyles, Box, ClickAwayListener } from '@material-ui/core';
import FloatingButton from 'src/ui/FloatingButton';

declare global {
  interface Window {
    hsConversationsSettings: any;
    HubSpotConversations: any;
  }
}
const initChatBot = () => {
  window.hsConversationsSettings = {
    loadImmediately: true,
    inlineEmbedSelector: '#my-messages-container',
    enableWidgetCookieBanner: true,
    disableAttachment: false,
  };
};

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: 'absolute',
      bottom: '1vh',
      right: '1.5vw',
    },
    chat: {
      position: 'absolute',
      bottom: '65px',
      right: '0',
      width: '350px',
      height: '500px',
      zIndex: 1301,
      '& #hubspot-conversations-inline-parent': {
        border: 0,
      },
      '& #hubspot-conversations-inline-parent iframe': {
        boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
        borderRadius: '10px',
        width: '350px',
        height: '500px',
        border: 0,
      },
    },
    [theme.breakpoints.down('sm')]: {
      chat: {
        width: '98vw',
        height: '70vh',
        '& #hubspot-conversations-inline-parent iframe': {
          width: '98vw',
          height: '70vh',
        },
      },
    },
    show: {
      display: 'block',
    },
    hide: {
      display: 'none',
    },
  }),
);

const ChatBot: FC = () => {
  initChatBot();
  const classes = useStyles();

  const [showChat, setShowChat] = useState(false);

  const onChatToggle = () => {
    const parentElement = document.querySelector('#my-messages-container');
    // Check if the widget has been removed (in some situations, like going to another page, it deletes itself)
    if (!parentElement.hasChildNodes()) {
      // Reload widget
      window.HubSpotConversations.widget.remove();
      window.HubSpotConversations.widget.load({ widgetOpen: true });
    }
    setShowChat((prevValue) => !prevValue);
  };

  const onChatClose = () => {
    setShowChat(false);
  };

  return (
    <Box className={classes.container}>
      <ClickAwayListener onClickAway={onChatClose}>
        <div>
          <div className={`${showChat ? classes.show : classes.hide} ${classes.chat}`} id="my-messages-container" />
          <FloatingButton ariaLabel="send-feedback" color="primary" onClick={onChatToggle} />
        </div>
      </ClickAwayListener>
    </Box>
  );
};

export default ChatBot;
