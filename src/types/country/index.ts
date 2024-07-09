import { MongoDocument } from "../base";

export interface Country extends MongoDocument {
  name: string;
  alpha2: string;
  alpha3: string;
  countryCode: string;
  iso31662: string;
  region: string;
  regionCode: string;
  restricted: boolean;
}

export interface CountryList {
  data: Country[];
  total: number;
}
