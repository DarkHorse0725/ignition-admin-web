import { MongoDocument } from "../base";

export interface CustomerCountry {
    name: string;
    code3: string;
}

export interface Customer extends MongoDocument {
    brand: string;
    email: string;
    password: string;
    name: string;
    surname: string;
    countryCode: string;
    country: CustomerCountry;
    address: string;
    addressTwo: string;
    province: string;
    city: string;
    status: number;
    telegram: string;
    synapsSessionId: string;
    solanaAddress?: string;
    wallets: Array<{ account: string; chainId: number }>;
    changePasswordNextLogin: boolean;
}

export interface CustomerList {
    data: Customer[];
    total: number;
}