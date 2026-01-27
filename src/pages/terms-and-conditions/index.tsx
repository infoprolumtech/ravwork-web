import { type JSX } from "react";
import ServiceProviderLayout from "../../layouts/ServiceProviderLayout";
import TermCondition from "../../components/client/termCondition";

export default function TermsAndConditionsPage(): JSX.Element {
  return (
    <ServiceProviderLayout>
      <TermCondition/>
    </ServiceProviderLayout>
  );
}

