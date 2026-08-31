import { FC } from 'react';
import { Box } from '@material-ui/core';

const Disclaimer: FC = () => (
  <Box paddingY="1rem">
    <p>
      All content available on our website, hyperlinked websites, applications, forums, blogs, social media accounts,
      and other platforms associated with Euler Tools is intended solely to provide you with general information.
    </p>
    <br />
    <p>
      We make no warranties of any kind with respect to our content, including, but not limited to, the accuracy and
      currency of the information provided. None of the content provided should be taken as financial or legal advice.
      Any use or reliance you place on our content is solely at your own risk. Euler Tools will not accept liability for
      any loss or damage as a result of your trading or your reliance on the information contained within this website.
    </p>
    <br />
    <p>
      Before deciding to trade in financial instruments or cryptocurrencies you should be fully informed of the risks
      and costs associated with trading the financial markets, carefully consider your investment objectives, level of
      experience, and risk appetite, and seek professional advice where needed.
    </p>
    <br />
    <p>
      By accessing or using our tool, you signify that you have read, understand, and agree to be bound by our Terms &
      Conditions, and our Privacy Policy in its entirety. If you do not agree, you are not authorized to access or use
      our tool.
    </p>
  </Box>
);

export default Disclaimer;
