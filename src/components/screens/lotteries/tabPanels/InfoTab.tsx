// Library imports
import { Box, Stack } from "@mui/material";
import { TabPanel } from "@mui/lab";
import { Form, Formik } from "formik";
import dayjs from "dayjs";

// Component imports
import InputField from "@/components/atoms/InputField";
import { DatePickerField } from "@/components/atoms/DatePickerField";
import { useSelectorLotteryDetails } from "@/store/hook";

function InfoTab() {
  const { current: lotteryDetails } = useSelectorLotteryDetails();
  const { project, openDate, closeDate, additionalRule } = lotteryDetails;

  return (
    <TabPanel value="info">
      <Formik
        validateOnChange={true}
        initialValues={{
          project: project || "",
          additionalRule: additionalRule || "",
          openDate: openDate || new Date(),
          closeDate: closeDate || new Date(),
        }}
        onSubmit={() => console.log("onSubmit")}
      >
        {({
          isSubmitting,
          setFieldValue,
          setFieldError,
          errors,
          setFieldTouched,
          touched,
        }) => (
          <Box sx={{ pt: 2 }}>
            <Form>
              <Stack spacing={3}>
                <InputField
                  label={"Project"}
                  name={"project"}
                  value={project}
                  shrink={true}
                />
                <InputField
                  label={"Additional Rule"}
                  name={"additionalRule"}
                  value={additionalRule}
                  shrink={true}
                />
                <Box sx={{ display: "flex", gap: "12px" }}>
                  <DatePickerField
                    name="openDate"
                    label="Open Date"
                    value={openDate}
                    minDateTime={dayjs()}
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                    setFieldTouched={setFieldTouched}
                    errors={errors}
                    touched={touched}
                    errorMessage="Open date must be current date and onward."
                  />
                  <DatePickerField
                    name="closeDate"
                    label="Close Date"
                    value={closeDate}
                    minDateTime={dayjs(openDate || "")}
                    setFieldValue={setFieldValue}
                    setFieldError={setFieldError}
                    setFieldTouched={setFieldTouched}
                    errors={errors}
                    touched={touched}
                    errorMessage="End time cannot be before start time"
                  />
                </Box>
              </Stack>
            </Form>
          </Box>
        )}
      </Formik>
    </TabPanel>
  );
}

export default InfoTab;
