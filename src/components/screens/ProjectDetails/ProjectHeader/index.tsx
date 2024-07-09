import {
  AllowedNetwork,
  EProjectAsyncStatus,
  PoolStatus,
  ProjectStages,
  ProjectStatus,
} from "@/types";
import { Box, Typography, styled } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import PublishProjectButton from "./PublishProjectButton";
import CancelProjectButton from "./CancelProjectButton";
import ViewProposalButton from "./ViewProposalButton";
import {
  PERMISSION,
  RESOURCES,
  getPermissionOfResource,
} from "@/core/ACLConfig";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";
import { ActiveProjectIcon } from "@/components/icons";
import { ProjectTypeEnums } from "../initData";
import DeleteProjectButton from "./DeleteProjectButton";
import dayjs from "dayjs";
import { detectPools, formatBigNumberToDecimal } from "@/helpers";
import { ExternalLink } from "@/components/atoms/ExternalLink";
import { LinkIcon } from "@/components/icons/LinkIcon";
import ClaimableButton from "./ClaimableProjectButton";
import BigNumber from "bignumber.js";
import { APIClient } from "@/core/api";
import WithdrawType from "@/types/withdraw";
import theme from "@/theme";
import { LOCKUP } from "@/helpers/constant";

const TextWrapper = styled("div")({
  display: "flex",
  gap: 5,
  margin: "5px 0px",
});

export const roundUp = (divisor: number | string, price: number) => {
  return BigNumber(divisor)
    .dividedBy(new BigNumber(price))
    .decimalPlaces(2, BigNumber.ROUND_CEIL)
    .toNumber();
};
const client = APIClient.getInstance();

