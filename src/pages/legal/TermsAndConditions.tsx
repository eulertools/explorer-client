import { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Logo from 'src/components/Logo';
import { AppSkeleton } from 'src/components/templates';
import { PageTitle } from 'src/ui/PageTitle';

const TermsAndConditionsPage: FC = () => (
  <AppSkeleton>
    <PageTitle pageTitle="Terms & Conditions" />
    <Container maxWidth="lg" sx={{ py: 10 }}>
      <Box display="flex" justifyContent="center" mb={2}>
        <RouterLink to="/">
          <Logo format="eulertools-navbar-logo" heightValue={60} />
        </RouterLink>
      </Box>
      <Typography variant="h2" textAlign="center" color="textPrimary" marginBottom={3}>
        Terms & Conditions of Service
      </Typography>
      <Typography color="textPrimary">
        Euler Tools is a website-hosted user interface (the “Tool”, “App”, &quot;Service&quot;) provided by BARSUM
        INTEGRADORA EMPRESARIAL S.L. (“COMPANY”, “we”, “our”, or “us”). The Tool provides access to decentralized
        protocols on different blockchains that allow users to obtain information and perform specific actions with
        digital assets or Virtual Currencies. This Terms of Service Agreement (the “Agreement”) explains the terms and
        conditions by which you may access and use the Tool. You must read this Agreement carefully.
      </Typography>
      <Typography color="textPrimary">
        By accessing or using the Tool, you signify that you have read, understand, and agree to be bound by this
        Agreement in its entirety. If you do not agree, you are not authorized to access or use the Tool.
      </Typography>
      <Typography color="textPrimary">
        IMPORTANT NOTE REGARDING ARBITRATION: WHEN YOU AGREE TO THESE TERMS BY USING OR ACCESSING THE SERVICES, YOU
        AGREE TO RESOLVE ANY DISPUTE BETWEEN YOU AND THE COMPANY THROUGH BINDING, INDIVIDUAL ARBITRATION RATHER THAN IN
        COURT.
      </Typography>
      <Typography variant="h6" color="textPrimary" paddingTop={1} paddingBottom={1}>
        TL;DR:
      </Typography>
      <Typography color="textPrimary">
        ✅ By using or accessing our Tool, you represent and warrant that you understand that there are inherent risks
        associated with Virtual Currency and the underlying technologies, including, without limitation, cryptography
        and blockchain. You agree that the Company is not responsible for any losses or damages associated with these
        risks.
      </Typography>
      <Typography color="textPrimary">
        ✅ You expressly acknowledge and agree we make no warranties of any kind concerning our content, including, but
        not limited to, the accuracy and currency of the information provided.
      </Typography>

      <Typography color="textPrimary">
        None of the content provided should be taken as financial or legal advice. Any use or reliance you place on our
        content is solely at your own risk. Euler Tools will not accept liability for any loss or damage due to your
        trading or your reliance on the information contained within this website and the tool.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Modification of this Agreement
      </Typography>
      <Typography color="textPrimary">
        We reserve the right, in our sole discretion, to modify this Agreement from time to time. If we make any
        modifications, we will notify you by maintaining a current version of the Agreement on our website.
      </Typography>
      <Typography color="textPrimary">
        All modifications will be effective when they are posted, and your continued use of the Tool will serve as
        confirmation of your acceptance of those modifications. If you do not agree with any changes to this Agreement,
        you must immediately stop accessing and using the Tool.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Eligibility
      </Typography>
      <Typography color="textPrimary">
        To access or use the Tool, you must be able to form a legally binding contract with us. Accordingly, you
        represent that you are at least eighteen years old and have the full right, power, and authority to enter into
        and comply with the terms and conditions of this Agreement on behalf of yourself and any company or legal entity
        for which you may access or use the Tool.
      </Typography>
      <Typography color="textPrimary">
        You further represent that you are not a citizen, resident, or member of any jurisdiction or group that is
        subject to economic sanctions by the European Union or another relevant jurisdiction, or where your use of the
        Tool would be illegal or otherwise violate any applicable law. You further represent that your access and use of
        the Tool will fully comply with all applicable laws and regulations and that you will not access or use the Tool
        to conduct, promote, or otherwise facilitate any illegal activity.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Proprietary Rights
      </Typography>
      <Typography color="textPrimary">
        We own all intellectual property and other rights in the Tool and its contents, including (but not limited to)
        software, text, images, trademarks, service marks, copyrights, patents, and designs. Unless expressly authorized
        by us, you may not copy, modify, adapt, rent, license, sell, publish, distribute, or otherwise permit any third
        party to access or use the Tool or any of its contents.
      </Typography>
      <Typography color="textPrimary">
        Provided that you are eligible, you are hereby granted a single, personal, limited license to access and use the
        Tool. This license is non-exclusive, non-transferable, and freely revocable by us at any time without notice or
        cause.
      </Typography>
      <Typography color="textPrimary">
        Use of the Tool or its contents for any purpose not expressly permitted by this Agreement is strictly
        prohibited. Unlike the Tool, the Protocol is comprised entirely of open-source software running on public
        blockchains and is not our proprietary property.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Privacy
      </Typography>
      <Typography color="textPrimary">
        We care about your privacy. Although we will comply with all valid subpoena requests, we will carefully consider
        each request to ensure that it comports with the spirit and letter of the law, and we will not hesitate to
        challenge invalid, overbroad, or unconstitutional requests as appropriate.
      </Typography>
      <Typography color="textPrimary">
        We use commercially reasonable safeguards to preserve the integrity and security of your personally identifiable
        information (“PII”) and aggregate data.
      </Typography>
      <Typography color="textPrimary">
        However, we cannot guarantee that unauthorized third parties will never be able to obtain or use your PII or
        aggregate data for improper purposes. You acknowledge that you provide your PII and aggregate data at your own
        risk.
      </Typography>
      <Typography color="textPrimary">
        By accessing and using the Tool, you understand and consent to our collection, use, and disclosure of your PII
        and aggregate data.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Prohibited Activity
      </Typography>
      <Typography color="textPrimary">
        You agree not to engage in or attempt to engage in, any of the following categories of prohibited acts in
        relation to your access and use of the Tool:
      </Typography>
      <Typography color="textPrimary">
        🛑 Intellectual Property Infringement. Activity that infringes on or violates any copyright, trademark, service
        mark, patent, right of publicity, right of privacy, or other proprietary or intellectual property rights under
        the law.
      </Typography>
      <Typography color="textPrimary">
        🛑 Cyberattack. Activity that seeks to interfere with or compromise the integrity, security, or proper
        functioning of any computer, server, network, personal device, or other information technology system, including
        (but not limited to) the deployment of viruses and denial of service attacks.
      </Typography>
      <Typography color="textPrimary">
        🛑 Fraud and Misrepresentation. Activity that seeks to defraud us or any other person or entity, including (but
        not limited to) providing any false, inaccurate, or misleading information in order to unlawfully obtain the
        property of another.
      </Typography>
      <Typography color="textPrimary">
        🛑 Market Manipulation. Activity that violates any applicable law, rule, or regulation concerning the integrity
        of trading markets, including (but not limited to) the manipulative tactics commonly known as spoofing and wash
        trading.
      </Typography>
      <Typography color="textPrimary">
        🛑 Any Other Unlawful Conduct. Activity that violates any applicable law, rule, or regulation of the European
        Union or another relevant jurisdiction or another relevant jurisdiction, including (but not limited to) the
        restrictions and regulatory requirements imposed by Spanish law.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        No Professional Advice
      </Typography>
      <Typography color="textPrimary">
        All information provided by the Tool is for informational purposes only and should not be construed as
        professional advice. You should not take, or refrain from taking, any action based on any information contained
        in the Tool.
      </Typography>
      <Typography color="textPrimary">
        Before you make any financial, legal, or other decisions involving the Tool, you should seek independent
        professional advice from an individual who is licensed and qualified in the area for which such advice would be
        appropriate.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        No Warranties
      </Typography>
      <Typography color="textPrimary">
        The Tool is provided on an “AS IS” and “AS AVAILABLE” basis. To the fullest extent permitted by law, we disclaim
        any representations and warranties of any kind, whether express, implied, or statutory, including (but not
        limited to) the warranties of merchantability and fitness for a particular purpose. You acknowledge and agree
        that your use of the Tool is at your own risk.
      </Typography>
      <Typography color="textPrimary">
        We do not represent or warrant that access to the Tool will be continuous, uninterrupted, timely, or secure;
        that the information contained in the Tool will be accurate, reliable, complete, or current; or that the Tool
        will be free from errors, defects, viruses, or other harmful elements.
      </Typography>
      <Typography color="textPrimary">
        No advice, information, or statement that we make should be treated as creating any warranty concerning the
        Tool. We do not endorse, guarantee, or assume responsibility for any advertisements, offers, or statements made
        by third parties concerning the Tool.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        No Fiduciary Duties
      </Typography>
      <Typography color="textPrimary">
        This Agreement is not intended to, and does not, create or impose any fiduciary duties on us. To the fullest
        extent permitted by law, you acknowledge and agree that we owe no fiduciary duties or liabilities to you or any
        other party and that to the extent any such duties or liabilities may exist at law or in equity, those duties
        and liabilities are hereby irrevocably disclaimed, waived, and eliminated.
      </Typography>
      <Typography color="textPrimary">
        You further agree that the only duties and obligations that we owe you are those set out expressly in this
        Agreement.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Compliance Obligations
      </Typography>
      <Typography color="textPrimary">
        The Tool is operated from facilities within Spain. By accessing or using the Tool, you agree that you are solely
        and entirely responsible for compliance with all laws and regulations that may apply to you.
      </Typography>
      <Typography color="textPrimary">
        You may not use the Tool if you are a citizen, resident, or member of any jurisdiction or group that is subject
        to economic sanctions by the European Union or another relevant jurisdiction, or if your use of the Tool would
        be illegal or otherwise violate any applicable law.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Assumption of Risk
      </Typography>
      <Typography color="textPrimary">
        By accessing and using the Tool, you represent that you understand the inherent risks associated with using
        cryptographic and blockchain-based systems and that you have a working knowledge of the usage and intricacies of
        digital assets such as bitcoin (BTC), ether (ETH), and other digital tokens.
      </Typography>
      <Typography color="textPrimary">
        You further understand that the markets for these digital assets are highly volatile due to factors including
        (but not limited to) adoption, speculation, technology, security, and regulation. You acknowledge that the cost
        and speed of transacting with cryptographic and blockchain-based systems such as Ethereum are variable and may
        increase dramatically at any time.
      </Typography>
      <Typography color="textPrimary">
        You further acknowledge the risk that your digital assets may lose some or all of their value while they are
        supplied to the Protocol. If you borrow digital assets from the Protocol, you will have to supply digital assets
        of your own as collateral. If your collateral declines in value such that it is no longer sufficient to secure
        the amount that you borrowed, others may interact with the Protocol to seize your collateral in a liquidation
        event.
      </Typography>
      <Typography color="textPrimary">
        You further acknowledge that we are not responsible for any of these variables or risks, do not own or control
        the Protocol, and cannot be held liable for any resulting losses that you experience while accessing or using
        the Tool. Accordingly, you understand and agree to assume full responsibility for all of the risks of accessing
        and using the Tool and interacting with the Protocol.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Third-Party Resources and Promotions
      </Typography>
      <Typography color="textPrimary">
        The Tool may contain references or links to third-party resources, including (but not limited to) information,
        materials, products, or services, that we do not own or control. In addition, third parties may offer promotions
        related to your access and use of the Tool.
      </Typography>
      <Typography color="textPrimary">
        We do not endorse or assume any responsibility for any such resources or promotions. If you access any such
        resources or participate in any such promotions, you do so at your own risk, and you understand that this
        Agreement does not apply to your dealings or relationships with any third parties. You expressly relieve us of
        any and all liability arising from your use of any such resources or participation in any such promotions.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Release of Claims
      </Typography>
      <Typography color="textPrimary">
        You expressly agree that you assume all risks in connection with your access and use of the Tool and your
        interaction with the Protocol. You further expressly waive and release us from any and all liability, claims,
        causes of action, or damages arising from or in any way relating to your use of the Tool and your interaction
        with the Protocol.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Indemnity
      </Typography>
      <Typography color="textPrimary">
        You agree to hold harmless, release, defend, and indemnify us and our officers, directors, employees,
        contractors, agents, affiliates, and subsidiaries from and against all claims, damages, obligations, losses,
        liabilities, costs, and expenses arising from (a) your access and use of the Tool; (b) your violation of any
        term or condition of this Agreement, the right of any third party, or any other applicable law, rule, or
        regulation; and (c) any other party’s access and use of the Tool with your assistance or using any device or
        account that you own or control.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Limitation of Liability
      </Typography>
      <Typography color="textPrimary">
        Under no circumstances shall we or any of our officers, directors, employees, contractors, agents, affiliates,
        or subsidiaries be liable to you for any indirect, punitive, incidental, special, consequential, or exemplary
        damages, including (but not limited to) damages for loss of profits, goodwill, use, data, or other intangible
        property, arising out of or relating to any access or use of the Tool, nor will we be responsible for any
        damage, loss, or injury resulting from hacking, tampering, or other unauthorized access or use of the Tool or
        the information contained within it. We assume no liability or responsibility for any: (a) errors, mistakes, or
        inaccuracies of content; (b) personal injury or property damage, of any nature whatsoever, resulting from any
        access or use of the Tool; (c) unauthorized access or use of any secure server or database in our control, or
        the use of any information or data stored therein; (d) interruption or cessation of function related to the
        Tool; (e) bugs, viruses, trojan horses, or the like that may be transmitted to or through the Tool; (f) errors
        or omissions in, or loss or damage incurred as a result of the use of, any content made available through the
        Tool; and (g) the defamatory, offensive, or illegal conduct of any third party.
      </Typography>
      <Typography color="textPrimary">
        Under no circumstances shall we or any of our officers, directors, employees, contractors, agents, affiliates,
        or subsidiaries be liable to you for any claims, proceedings, liabilities, obligations, damages, losses, or
        costs in an amount exceeding the amount you paid to us in exchange for access to and use of the Tool, whichever
        is greater.
      </Typography>
      <Typography color="textPrimary">
        This limitation of liability applies regardless of whether the alleged liability is based on contract, tort,
        negligence, strict liability, or any other basis. Even if we have been advised of the possibility of such harm,
        some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of certain
        liabilities and damages. Accordingly, some of the disclaimers and regulations set forth in this Agreement may
        not apply to you. This limitation of liability shall apply to the fullest extent permitted by law.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Dispute Resolution
      </Typography>
      <Typography color="textPrimary">
        We will use our best efforts to resolve any potential disputes through informal, good-faith negotiations. If a
        potential conflict arises, you must contact us by sending an email to general@euler.tools so that we can attempt
        to resolve it without resorting to formal dispute resolution. Suppose we aren’t able to reach an informal
        resolution within sixty days of your email. In that case, you and we both agree to resolve the potential dispute
        according to the process outlined in Spanish law, unless you and we both agree to hold it elsewhere.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Class Action and Jury Trial Waiver
      </Typography>
      <Typography color="textPrimary">
        You must bring all Disputes against us in your capacity and not as a plaintiff in or member of any purported
        class action, collective action, private attorney general action, or other representative proceeding. This
        provision applies to class arbitration. You and we both agree to waive the right to demand a trial by jury.
      </Typography>
      <Typography variant="h4" color="textPrimary" marginBottom={2} marginTop={2}>
        Governing Law
      </Typography>
      <Typography color="textPrimary">
        You agree that Spanish laws solely, without regard to principles of conflict of laws, govern this Agreement and
        any dispute between you and us and that although the Tool may be available in other jurisdictions, its
        availability does not give rise to general or specific personal jurisdiction in any forum outside Spain.
      </Typography>
    </Container>
  </AppSkeleton>
);

export default TermsAndConditionsPage;
