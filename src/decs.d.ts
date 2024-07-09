declare module "wallet-address-validator" {
  interface WalletAddressValidator {
    validate: (
      address: string | undefined,
      currency: string,
      networkType: string
    ) => boolean;
  }
  let walletAddressValidator: WalletAddressValidator;
  export default walletAddressValidator;
}
