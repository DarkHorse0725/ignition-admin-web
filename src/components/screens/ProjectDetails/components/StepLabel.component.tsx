import { CompletedStepIcon } from "@/components/icons";
import { Step, StepLabel, Stepper, Typography, useTheme } from "@mui/material";
import { Box } from "@mui/system";

type IProps = {
  activeStep: number;
  dataStep: any[];
};

const WrapIcon = (props: { icon: string; background: string }) => {
  const { icon, background } = props;
  return (
    <Box
      sx={{
        padding: "4px 10px",
        borderRadius: "100%",
        fontSize: "14px",
        backgroundColor: background,
      }}
    >
      {icon}
    </Box>
  );
};
const LabelIcon = (props: any) => {
  const theme = useTheme();
  const { active, completed, icon } = props;
  if (completed) {
    return <CompletedStepIcon />;
  }
  return (
    <WrapIcon
      icon={icon}
      background={active ? theme.palette.primary.main : theme.palette.grey[600]}
    />
  );
};

export const StepLabelComponent = (props: IProps) => {
  const { activeStep, dataStep } = props;
  const theme = useTheme();
  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {dataStep.map((label, index) => {
          return (
            <Step
              key={label}
              sx={{
                " .Mui-disabled .MuiSvgIcon-root-MuiStepIcon-root": {
                  color: "red",
                },
                "& .MuiStepLabel-root .MuiStepLabel-iconContainer .MuiStepIcon-root":
                  {
                    color: theme.palette.grey[600],
                  },
                "& .MuiStepLabel-root .MuiStepLabel-iconContainer .Mui-active":
                  {
                    color: theme.palette.primary.main,
                  },
                "& .MuiStepLabel-root .MuiStepLabel-iconContainer .Mui-completed":
                  {
                    color: theme.palette.grey[800],
                  },
              }}
            >
              <StepLabel
                sx={{
                  "& .MuiStepLabel-labelContainer": {
                    color: theme.palette.grey[800],
                  },
                  "& .MuiStepLabel-label.Mui-active": {
                    color: theme.palette.common.white,
                  },
                  "& .MuiStepLabel-label.Mui-completed": {
                    color: theme.palette.common.white,
                  },
                }}
                StepIconComponent={LabelIcon}
              >
                <Typography sx={{ fontSize: 14 }}>{label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};
