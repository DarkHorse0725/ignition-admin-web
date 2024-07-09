import { ADMIN_ROLE } from "@/types";

export enum PERMISSION {
  NONE, // can not view or access data
  READ, // view data
  WRITE, // edit, remove, submit data
}

export enum RESOURCES {
  PROJECT_INFO,
  PROJECT_SNAPSHOT,
  PROJECT_WITHDRAW,
  PROJECT_POOL,
  PROJECT_PUBLISH,
  PROJECT_CANCEL,
  PROJECT_DELETE,
  PROJECT_CLAIMABLE,
  CONTRACT_ADMIN,
  USER_ADMIN,
  VIEW_PROPOSAL
}

const PERMISSION_RESOURCES = {
  [RESOURCES.PROJECT_INFO]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // create, read, edit, cancel, publish, enable claimable, disable claimable project
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.READ], // read project
  },
  [RESOURCES.PROJECT_SNAPSHOT]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // read snapshot data, add account, delete account, edit account, submit snapshot
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.READ], // read snapshot data
  },
  [RESOURCES.PROJECT_WITHDRAW]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], //  withdraw project's pool
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.READ], // cannot see withdraw project's pool button
  },
  [RESOURCES.PROJECT_PUBLISH]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], //  publish project
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot see publish project button
  },
  [RESOURCES.PROJECT_CANCEL]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], //  cancel project
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot see cancel project button
  },
  [RESOURCES.PROJECT_DELETE]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], //  delete project
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot see delete project button
  },
  [RESOURCES.PROJECT_CLAIMABLE]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // enable claimable, disable claimable project
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot see enable claimable, disable claimable project project button
  },
  [RESOURCES.PROJECT_POOL]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.READ], // can view, can not perform any actions
  },
  [RESOURCES.CONTRACT_ADMIN]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // read contract admin data, add account, delete account
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE],
    [ADMIN_ROLE.VIEWER]: [PERMISSION.READ], // read contract admin data
  },
  [RESOURCES.USER_ADMIN]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // read user admin data, add account, edit account, delete account, reset password of the account, reset 2FA of the account
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ], // read user admin data
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot access "access control list" tab
  },
  [RESOURCES.VIEW_PROPOSAL]: {
    [ADMIN_ROLE.SUPER_ADMIN]: [PERMISSION.READ, PERMISSION.WRITE], // can see view proposal button
    [ADMIN_ROLE.EDITOR]: [PERMISSION.READ, PERMISSION.WRITE], // can see view proposal button
    [ADMIN_ROLE.VIEWER]: [PERMISSION.NONE], // cannot see view proposal button
  },
};

export const getPermissionOfResource = (
  role: ADMIN_ROLE = ADMIN_ROLE.VIEWER,
  resources: RESOURCES
) => {
  return PERMISSION_RESOURCES[resources][role];
};