export const ProjectHeader = () => {
  const [isProposalApproved, setIsProposalApproved] = useState(false);
  const [infoDialogOpen, setInfoDialogOpen] = useState<boolean>(false);
  const { current: projectDetails } = useSelectorProjectDetail();
  const { role } = useSelectorAuth();
  const {
    _id,
    status,
    pools,
    network,
    projectType,
    vesting,
    fundedToken,
    totalRaise,
    token,
    purchaseToken,
    deploy_status,
    deploy_by,
    stage,
  } = projectDetails;
  const poolAddress = pools[0]?.contractAddress;
  const { contractAddress: vestingContractAddress, TGEDate } = vesting;
  const { symbol, price, decimal } = token;
  const [purchaseAmount, setPurchaseAmount] = useState(0);

  const galaxyOpenTime = detectPools(pools)?.galaxyPool?.galaxyOpenTime;
  const crowdfundingPool = detectPools(pools)?.crowdfundingPool;

  const permissionPublish = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_PUBLISH,
  );
  const permissionCancel = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_CANCEL,
  );
  const permissionDelete = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_DELETE,
  );
  const permissionClaimable = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_CLAIMABLE,
  );
  const [isWithdrawn, setIsWithdrawn] = useState<boolean>(false);

  useEffect(() => {
    if (!poolAddress || !purchaseToken) return;
    const getPurchasedAmount = async () => {
      const networkLabel = AllowedNetwork[network];

      const _totalPurchasedAmount = await client.contracts.getPurchasedAmount(
        poolAddress,
        networkLabel,
      );
      const _projectFee = formatBigNumberToDecimal(
        _totalPurchasedAmount,
        purchaseToken.decimal,
      );

      setPurchaseAmount(Number(_projectFee));
    };

    getPurchasedAmount();
  }, []);

  useEffect(() => {
    (async () => {
      if (!deploy_by) return;
      const withdrawRedundantData: any = await client.withdraws.getWithdrawData(
        WithdrawType.REDUNDANT_IDO_TOKEN,
        _id,
        deploy_by,
      );
      setIsWithdrawn(withdrawRedundantData.length > 0);
    })();
  }, [_id, deploy_by]);

  const projectAction = useMemo(() => {
    switch (status) {
      case ProjectStatus.DRAFT:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              height: "140px",
            }}
          >
            {!permissionPublish.includes(PERMISSION.NONE) && (
              <PublishProjectButton />
            )}
            {!permissionDelete.includes(PERMISSION.NONE) && (
              <DeleteProjectButton />
            )}
          </Box>
        );
      case ProjectStatus.PUBLISHED:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              height: "140px",
            }}
          >
            {!permissionCancel.includes(PERMISSION.NONE) && (
              <CancelProjectButton />
            )}
            {!permissionDelete.includes(PERMISSION.NONE) && (
              <DeleteProjectButton />
            )}
          </Box>
        );
      case ProjectStatus.LIVE:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "flex-end",
              height: "140px",
            }}
          >
            {!permissionCancel.includes(PERMISSION.NONE) && (
              <CancelProjectButton />
            )}
            {!permissionDelete.includes(PERMISSION.NONE) &&
              (poolAddress ? (
                dayjs().isBefore(dayjs(galaxyOpenTime)) && (
                  <DeleteProjectButton />
                )
              ) : (
                <DeleteProjectButton />
              ))}
          </Box>
        );
      case ProjectStatus.FINISHED:
        return (
          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            {!!purchaseAmount &&
              dayjs().isAfter(dayjs(TGEDate)) &&
              !permissionClaimable.includes(PERMISSION.NONE) &&
              purchaseAmount !== 0 && <ClaimableButton />}
            {dayjs().isBefore(dayjs(TGEDate).add(Number(LOCKUP), "minutes")) &&
              !permissionCancel.includes(PERMISSION.NONE) && (
                <CancelProjectButton />
              )}
          </Box>
        );
      case ProjectStatus.CANCELLED:
        return (
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
            }}
          >
            {!permissionDelete.includes(PERMISSION.NONE) &&
              (stage === ProjectStages.DEFAULT ||
                stage === ProjectStages.APPEARING) && <DeleteProjectButton />}
          </Box>
        );
    }
  }, [status, purchaseAmount, galaxyOpenTime]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        position: "relative",
      }}
    >
      <Box>
        <Typography variant="h4" color="primary.main">
          Project Details
        </Typography>
        <TextWrapper>
          <Typography variant="body1" color="grey.500">
            ID:
          </Typography>
          <Typography variant="body1"> {_id}</Typography>
        </TextWrapper>
        <TextWrapper>
          <Typography variant="body1" color="grey.500">
            Status:
          </Typography>
          <Typography
            variant="body1"
            sx={{ textTransform: "uppercase", fontWeight: 700 }}
            color="primary.main"
          >
            {status === ProjectStatus.LIVE && (
              <Typography
                variant="body2"
                component="span"
                sx={{ paddingRight: "5px" }}
              >
                <ActiveProjectIcon />
              </Typography>
            )}
            {status === ProjectStatus.CANCELLED ||
            status === ProjectStatus.EMERGENCY_CANCELLED
              ? "Canceled"
              : status}
          </Typography>
        </TextWrapper>

        <TextWrapper>
          <Typography component="span" variant="body1" color="grey.500">
            Pool Contract Address:
          </Typography>
          {poolAddress && (
            <ExternalLink network={network} address={poolAddress} />
          )}
        </TextWrapper>

        <TextWrapper>
          <Typography variant="body1" color="grey.500">
            Vesting Contract Address:
          </Typography>
          {vestingContractAddress && (
            <ExternalLink network={network} address={vestingContractAddress} />
          )}
        </TextWrapper>

        {projectType === ProjectTypeEnums.PUBLIC_SALE &&
        deploy_status === EProjectAsyncStatus.SUCCESS ? (
          <TextWrapper>
            <Typography variant="body1" color="grey.500">
              Vested IDO Tokens Balance:
            </Typography>
            <Typography variant="body1">
              {`${roundUp(
                formatBigNumberToDecimal(BigNumber(fundedToken), decimal),
                1,
              )} ${symbol} Token(s) / ${
                totalRaise ? roundUp(totalRaise, Number(price)) : ""
              } ${symbol} Token(s)`}
            </Typography>
            {isWithdrawn && (
              <Typography
                sx={{
                  color: theme.palette.text.primary,
                  backgroundColor: theme.palette.warning.dark,
                  px: "23px",
                  py: "2px",
                  borderRadius: "5px",
                  ml: 3,
                }}
              >
                Claimed
              </Typography>
            )}
          </TextWrapper>
        ) : (
          crowdfundingPool?.status === PoolStatus.CLOSED && (
            <TextWrapper>
              <Typography variant="body1" color="grey.500">
                Vested IDO Tokens Balance:
              </Typography>
              <Typography variant="body1">
                {`${roundUp(
                  formatBigNumberToDecimal(BigNumber(fundedToken), decimal),
                  1,
                )} ${symbol} Token(s) / ${
                  purchaseAmount ? roundUp(purchaseAmount, Number(price)) : "0"
                } ${symbol} Token(s)`}
              </Typography>
              {isWithdrawn && (
                <Typography
                  sx={{
                    color: theme.palette.text.primary,
                    backgroundColor: theme.palette.warning.dark,
                    px: "23px",
                    py: "2px",
                    borderRadius: "5px",
                    ml: 3,
                  }}
                >
                  Claimed
                </Typography>
              )}
            </TextWrapper>
          )
        )}
        {isProposalApproved && (
          <TextWrapper>
            <Typography variant="body1" color="grey.500">
              Proposal Status:
            </Typography>
            <Typography
              variant="body1"
              sx={{ textTransform: "uppercase", fontWeight: 700 }}
              color="primary.main"
            >
              <Typography
                variant="body2"
                component="span"
                sx={{ paddingRight: "5px" }}
              >
                <ActiveProjectIcon />
              </Typography>
              APPROVED
            </Typography>
            <Typography
              sx={{ cursor: "pointer" }}
              variant="body1"
              onClick={() => setInfoDialogOpen(true)}
            >
              <LinkIcon />
            </Typography>
          </TextWrapper>
        )}
      </Box>
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <ViewProposalButton
          setIsProposalApproved={setIsProposalApproved}
          infoDialogOpen={infoDialogOpen}
          setInfoDialogOpen={setInfoDialogOpen}
          purchaseAmount={purchaseAmount}
        />
        {projectAction}
      </Box>
    </Box>
  );
};
