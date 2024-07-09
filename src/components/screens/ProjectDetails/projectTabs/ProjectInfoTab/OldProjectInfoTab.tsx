import { getPermissionOfResource, RESOURCES } from "@/core/ACLConfig";
import { APIClient } from "@/core/api";
import { getSpecificPropertiesFromObject } from "@/helpers/objectFormatter";
import { Country } from "@/types";
import { Form, Formik } from "formik";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { WrappedInputTitle } from "../../components";
import {
  ProjectInfoStepOld,
  SocialNetworksStepOld,
  TokenInfoStepOld,
} from "../../formStep";
import { mappingEditableData } from "../../initData";
import { useSelectorAuth, useSelectorProjectDetail } from "@/store/hook";

const ProjectInfoTab = () => {
  const { current: projectDetail } = useSelectorProjectDetail();
  const { role } = useSelectorAuth();
  const permissionOfResource = getPermissionOfResource(
    role,
    RESOURCES.PROJECT_INFO,
  );
  const [countries, setCountries] = useState<Country[]>([]);
  const newObject = getSpecificPropertiesFromObject(
    projectDetail,
    mappingEditableData,
  );

  useEffect(() => {
    const getCountries = async () => {
      const result = await APIClient.getInstance().countries.list();
      if (!result) {
        return;
      }
      setCountries(result?.data);
    };

    getCountries();
  }, []);

  return (
    <>
      <Formik
        validateOnChange={true}
        initialValues={{ ...newObject } as any}
        onSubmit={() => {}}
      >
        {({
          values,
          setFieldTouched,
          setFieldValue,
          setFieldError,
          errors,
          touched,
        }) => {
          const formValues = {
            values,
            setFieldTouched,
            setFieldValue,
            setFieldError,
            errors,
            touched,
          };
          return (
            <Form>
              <ProjectInfoStepOld
                formValues={formValues}
                countries={countries}
                permission={permissionOfResource}
              />
              <WrappedInputTitle>Token Info</WrappedInputTitle>
              <TokenInfoStepOld
                formValues={formValues}
                permission={permissionOfResource}
              />
              <WrappedInputTitle>Social Networks</WrappedInputTitle>
              <SocialNetworksStepOld
                formValues={formValues}
                permission={permissionOfResource}
              />
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default ProjectInfoTab;
