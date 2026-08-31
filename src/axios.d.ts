// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from 'axios';

declare module 'axios' {
  // Extend config
  export interface AxiosRequestConfig {
    // Custom property
    prefix?: string;
  }
}
