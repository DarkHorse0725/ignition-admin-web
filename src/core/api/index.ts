import {
  AuthService,
  AppsService,
  ContractAdminsService,
  ContractService,
  CountriesService,
  CustomersService,
  JobsService,
  LotteriesService,
  NotificationService,
  PartnersService,
  PoolService,
  ProjectService,
  SnapshotService,
  TagService,
  TransactionService,
  UsersService,
  VestingService,
  WhitelistsService,
  WithdrawsService,
} from "./services";

export class APIClient {
  private static instance: APIClient;

  private constructor(
    public readonly auth = new AuthService(),
    public readonly apps = new AppsService(),
    public readonly setAdmins = new ContractAdminsService(),
    public readonly contracts = new ContractService(),
    public readonly countries = new CountriesService(),
    public readonly customers = new CustomersService(),
    public readonly jobs = new JobsService(),
    public readonly lotteries = new LotteriesService(),
    public readonly notification = new NotificationService(),
    public readonly partners = new PartnersService(),
    public readonly pools = new PoolService(),
    public readonly projects = new ProjectService(),
    public readonly snapshot = new SnapshotService(),
    public readonly tag = new TagService(),
    public readonly transaction = new TransactionService(),
    public readonly users = new UsersService(),
    public readonly vesting = new VestingService(),
    public readonly whitelists = new WhitelistsService(),
    public readonly withdraws = new WithdrawsService(),
  ) {}

  static getInstance(): APIClient {
    if (APIClient.instance) {
      return APIClient.instance;
    }

    APIClient.instance = new APIClient();
    return APIClient.instance;
  }
}
