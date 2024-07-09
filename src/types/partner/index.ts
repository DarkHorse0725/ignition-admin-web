import { MongoDocument } from "../base";

export interface Partner extends MongoDocument {
  name: string;
  slug: string;
  code: string;
  description: string;
  bgImageURL: string;
}

export interface PartnerDto {
  name: string;
  slug: string;
  description: string;
  bgImageURL: string;
}

export interface PartnerList {
  data: Partner[];
  total: number;
}
