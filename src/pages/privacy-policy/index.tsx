import { type JSX } from "react";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import PrivacyPolicy from "../../components/client/privacyPolicy";

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <ServiceProviderLayout>
      <PrivacyPolicy/>
    </ServiceProviderLayout>
  );
}

