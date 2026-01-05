export interface Step1FormInputs {
  username: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  password: string;
}

export interface Step2FormInputs {
  plan: string;
}

export interface Step3FormInputs {
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  securityCode?: string;
}

export interface Step4FormInputs {
  businessName?: string;
  businessDescription?: string;
  profileImage?: File; // File object for UI, will be converted to URL for API
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}

