import { AllowedNetwork } from "../contract";

export interface UpdateTGEDateVesting {
  TGEDate: Date;
  projectNetwork: AllowedNetwork;
}
