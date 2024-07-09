import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import { Form, Formik } from 'formik';

// Components import
import { APIClient } from "@/core/api";
import Layout from "@/components/layout";
import { NextPageWithLayout } from "@/pages/_app";
import { AllAvailableJobIntervalTypes, Job, JobIntervalTypes } from "@/types";
import { Card } from "@/components/atoms/Card";
import { FloatingBackButton } from "@/components/atoms/FloatingBackButton";
import { useAlertContext } from "@/providers/AlertContext";
import { JobValidationSchema } from "@/components/screens/jobs/JobValidationSchema";
import InputField from "@/components/atoms/InputField";
import { LoadingButton } from "@mui/lab";
import { SelectField, SelectFieldOption } from "@/components/atoms/SelectField";

const apiClient = APIClient.getInstance();

const intervalOptions: SelectFieldOption[] = AllAvailableJobIntervalTypes.map(
  (interval: string, index: number): SelectFieldOption => {
    return {
      label: interval,
      value: interval,
    };
  }
);

const JobDetails: NextPageWithLayout = () => {
  const { errorAlertHandler, updateAlert } = useAlertContext();
  const router = useRouter();
  const { id: jobId } = router.query as { id: string };
  // if jobId === "createNew" then create new job, else edit job
  const isNewJob = jobId === "createNew" || jobId === undefined;

  const [nameOptions, setNameOptions] = useState<SelectFieldOption[]>([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState(0);
  const [interval, setInterval] = useState<JobIntervalTypes | string | null | undefined>(JobIntervalTypes.SECONDS);

  useEffect(() => {
    if (isNewJob) {
      // Get list of job names to create new job
      getJobNames();
    } else {
      getJobData();
    }
  }, [jobId])

  const getJobData = async () => {
    const response = await apiClient.jobs.findOne(jobId)
    const { data } = response;

    const { name, repeatInterval } = data;
    setName(name);
    if (!repeatInterval) return;
    const [duration, interval] = repeatInterval?.toString().split(' ');
    setDuration(parseInt(duration));
    setInterval(interval);
  }

  const getJobNames = async () => {
    const response = await apiClient.jobs.getJobNames()
    const { data: nameList } = response;
    const _nameOptions: SelectFieldOption[] = nameList.map(
      (_name: string, index: number): SelectFieldOption => {
        return {
          label: _name,
          value: _name,
        };
      }
    );
    setNameOptions(_nameOptions);
  };

  const submitJob = async (jobId: string, values: any) => {
    try {
      const data: Partial<Job> = {
        name: values.name,
        interval: `${values.duration} ${values.interval}`,
      };
      const result = isNewJob ? await apiClient.jobs.createJob(data) : await apiClient.jobs.cancelJob(jobId)
      errorAlertHandler(result);
      return data;
    } catch (error) {
      errorAlertHandler(error);
      console.error('error submitting job', error);
    }
  };

  return (
    <Stack
      spacing={2}
      sx={{ ml: 2 }}
    >
      <Card>
        <Stack spacing={2}>
          <Typography variant="h4">Job Details</Typography>
        </Stack>
      </Card>
      <Card>
        <Formik
          validateOnChange={true}
          enableReinitialize={!isNewJob}
          initialValues={{
            name,
            duration,
            interval,
          }}
          validationSchema={JobValidationSchema}
          onSubmit={async (data, { setSubmitting }) => {
            setSubmitting(true);
            await submitJob(jobId, data);
            setSubmitting(false);

            const route = '/admin/jobs';
            router.push(route);
          }}
        >
          {({ values, isSubmitting }) => (
            <Form>
              <Stack spacing={2.5} >
                <SelectField
                  name="name"
                  label="Name"
                  selectOptions={nameOptions}
                  value={values.name}
                  disabled={!isNewJob}
                />
                <InputField
                  label={'Duration'}
                  isMultiline={false}
                  name={'duration'}
                  disabled={!isNewJob}
                />
                <SelectField
                  name="interval"
                  label="Interval Type"
                  disabled={!isNewJob}
                  selectOptions={intervalOptions}
                />
                <LoadingButton
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isNewJob ? 'Create' : 'Cancel'} Job
                </LoadingButton>
              </Stack>
            </Form>
          )}
        </Formik>
      </Card>
      <FloatingBackButton />
    </Stack>
  );
};

JobDetails.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default JobDetails;
