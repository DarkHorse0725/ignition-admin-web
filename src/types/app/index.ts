import { MongoDocument } from "../base";

export enum Brands {
  IGNITION = "ignition",
  APOLLOX = "apollox",
  PNA = "pna",
  INDIA = "india",
}

export enum Platforms {
  APIEXPLORER = "apiExplorer",
  INTEGRATION = "integration",
  TOOLS = "tools",
  WEB = "web",
}

export enum Environments {
  SANDBOX = "sandbox",
  PRODUCTION = "production",
}

export const AllBrands = Object.values(Brands) as Brands[];
export const AllPlatforms = Object.values(Platforms) as Platforms[];
export const AllEnvs = Object.values(Environments) as Environments[];

export interface App extends MongoDocument {
  brand: Brands;
  name: string;
  environment: Environments;
  platform: Platforms;
  maintenance: boolean;
  supportEmail: string;
  supportNumber: string;
  key: string;
  secret: string;
  transactionalEmailFromName: string;
  transactionalEmailFromEmail: string;
  forgotPasswordEmailSubject: string;
  forgotPasswordEmailTemplateId: string;
  forgotPasswordEmailLink: string;
  verifyEmailSubject: string;
  verifyEmailTemplateId: string;
  verifyEmailLink: string;
  changeEmailSubject: string;
  changeEmailTemplateId: string;
  changeEmailLink: string;
}

export interface AppList {
  data: App[];
  total: number;
}
