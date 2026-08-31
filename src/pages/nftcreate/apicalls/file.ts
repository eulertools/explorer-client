import axios from 'src/lib/axios';

export const getUrlToPost = async (file: File, url) => {
  const body = {
    contentType: file.type,
  };
  return axios.privateFetchClient.post('', body, { baseURL: url, prefix: 'presigned-file' });
};
