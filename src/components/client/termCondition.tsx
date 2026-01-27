import { Box, Stack, Typography } from "@mui/material";
import { StyledHeaderTypography } from "../../utils/helper";

export default function TermCondition() {
    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: "900px", mx: "auto" }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: "#000000" }}>
            Ravwork Link – Terms & Conditions
          </Typography>
          <Typography variant="body2" sx={{ mb: 4, color: "#6C737F" }}>
            Last Updated: 2/14/2026
          </Typography>

          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ mb: 2, whiteSpace: "pre-line" }}>
                These Terms & Conditions ("<span style={{ fontWeight: 600 }}>Terms</span>") govern your access to and use of <span style={{ fontWeight: 600 }}>Ravwork Link</span>, operated
                by Ravwork, Inc., a Delaware corporation ("<span style={{ fontWeight: 600 }}>Ravwork</span>," "<span style={{ fontWeight: 600 }}>we</span>," "<span style={{ fontWeight: 600 }}>us</span>," or "<span style={{ fontWeight: 600 }}>our</span>").
                {"\n\n"}
                By accessing or using Ravwork Link (including any subdomains such as <span style={{ fontWeight: 600 }}>ravwork.link</span>), you
                agree to be bound by these Terms. If you do not agree, do not use the platform.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                1. What Ravwork Link Is (and Is Not)
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ravwork Link is a <span style={{ fontWeight: 600 }}>software-as-a-service (SaaS) tool</span> that allows users to create a personalized
                link to display services, pricing, forms, and contact methods.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                Ravwork is only a tool.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                We do not:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Provide services</Box>
                <Box>• Arrange, manage, or guarantee services</Box>
                <Box>• Act as a marketplace, broker, agent, or intermediary</Box>
                <Box>• Verify users, licenses, insurance, or qualifications</Box>
                <Box>• Participate in transactions, payments, or disputes</Box>
              </Typography>
              <Typography variant="body2">
                Any interaction, agreement, or service occurs <span style={{ fontWeight: 600 }}>solely between users and their clients</span>, at their
                own risk.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                2. Eligibility
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 0 }}>
                <Box>• You must be <span style={{ fontWeight: 600 }}>at least 18 years old</span> to use Ravwork Link.</Box>
                <Box>• You may use the platform for <span style={{ fontWeight: 600 }}>any lawful purpose only</span>.</Box>
                <Box>• Use of Ravwork Link for illegal, deceptive, harmful, or abusive activity is strictly
                prohibited.</Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                3. Accounts & Subscriptions
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                3.1 Account Responsibility
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You are responsible for:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• All activity under your account</Box>
                <Box>• Maintaining accurate information</Box>
                <Box>• Keeping login credentials secure</Box>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                3.2 Subscription Fees
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ravwork Link currently offers paid subscriptions:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• <span style={{ fontWeight: 600 }}>$29/month</span>, or</Box>
                <Box>• <span style={{ fontWeight: 600 }}>$240 Annually ($20/month)</span></Box>
              </Typography>
              <Typography variant="body2">
                Fees are billed in advance and are <span style={{ fontWeight: 600 }}>non-refundable</span>, except where required by law.
                {"\n"}
                Ravwork may modify pricing or plans at any time with reasonable notice.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                4. Payments & Transactions
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 0 }}>
                <Box>• Ravwork does not collect, process, hold, or manage client payments.</Box>
                <Box>• Ravwork is <span style={{ fontWeight: 600 }}>not involved</span> in financial transactions between users and their clients.</Box>
                <Box>• All pricing, payment methods, refunds, disputes, and chargebacks are handled <span style={{ fontWeight: 600 }}>entirely
                by users</span>.</Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                5. User Content
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                5.1 Ownership
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You retain ownership of all content you create or upload, including:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Service descriptions</Box>
                <Box>• Pricing</Box>
                <Box>• Forms</Box>
                <Box>• Text, images, and other materials</Box>
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                5.2 License to Ravwork
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                By using Ravwork Link, you grant Ravwork a <span style={{ fontWeight: 600 }}>worldwide, perpetual, irrevocable, royalty-free
                license</span> to:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                <Box>• Host</Box>
                <Box>• Store</Box>
                <Box>• Display</Box>
                <Box>• Transmit</Box>
                <Box>• Modify (for technical or operational purposes)</Box>
                <Box>• Remove such content</Box>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                This license is required to operate and improve the platform.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                6. Acceptable Use
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You agree not to use Ravwork Link to:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Violate any law or regulation</Box>
                <Box>• Misrepresent services or identity</Box>
                <Box>• Harass, abuse, or harm others</Box>
                <Box>• Collect data unlawfully</Box>
                <Box>• Transmit malware or harmful code</Box>
              </Typography>
              <Typography variant="body2">
                Ravwork may remove content or suspend accounts <span style={{ fontWeight: 600 }}>at its sole discretion</span>, without notice.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                7. No Verification & No Guarantees
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ravwork does not verify:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Licenses</Box>
                <Box>• Insurance</Box>
                <Box>• Backgrounds</Box>
                <Box>• Certifications</Box>
                <Box>• Service quality</Box>
                <Box>• Identity accuracy</Box>
              </Typography>
              <Typography variant="body2">
                You acknowledge that <span style={{ fontWeight: 600 }}>all use is at your own risk</span>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                8. Platform Availability & Service Disclaimer
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                8.1 No Warranty of Availability
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ravwork Link is provided "<span style={{ fontWeight: 600 }}>AS IS</span>" and "<span style={{ fontWeight: 600 }}>AS AVAILABLE</span>." Ravwork makes <span style={{ fontWeight: 600 }}>no representations
                or warranties</span> of any kind regarding uptime, availability, reliability, performance, continuity, or
                error-free operation of the platform.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                8.2 Service Interruptions
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Ravwork may experience interruptions, delays, outages, errors, data loss, or other technical
                issues due to maintenance, system failures, third-party services, force majeure events, or other
                causes. Ravwork reserves the right to modify, suspend, or discontinue any aspect of the
                platform at any time, with or without notice.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                8.3 No Liability for Lost Business or Revenue
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                To the <span style={{ fontWeight: 600 }}>maximum extent permitted by law</span>, <span style={{ fontWeight: 600 }}>Ravwork shall not be liable for any loss of profits,
                loss of revenue, loss of clients, loss of business opportunities, loss of data, business
                interruption, reputational harm, or any other economic or consequential damages</span>, arising
                out of or related to:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Platform downtime or unavailability</Box>
                <Box>• Service interruptions or delays</Box>
                <Box>• Errors, bugs, or technical failures</Box>
                <Box>• Suspension or termination of access</Box>
                <Box>• Reliance on the platform for business operations</Box>
              </Typography>
              <StyledHeaderTypography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                8.4 Assumption of Risk
              </StyledHeaderTypography>
              <Typography variant="body2">
                You acknowledge and agree that you use Ravwork Link <span style={{ fontWeight: 600 }}>at your own risk</span> and that the platform
                is <span style={{ fontWeight: 600 }}>not guaranteed to generate clients, revenue, leads, or business results of any kind</span>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                9. Communications (SMS & Email)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                By creating an account, you consent to receive:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Transactional emails</Box>
                <Box>• SMS notifications related to submissions, account activity, and onboarding</Box>
              </Typography>
              <Typography variant="body2">
                SMS notifications can be disabled in account settings.
                {"\n"}
                Messages are <span style={{ fontWeight: 600 }}>non-marketing</span> and directly related to platform functionality.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                10. Data & Privacy
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ravwork collects and uses data <span style={{ fontWeight: 600 }}>only to operate Ravwork Link</span>, including:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2, mb: 2 }}>
                <Box>• Platform functionality</Box>
                <Box>• Notifications</Box>
                <Box>• APIs and infrastructure services (e.g., SMS/email providers)</Box>
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                We do <span style={{ fontWeight: 600 }}>not</span> sell user data.
              </Typography>
              <Typography variant="body2">
                Use of Ravwork Link is also governed by our <span style={{ fontWeight: 600 }}>Privacy Policy</span>, which is incorporated into these
                Terms by reference.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                11. Safety & Emergency Disclaimer
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Ravwork Link is <span style={{ fontWeight: 600 }}>not intended for emergency, urgent, or safety-critical use</span>.
              </Typography>
              <Typography variant="body2">
                Ravwork is not responsible for:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                <Box>• Physical injury</Box>
                <Box>• Property damage</Box>
                <Box>• Losses resulting from user interactions or services</Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                12. Termination
              </Typography>
              <Typography variant="body2">
                Ravwork may:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                <Box>• Suspend or terminate any account</Box>
                <Box>• Remove any content</Box>
                <Box>• Deny access to the platform</Box>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                <span style={{ fontWeight: 600 }}>At any time, for any reason, with or without notice</span>, and without liability.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                13. Limitation of Liability
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                To the <span style={{ fontWeight: 600 }}>maximum extent permitted by law</span>, Ravwork shall <span style={{ fontWeight: 600 }}>not be liable</span> for any indirect,
                incidental, consequential, special, or punitive damages.
              </Typography>
              <Typography variant="body2">
                Ravwork's total liability shall <span style={{ fontWeight: 600 }}>not exceed the amount paid by you to Ravwork in the prior 12
                months, or $0 if none was paid</span>.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                14. Indemnification
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                You agree to indemnify, defend, and hold harmless Ravwork, Inc. from any claims, damages,
                losses, liabilities, and expenses arising from:
              </Typography>
              <Typography variant="body2" component="div" sx={{ pl: 2 }}>
                <Box>• Your use of Ravwork Link</Box>
                <Box>• Your content</Box>
                <Box>• Your services</Box>
                <Box>• Your interactions with clients or third parties</Box>
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                15. Arbitration & Class Action Waiver
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                15.1 Binding Arbitration
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                All disputes shall be resolved by <span style={{ fontWeight: 600 }}>binding arbitration conducted remotely</span>, not in court.
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "#000000" }}>
                15.2 No Class Actions
              </Typography>
              <Typography variant="body2">
                You agree to resolve disputes <span style={{ fontWeight: 600 }}>individually</span>, and waive any right to participate in a class,
                collective, or representative action.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                16. Governing Law
              </Typography>
              <Typography variant="body2">
                These Terms are governed by the laws of the <span style={{ fontWeight: 600 }}>State of Delaware</span>, without regard to
                conflict-of-law principles.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                17. Changes to These Terms
              </Typography>
              <Typography variant="body2">
                Ravwork may update these Terms at any time. Continued use of Ravwork Link constitutes
                acceptance of the updated Terms.
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#000000" }}>
                18. Contact Information
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                📧 <span style={{ fontWeight: 600 }}>support@ravwork.com</span>
                {"\n\n"}
                <span style={{ fontWeight: 600 }}>Company:</span>
                {"\n"}
                Ravwork, Inc.
                {"\n"}
                Dearborn, Michigan, USA
              </Typography>
            </Box>
          </Stack>
      </Box>
    );
}