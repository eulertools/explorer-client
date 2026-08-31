import { useEulerTheme } from '@eulertools/ui';
import { FormikErrors, FormikTouched } from 'formik';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Box, Button, Divider, InputProps, Typography } from '@material-ui/core';
import useSettings from 'src/hooks/useSettings';
import { FilePreview } from './FilePreview';
import { FolderImage } from './FolderImage';

export interface InputFileFormikProps extends InputProps {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  errors?: string | string[] | FormikErrors<any> | FormikErrors<any>[] | null;
  touched?: boolean | FormikTouched<any> | FormikTouched<any>[] | null;
  value: File;
}

export const InputFileFormik: FC<InputFileFormikProps> = ({ ...props }: InputFileFormikProps) => {
  const { t } = useTranslation();
  const theme: any = useEulerTheme();
  const { settings } = useSettings();

  const onDrop = useCallback((acceptedFiles) => {
    props.setFieldValue(props.name, acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragAccept } = useDropzone({ onDrop, noClick: true });
  const dragColor = settings.theme === 'light' ? '#F3F4FF' : theme.palette.terciary[900];

  return (
    <>
      {!props.value ? (
        <>
          <Box
            {...getRootProps()}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            border={`2px dashed ${theme.palette.divider}`}
            borderRadius={theme.spacing(2)}
            p={5}
            gap={2}
            textAlign="center"
            color={theme.palette.text.secondary}
            bgcolor={isDragAccept ? dragColor : theme.palette.background.paper}
          >
            <FolderImage isDragAccept={isDragAccept} />
            <Typography variant="subtitle1" fontWeight={500} mt={1}>
              {t('Drag & drop to start uploading')}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {t('File types supported JPG, PNG')}{' '}
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {' '}
              {t('Max size 100 MB')}{' '}
            </Typography>

            <Box display="flex" justifyContent="center" gap={3} alignItems="center" width="100%" mb={2}>
              <Divider sx={{ width: '25%', height: '1' }} />
              <Typography variant="subtitle1" fontWeight={500}>
                {' '}
                {t('OR')}{' '}
              </Typography>
              <Divider sx={{ width: '25%', height: '1' }} />
            </Box>

            <Button variant="contained" component="label">
              Browse Files
              <input
                hidden
                accept="image/*"
                type="file"
                name={props.name}
                onBlur={props.onBlur}
                onChange={(event) => props.setFieldValue(props.name, event.currentTarget.files[0])}
                value=""
                {...getInputProps()}
              />
            </Button>
          </Box>
        </>
      ) : (
        <FilePreview file={props.value} errors={props.errors} setFieldValue={props.setFieldValue} />
      )}
    </>
  );
};
