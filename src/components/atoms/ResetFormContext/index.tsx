import React, { useEffect, useMemo } from "react";
import { useFormikContext } from "formik";

const ResetFormContext = ({ showAddForm }: { showAddForm: boolean }) => {
  const { resetForm } = useFormikContext();

  useEffect(() => {
    if (!showAddForm) {
      resetForm();
    }
  }, [showAddForm, resetForm]);

  return null;
};

type MemoizedResetFormContextProps = {
  showAddForm: boolean;
};

const MemoizedResetFormContext = ({ showAddForm }: MemoizedResetFormContextProps) => {
  return useMemo(() => <ResetFormContext showAddForm={showAddForm} />, [showAddForm]);
};

export default MemoizedResetFormContext;
