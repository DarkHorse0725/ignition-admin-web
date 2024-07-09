<p align="center">
  <h1 align="center">
  Launchpad
  </h1>
</p>

<p align="center">
  <b>
  Launchpad Admin Web / Back Office
  </b><br>
</p>

[//]: # "BADGES"

<p align="center">
  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=alert_status&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Quality Gate Status">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=sqale_rating&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Maintainability Rating">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=security_rating&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Security Rating">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=reliability_rating&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Reliability Rating">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=coverage&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Coverage">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=bugs&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Bugs">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=code_smells&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Code Smells">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=ncloc&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Lines of Code">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=sqale_index&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Technical Debt">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=vulnerabilities&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Vulnerabilities">
  </a>

  <a href="https://sonarcloud.io/dashboard?id=PAIDNetwork_launchpad-web-admin">
    <img src="https://sonarcloud.io/api/project_badges/measure?project=PAIDNetwork_launchpad-web-admin&metric=duplicated_lines_density&token=c11ebdc6df1e816db7b8b96819b1ab92184afd14" alt="Duplicated Lines (%)">
  </a>

</p>

## Description

Admin facing Web Client for Launchpad

## Requirements

Make sure you have the following installed:

- [NVM](https://github.com/nvm-sh/nvm)
- [VS Code](https://code.visualstudio.com/download)

---

## Admin API

The companion Admin API can be found in the following repo: [launchpad-admin-api
](https://github.com/PAIDNetwork/launchpad-admin-api). Once you have successfully ran the `Admin API`, you can get going with the `Admin Web`. Follow the `Admin API` repo's [README](https://github.com/PAIDNetwork/launchpad-admin-api/blob/main/README.md) on instructions to getting started.

## How to add a new Network

Add an entry in `src/types/contract/network.ts`:

- `AllowedNetwork`
- `NETWORK_LABELS`
- `getDefaultNetworks`

## How to add a new pool factory contract and PAID contract

Update function contractAddresses in `src/core/api/services/contract.service/index.ts`

## Quick Start

After setting up the `Admin API`, Perform the following commands in this projects directory to get started.

> Copy `.env.local.example` file

```bash
cp -R .env.local.example .env.local
```

> Make sure to use `NodeJS LTS`!

```bash
nvm use
```

> Install dependencies

```bash
npm i
```

> Build & Run website

```bash
npm run dev
```

> Once the web app is running. You can start testing/debugging the app by doing the following

- In `vscode`, select the `Run and Debug` icon.
- Next, select the `Play` green triangle button (the top left corner)
- You should see chrome browser launch and the website will load.
- Then you are good to go.
