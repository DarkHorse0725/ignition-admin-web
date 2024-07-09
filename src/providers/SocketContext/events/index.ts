export const SUCCESS_EVENTS = {
  UPDATE_TGE_DATE: "update_tge_date",
  POOL_END_TIME_UPDATED: "pool_end_time_updated",
  GRANT_ADMIN_UPDATED: "grant_admin_updated",
  PROJECT_CANCELLED: "project_cancelled",
  PROJECT_DELETED: "project_deleted",
  JOIN_ROOM: "join-room",
  SUBMIT_SNAPSHOT_SUCCESS: "submit_snapshot_success",
  AUTO_GENERATE_SNAPSHOT_DATA_SUCCESS: "auto_generate_snapshot_data_success",
  WITHDRAW_PARTICIPATION_FEE: "withdraw_participation_fee",
  WITHDRAW_TOKEN_FEE: "withdraw_token_fee",
  SET_PROJECT_CLAIMABLE: "set_project_claimable",
  PROJECT_EMERGENCY_CANCELLED: "project_emergency_cancelled",
};

export enum PROJECT_FAILED_EVENTS {
  SUBMIT_SNAPSHOT_FAILED = "submit_snapshot_failed",
  CANCEL_FAILED = "cancel_failed",
  EMERGENCY_CANCELLED_FAILED = "emergency_cancelled_failed",
  DELETE_FAILED = "delete_failed",
  ENABLE_CLAIM_FAILED = "enable_claim_failed",
  DISABLE_CLAIM_FAILED_FAILED = "disable_claim_failed",
  ADD_CONTRACT_ADMIN_FAILED = "add_contract_admin_failed",
  DELETE_CONTRACT_ADMIN_FAILED = "delete_contract_admin_failed",
  FUND_IDO_TOKEN_FAILED = "fund_ido_token_failed",
  SET_IDO_TOKEN_ADDRESS_FAILED = "set_ido_token_address_failed",
  UPDATE_TGE_DATE_FAILED = "update_tge_date_failed",
  ADJUST_GALAXY_END_TIME_FAILED = "adjust_galaxy_end_time_failed",
  ADJUST_CROWDFUNDING_END_TIME_FAILED = "adjust_crowdfunding_end_time_failed",
  ADJUST_BOTH_POOLS_END_TIME_FAILED = "adjust_both_pools_end_time_failed",
}

export enum USER_FAILED_EVENTS {
  PROJECT_DEPLOYED_FAILED = "project_deployed_failed",
  USER_BOUGHT_TOKENS_FAILED = "user_bought_tokens_failed",
  WITHDRAW_IDO_TOKEN_FAILED = "withdraw_IDO_token_failed",
  WITHDRAW_PARTICIPATION_FEE_FAILED = "withdraw_participation_fee_failed",
  WITHDRAW_COLLABORATOR_FUND_FAILED = "withdraw_collaborator_fund_failed",
  WITHDRAW_REDUNDANT_IDO_TOKEN_FAILED = "withdraw_redundant_IDO_token_failed",
  WITHDRAW_TOKEN_FEE_FAILED = "withdraw_token_fee_failed",
  WITHDRAW_PURCHASED_AMOUNT_FAILED = "withdraw_purchased_amount_failed",
}

export enum COMMON_FAILED_EVENTS {
  GRANT_ADMIN_UPDATED_FAILED = "grant_admin_updated_failed",
}
