import { AxiosResponse } from 'axios';
import { getUrlToPost } from '../apicalls/file';
import { putImage } from '../apicalls/nft';

export const checkImage = async (img, nft_api) => {
  const { presigned_url, identifier } = (await getUrlToPost(img, nft_api)).data;
  const reader = new FileReader();
  reader.readAsDataURL(img);
  await new Promise<AxiosResponse>((resolve, reject) => {
    reader.onload = async () => {
      const split = (reader.result as string).split(',');
      const image = Buffer.from(split[1], 'base64');
      try {
        resolve(await putImage(image, presigned_url));
      } catch (e) {
        reject(e);
      }
    };
  });
  return identifier;
};
