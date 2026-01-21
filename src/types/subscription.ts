export interface DefaultPaymentMethod {
  brand: string;
  last4: string;
}

export type SubscriptionLifecycleStatus = "active" | "inactive" | "canceled" | "past_due" | "trialing";

export interface SubscriptionDetails {
  id: string;
  status: SubscriptionLifecycleStatus;
  plan: SubscriptionPlan;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  renewsOn?: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  defaultPaymentMethod?: DefaultPaymentMethod;
}

export interface SubscriptionStatusResponse {
  hasSubscription: boolean;
  subscription: SubscriptionDetails | null;
}

export interface SubscriptionPlan {
  id: string; // internal plan UUID from backend
  name: string; // "Monthly" | "Yearly"
  slug: "monthly" | "yearly" | string;
  price: number; // major currency unit (e.g. 29, 240)
  currency: string; // e.g. "USD"
  interval: "month" | "year";
  intervalMonths: number;
  description?: string;
  features?: string[];
  stripePriceId: string; // Stripe price id (e.g. price_...)
}

export interface CreateSubscriptionCheckoutRequest {
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CreateSubscriptionCheckoutResponse {
  checkoutSessionId: string;
  checkoutUrl: string;
}

// Cancel Subscription
export interface CancelSubscriptionResponse {
  message: string;
  cancelAt: string;
}

// Resume Subscription
export interface ResumeSubscriptionResponse {
  message: string;
}

// Change Plan
export interface ChangePlanRequest {
  priceId: string;
}

export interface ChangePlanResponse {
  message: string;
}

// Update Payment Method
export interface UpdatePaymentMethodRequest {
  paymentMethodId: string;
}

export interface UpdatePaymentMethodResponse {
  message: string;
}

