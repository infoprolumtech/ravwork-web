import { Box, Stack, Typography } from "@mui/material";
import { StyledHeaderTypography } from "../../utils/helper";

export default function PrivacyPolicy() {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#000000" }}>
        Privacy Policy – Ravwork Link
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#6C737F" }}>
        Last Updated: 1/24/2026
      </Typography>

      <Stack spacing={3}>
        <Box>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
            This <span style={{ fontWeight: 600 }}>Privacy Policy</span> explains how <span style={{ fontWeight: 600 }}>Ravwork, Inc.</span> ("<span style={{ fontWeight: 600 }}>Ravwork</span>," "<span style={{ fontWeight: 600 }}>we</span>," "<span style={{ fontWeight: 600 }}>us</span>," or "<span style={{ fontWeight: 600 }}>our</span>") collects, uses,
            and protects information when you use <span style={{ fontWeight: 600 }}>Ravwork Link</span>, including the website, application, and
            related services (collectively, the "<span style={{ fontWeight: 600 }}>Service</span>").
            {"\n\n"}
            By using <span style={{ fontWeight: 600 }}>Ravwork Link</span>, you agree to this <span style={{ fontWeight: 600 }}>Privacy Policy</span>. If you do not agree, do not use the
            <span style={{ fontWeight: 600 }}>Service</span>.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            1. Information We Collect
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            We collect only the information necessary to operate Ravwork Link
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
            1.1 Information You Provide
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            When you create an account or use the Service, we may collect:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Name</Box>
            <Box>• Email address</Box>
            <Box>• Phone number</Box>
            <Box>• Account credentials</Box>
            <Box>• Service descriptions, pricing, and forms</Box>
            <Box>• Any information submitted through custom forms you create</Box>
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
            1.2 Information Collected Automatically
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We may collect:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2 }}>
            <Box>• IP address</Box>
            <Box>• Device and browser information</Box>
            <Box>• Usage data (pages visited, actions taken)</Box>
            <Box>• Log and diagnostic data</Box>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            2. How We Use Information
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We use your information <span style={{ fontWeight: 600 }}>only to operate and improve Ravwork Link</span>, including to:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Provide and maintain the Service</Box>
            <Box>• Create and manage user accounts</Box>
            <Box>• Deliver SMS and email notifications</Box>
            <Box>• Enable platform features and APIs</Box>
            <Box>• Process subscriptions and billing</Box>
            <Box>• Prevent fraud, abuse, or illegal activity</Box>
            <Box>• Comply with legal obligations</Box>
          </Typography>
          <Typography variant="body2">
            We <span style={{ fontWeight: 600 }}>do not sell your personal data.</span>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            3. SMS & Email Communications
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            By creating an account, you consent to receive:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Transactional emails</Box>
            <Box>• SMS notifications related to:</Box>
            <Box sx={{ pl: 2 }}>○ Submissions</Box>
            <Box sx={{ pl: 2 }}>○ Account activity</Box>
            <Box sx={{ pl: 2 }}>○ Platform onboarding</Box>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            These communications are <span style={{ fontWeight: 600 }}>not marketing messages.</span>
          </Typography>
          <Typography variant="body2">
            You may disable SMS notifications at any time through your account settings.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            4. APIs & Third-Party Services
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            To operate Ravwork Link, we use trusted third-party service providers, including:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Hosting and infrastructure providers</Box>
            <Box>• Email delivery services</Box>
            <Box>• SMS messaging providers</Box>
            <Box>• Payment processors (for Ravwork subscription billing only)</Box>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            These providers may process limited data <span style={{ fontWeight: 600 }}>only as required to perform their services for </span>
            Ravwork.
          </Typography>
          <Typography variant="body2">
            We do <span style={{ fontWeight: 600 }}>not</span> authorize third parties to use your data for their own marketing purposes.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            5. Payments
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Ravwork collects payment information <span style={{ fontWeight: 600 }}>only for Ravwork subscription billing.</span>
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ravwork:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Does <span style={{ fontWeight: 600 }}>not</span> collect client payments</Box>
            <Box>• Does <span style={{ fontWeight: 600 }}>not</span> process transactions between users and clients</Box>
            <Box>• Is <span style={{ fontWeight: 600 }}>not</span> responsible for disputes or payments outside the platform</Box>
          </Typography>
          <Typography variant="body2">
            Payment processing is handled securely by third-party processors.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            6. User Content & Forms
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Any content or form data you create is:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Stored only to operate Ravwork Link </Box>
            <Box>• Accessible by you and those you choose to share it with</Box>
          </Typography>
          <Typography variant="body2">
            You are responsible for the content you collect from others using your Ravwork Link.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            7. Data Sharing
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We may share information:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• With service providers required to operate the platform</Box>
            <Box>• If required by law, subpoena, or legal process</Box>
            <Box>• To protect the rights, safety, or property of Ravwork or others</Box>
          </Typography>
          <Typography variant="body2">
            We <span style={{ fontWeight: 600 }}>do not sell or rent personal information.</span>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            8. Data Retention
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We retain information:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• For as long as your account is active</Box>
            <Box>• As needed to operate the Service</Box>
            <Box>• As required by law or legitimate business purposes</Box>
          </Typography>
          <Typography variant="body2">
            You may request account deletion by contacting us.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            9. Security
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
            We use reasonable administrative, technical, and organizational measures to protect
            information.
            {"\n\n"}
            However, <span style={{ fontWeight: 600 }}>no system is 100% secure</span>, and we cannot guarantee absolute security.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            10. Children's Privacy
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Ravwork Link is <span style={{ fontWeight: 600 }}>not intended for users under 18</span>.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            We do <span style={{ fontWeight: 600 }}>not</span> knowingly collect personal information from children.
          </Typography>
          <Typography variant="body2">
            If you believe a minor has provided data, contact us for removal.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            11. Your Rights
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Depending on your location, you may have rights to:
          </Typography>
          <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
            <Box>• Access your personal data</Box>
            <Box>• Correct inaccurate data</Box>
            <Box>• Request deletion of your data</Box>
          </Typography>
          <Typography variant="body2">
            Requests can be sent to <span style={{ fontWeight: 600 }}>support@ravwork.com.</span>
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            12. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body2">
            We may update this Privacy Policy at any time.
            {"\n\n"}
            Continued use of Ravwork Link after changes means you accept the updated policy.
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
            Contact Us
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, whiteSpace: "pre-line" }}>
            If you have any questions about this Privacy Policy, our data practices, or wish to exercise your
            privacy rights, you may contact us at:
            {"\n\n"}
            <span style={{ fontWeight: 600 }}>Company Name</span>: Ravwork, Inc.
            {"\n"}
            <span style={{ fontWeight: 600 }}>Entity Type</span>: Delaware C-Corporation
            {"\n"}
            <span style={{ fontWeight: 600 }}>Product</span>: Ravwork / Ravwork Link / ravwork.link
            {"\n"}
            <span style={{ fontWeight: 600 }}>Location</span>: Dearborn, Michigan, USA
            {"\n"}
            <span style={{ fontWeight: 600 }}>Email: support@ravwork.com</span>
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}