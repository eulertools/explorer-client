import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { AppSkeleton } from 'src/components/templates';
import { PageTitle } from 'src/ui/PageTitle';

const PrivacyPolicyPage: FC = () => (
  <AppSkeleton>
    <PageTitle pageTitle="Terms & Conditions" />
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <RouterLink to="/">
          <Logo format="eulertools-navbar-logo" heightValue={60} />
        </RouterLink>
      </Box>
      <Typography variant="h2" textAlign="center" marginBottom={3}>
        Privacy Policy
      </Typography>
      <Typography>
        This privacy policy (“Policy”) describes how BARSUM INTEGRADORA EMPRESARIAL S.L. (“Company”, “we”, “our”, or
        “us”) collects, uses, shares, and stores personal information of users of its website and associated tool:
        https://euler.tools (the “Site”). This Policy applies to the Site, applications, products, and services
        (collectively, “Services”) on or in which it is posted, linked or referenced.
      </Typography>
      <Typography>
        By using the Services, you accept the terms of this Policy and our Terms of Use, and consent to our collection,
        use, disclosure, and retention of your information as described in this Policy. If you have not done so already,
        please also review our terms of use. The terms of use contain provisions that limit our liability to you and
        require you to resolve any dispute with us on an individual basis and not as part of any class or representative
        action.
      </Typography>
      <Typography>
        IF YOU DO NOT AGREE WITH ANY PART OF THIS PRIVACY POLICY OR OUR TERMS OF USE, THEN PLEASE DO NOT USE ANY OF THE
        SERVICES.
      </Typography>
      <Typography>
        Please note that this Policy does not apply to information collected through third-party websites or services
        that you may access through the Services or that you submit to us through email, text message, or other
        electronic message or offline.
      </Typography>
      <Typography>
        If you visit the Site from the European Union (EU), see our Notice to EU Data Subjects below for our legal bases
        for processing and transferring your data.
      </Typography>
      {/* Sections */}
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        WHAT WE COLLECT
      </Typography>
      <Typography>
        🛑 Email address, name, and any other Personal Information you provide to Us when communicating with us. Such
        Personal Information is used only for communication with you;
      </Typography>
      <Typography>
        🛑 IP address, MAC address, cookie identifiers, domain server, data related to usage, performance, site
        security, traffic patterns, location information, browser, and device information only when you are using our
        services at our Site and App;
      </Typography>
      <Typography>
        🛑 Transaction information, such details about purchases you make through the Service and billing details;
      </Typography>
      <Typography>
        🛑 Usage information, such as information about how you use the Service and interact with us;
      </Typography>
      <Typography>
        🛑 Technical information, such as your blockchain wallet addresses, application programming interface (API)-key,
        and network information regarding transactions.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Information Automatically Collected.
      </Typography>
      <Typography>
        We may automatically record certain information about how you use our Site (we refer to this information as “Log
        Data“). Log Data may include information such as a user’s Internet Protocol (IP) address, device, and browser
        type, operating system, the pages or features of our Site to which a user browsed and the time spent on those
        pages or features, the frequency with which the Site is used by a user, search terms, the links on our Site that
        a user clicked on or used, and other statistics. We use this information to administer the Service, and we
        analyze (and may engage third parties to analyze) this information to improve and enhance the Service by
        expanding its features and functionality and tailoring it to our users’ needs and preferences.
      </Typography>
      <Typography>
        We may use cookies, local storage, or similar technologies to analyze trends, administer the Site, track users’
        movements around the Site, and gather demographic information about our user base as a whole. Users can control
        the use of cookies and local storage at the individual browser level. For more information, please see our
        Cookies Policy.
      </Typography>
      <Typography>
        We also may use Google Analytics to help us offer you an optimized user experience. You can find more
        information about Google Analytics use of your personal data here:
        https://www.google.com/analytics/terms/us.html.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        USE OF PERSONAL INFORMATION
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        To provide our service.
      </Typography>
      <Typography marginBottom={2}>We will use your personal information in the following ways:</Typography>
      <Typography>🛑 To enable you to access and use the Services</Typography>
      <Typography>🛑 To provide and deliver products and services that you may request.</Typography>
      <Typography>🛑 To process and complete transactions and send you related information</Typography>
      <Typography>
        🛑 To send information, including confirmations, technical notices, updates, security alerts, and support and
        administrative messages.
      </Typography>
      <Typography>🛑 To comply with law</Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        To communicate with you.
      </Typography>
      <Typography>
        We use your personal information to communicate about promotions, upcoming events, and other news about products
        and services offered by our selected partners and us.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        To optimize our platform.
      </Typography>
      <Typography>
        To optimize your user experience, we may use your personal information to operate, maintain, and improve our
        Services. We may also use your information to respond to your comments and questions regarding the Services and
        provide you and other users with general customer service.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        For compliance, fraud prevention, and safety
      </Typography>
      <Typography>
        We may use your personal information to protect, investigate, and deter fraudulent, unauthorized, or illegal
        activity.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        SHARING OF PERSONAL INFORMATION
      </Typography>
      <Typography marginBottom={2}>
        We do not share the personal information that you provide us with other organizations without your express
        consent, except as described in this Privacy Policy. We disclose personal information to third parties under the
        following circumstances:
      </Typography>
      <Typography>
        🛑 Business Transfers. We may share personal information when we do a business deal or negotiate a business deal
        involving the sale or transfer of all or a part of our business or assets. These deals can include any merger,
        financing, acquisition, or bankruptcy transaction, or proceeding.
      </Typography>
      <Typography>
        🛑 Compliance with Laws and Law Enforcement; Protection and Safety. We may share personal information for legal,
        protection, and safety purposes.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        HOW INFORMATION IS SECURED
      </Typography>
      <Typography>
        We retain the information we collect as long as it is necessary and relevant to fulfill the purposes outlined in
        this privacy policy. In addition, we maintain personal data to comply with applicable law where required,
        prevent fraud, resolve disputes, troubleshoot problems, assist with any investigation, enforce our Terms of Use,
        and other actions permitted by law. To determine the appropriate retention period for personal information, we
        consider the amount, nature, and sensitivity of the personal information, the potential risk of harm from
        unauthorized use or disclosure of your personal information, the purposes for which we process your personal
        information, and whether we can achieve those purposes through other means, and the applicable legal
        requirements.
      </Typography>
      <Typography>
        We employ industry-standard security measures designed to protect the security of all information submitted
        through the Services. However, the security of information transmitted through the internet can never be
        guaranteed. We are not responsible for any interception or interruption of any communications through the
        internet or for changes to or losses of data. Users of the Services are responsible for maintaining the security
        of any password, biometrics, the user ID, or another form of authentication involved in obtaining access to
        password-protected or secure areas of any of our digital services. In order to protect you and your data, we may
        suspend your use of any of the Services, without notice, pending an investigation, if any breach of security is
        suspected.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        INFORMATION CHOICES AND CHANGES
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Accessing, Updating, Correcting, and Deleting your Information
      </Typography>
      <Typography>
        You may access information that you have voluntarily provided through your account on the Services and review,
        correct, or delete it by sending a request to general@euler.tools. You can request to change contact choices,
        opt-out of our sharing with others, and update your personal information and preferences.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Tracking Technologies Generally
      </Typography>
      <Typography>
        Regular cookies may generally be disabled or removed by tools available as part of most commercial browsers, and
        in some instances blocked in the future by selecting specific settings. For more information, please see our
        Cookies Policy.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Google Analytics
      </Typography>
      <Typography>
        You may exercise choices regarding using cookies from Google Analytics by going to
        https://tools.google.com/dlpage/gaoptout and downloading the Google Analytics Opt-out Browser Add-on.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        CONTACT INFORMATION
      </Typography>
      <Typography>
        We welcome your comments or questions about this Policy, and you may contact us at: general@euler.tools.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        CHANGES TO THIS PRIVACY POLICY
      </Typography>
      <Typography>
        We may change this privacy policy at any time. We encourage you to periodically review this page for the latest
        information on our privacy practices. If we make any changes, we will change the Last Updated date above.
      </Typography>
      <Typography>
        Any modifications to this Privacy Policy will be effective upon our posting of the new terms and upon
        implementation of the changes to the Site (or as otherwise indicated at the time of posting). In all cases, your
        continued use of the Site or Services after the posting of any modified Privacy Policy indicates your acceptance
        of the terms of the modified Privacy Policy.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        ELIGIBILITY
      </Typography>
      <Typography>
        If you are under the age of majority in your jurisdiction of residence, you may use the Services only with the
        consent of or under the supervision of your parent or legal guardian. Consistent with the requirements of the
        Children’s Online Privacy Protection Act (COPPA), if we learn that we have received any information directly
        from a child under age 13 without first receiving his or her parent’s verified consent, we will use that
        information only to respond directly to that child (or his or her parent or legal guardian) to inform the child
        that he or she cannot use the Site and subsequently we will delete that information.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        NOTICE TO EU DATA SUBJECTS
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Personal Information
      </Typography>
      <Typography>
        With respect to EU data subjects, “personal information,” as used in this Privacy Policy, is equivalent to
        “personal data” as defined in the European Union General Data Protection Regulation (GDPR).
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Sensitive Data
      </Typography>
      <Typography>
        Some of the information you provide us may constitute sensitive data as defined in the GDPR (also referred to as
        special categories of personal data), including identification of your race or ethnicity on government-issued
        identification documents.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Legal Bases for Processing
      </Typography>
      <Typography>
        We only use your personal information as permitted by law. We are required to inform you of the legal bases of
        our processing of your personal information, which are described in the table below. If you have questions about
        the legal bases under which we process your personal information, contact us at general@euler.tools.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Use for New Purposes
      </Typography>
      <Typography>
        We may use your personal information for reasons not described in this Privacy Policy, where we are permitted by
        law to do so and where the reason is compatible with the purpose for which we collected it. If we need to use
        your personal information for an unrelated purpose, we will notify you and explain the applicable legal basis
        for that use. If we have relied upon your consent for a particular use of your personal information, we will
        seek your consent for any unrelated purpose.
      </Typography>
      <Typography>
        You can submit these requests by email to general@euler.tools. We may request specific information from you to
        help us confirm your identity and process your request. Applicable law may require or permit us to decline your
        request. If we decline your request, we will tell you why subject to legal restrictions. If you would like to
        submit a complaint about our use of your personal information or respond to your requests regarding your
        personal information, you may contact us at general@euler.tools or submit a complaint to the data protection
        regulator in your jurisdiction.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Your Rights
      </Typography>
      <Typography marginBottom={2}>
        Under the GDPR, you have certain rights regarding your personal information. You may ask us to take the
        following actions in relation to your personal information that we hold:
      </Typography>
      <Typography>
        🛑 Opt-out. Stop sending you direct marketing communications which you have previously consented to receive. We
        may continue to send you Service-related and other non-marketing communications.
      </Typography>
      <Typography>
        🛑 Access. Provide you with information about our processing of your personal information and give you access to
        your personal information.
      </Typography>
      <Typography>🛑 Correct. Update or correct inaccuracies in your personal information.</Typography>
      <Typography>🛑 Delete. Delete your personal information.</Typography>
      <Typography>
        🛑 Transfer. Transfer a machine-readable copy of your personal information to you or a third party of your
        choice.
      </Typography>
      <Typography>🛑 Restrict. Restrict the processing of your personal information.</Typography>
      <Typography>
        🛑 Object. Object to our reliance on our legitimate interests as the basis of our processing of your personal
        information that impacts your rights.
      </Typography>
      <Typography variant="h6" marginBottom={2} marginTop={2}>
        Cross-Border Data Transfer
      </Typography>
      <Typography>
        Please be aware that your personal data will be transferred to, processed, and stored in Spain. Data protection
        laws in Spain may be different from those in your country of residence. You consent to the transfer of your
        information, including personal information, to Spain as set forth in this Privacy Policy by visiting our Site
        or using our service.
      </Typography>
      <Typography>
        Whenever we transfer your personal information out of the EEA to the U.S. or countries not deemed by the
        European Commission to provide an adequate level of personal information protection, the transfer will be based
        on a data transfer mechanism recognized by the European Commission as providing adequate protection for personal
        information. Please contact us if you want further information on the specific mechanism used by us when
        transferring your personal data out of the EEA.
      </Typography>
      <Typography variant="h4" marginBottom={2} marginTop={2}>
        COOKIES
      </Typography>
      <Typography>
        You can set your browser to refuse all or some browser cookies or to alert you when websites set or access
        cookies. Please note that some parts of the Site may become inaccessible or not function properly if you disable
        or refuse cookies.
      </Typography>
    </Container>
  </AppSkeleton>
);

export default PrivacyPolicyPage;
