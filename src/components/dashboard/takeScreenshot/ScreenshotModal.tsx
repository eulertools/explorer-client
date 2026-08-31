import React, { FC } from 'react';
import { IconButton } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/HighlightOff';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 0,
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      maxHeight: '70vh',
      maxWidth: '70vw',
      zIndex: 1,
      position: 'relative',
    },
    closeIcon: {
      position: 'absolute',
      top: 8,
      right: 8,
    },
  }),
);

const ScreenshotModal: FC<{ image: Blob; imageSrc: string; setImage: React.Dispatch<string> }> = (props) => {
  const classes = useStyles();
  const { image, imageSrc, setImage } = props;

  function handleModalClose() {
    setImage(null);
  }

  function copyImageToClipboard() {
    const clipboardItem = new ClipboardItem({ [image.type]: image as any });
    navigator.clipboard.write([clipboardItem]);
  }

  return (
    <>
      {image ? (
        <Modal
          open
          className={classes.modal}
          onClose={handleModalClose}
          aria-labelledby="captured-image"
          aria-describedby="captured-image-desc"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in>
            <div id="image-container" className={classes.paper}>
              <img src={imageSrc} alt="captured" width="100%" height="auto" />
              <IconButton className={classes.closeIcon} onClick={handleModalClose}>
                <CloseIcon fontSize="large" color="secondary" />
              </IconButton>
              <Grid container position="absolute" bottom={24} justifyContent="center">
                <Button color="secondary" variant="contained" onClick={copyImageToClipboard}>
                  Copy to Clipboard
                </Button>
              </Grid>
            </div>
          </Fade>
        </Modal>
      ) : null}
    </>
  );
};

export default ScreenshotModal;
