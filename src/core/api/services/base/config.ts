export class Config {
  private static instance: Config;

  public readonly apiBaseURL: string =
    process.env.NEXT_PUBLIC_API_BASE_URL || "";

  public readonly apiReqTimeout: number = process.env
    .NEXT_PUBLIC_API_REQ_TIMEOUT
    ? Number(`${process.env.NEXT_PUBLIC_API_REQ_TIMEOUT}`)
    : 300000;

  private constructor() {}

  static getInstance(): Config {
    if (Config.instance) {
      return Config.instance;
    }
    Config.instance = new Config();
    return Config.instance;
  }
}
