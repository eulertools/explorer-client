import { EulerIconRefresh, EulerIconTrash } from '@eulertools/ui';
import { FormikErrors } from 'formik';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Icon, IconButton, Typography, useTheme } from '@material-ui/core';
import bytesToSize from 'src/utils/bytesToSize';

interface FilePreviewProps {
  file: File;
  errors: string | string[] | FormikErrors<any> | FormikErrors<any>[];
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
}

export const FilePreview: FC<FilePreviewProps> = ({ ...props }: FilePreviewProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Box
      display="flex"
      bgcolor={theme.palette.background.paper}
      border={`2px dashed ${theme.palette.divider}`}
      borderRadius={theme.spacing(2)}
      py={2}
      pr={2}
      pl={props.errors ? 2 : 3}
      gap={props.errors ? 2 : 3}
      alignItems="center"
    >
      {props.errors || props.file.type.includes('image') ? (
        <img
          style={{
            borderRadius: theme.shape.borderRadius,
            objectFit: props.errors ? 'contain' : 'cover',
          }}
          src={props.errors ? '/static/error/file_error.svg' : URL.createObjectURL(props.file)}
          alt={t('Image preview')}
          width="22%"
          height="78px"
        />
      ) : null}
      {!props.errors && props.file.type.includes('video') ? (
        <video width="33%">
          <source src={URL.createObjectURL(props.file)} type="video/mp4" />
          <track kind="captions" srcLang="en" />
        </video>
      ) : null}

      <Box width="100%">
        <Typography variant="h6" color={theme.palette.text.primary}>
          {props.file.name}
        </Typography>
        <Typography color={theme.palette.text.secondary}>{props.errors || bytesToSize(props.file.size, 2)}</Typography>
      </Box>
      <IconButton
        onClick={() => {
          props.setFieldValue('file', null);
        }}
        sx={{
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Icon>{props.errors ? <EulerIconRefresh /> : <EulerIconTrash />}</Icon>
      </IconButton>
    </Box>
  );
};
