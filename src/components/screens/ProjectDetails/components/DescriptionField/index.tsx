import { Box } from "@mui/system";
import dynamic from "next/dynamic";
import Event from "@ckeditor/ckeditor5-utils/src/eventinfo";
import { Typography, useTheme } from "@mui/material";
import { useEffect, useRef } from "react";

interface ICustomDescriptionField {
  formValues: any;
  label: string;
  disabled: boolean;
}
const CustomEditor = dynamic(() => import("@/components/atoms/Editor/Editor"), {
  ssr: false,
});

enum ColorEnums {
  DISABLED = "disabled",
  ERROR = "error",
  WHITE = "white",
  NONE = "none",
}

const renderTextColor = (type: ColorEnums, theme: any): string => {
  let color: string = "";
  switch (type) {
    case ColorEnums.DISABLED:
      color = theme.palette.text.disabled;
      break;

    case ColorEnums.ERROR:
      color = theme.palette.error.main;
      break;
    case ColorEnums.NONE:
      color = "";
      break;

    default:
      color = theme.palette.common.white;
      break;
  }
  return color;
};

export const CustomDescriptionField = ({
  formValues,
  label,
  disabled,
}: ICustomDescriptionField) => {
  const theme = useTheme();
  const wrapRef = useRef<any>(null);
  const { values, setFieldValue, errors, touched, setFieldTouched } =
    formValues;
  const valueData = values.description;
  const handleOnChange = (event: Event, editor: any) => {
    setFieldValue("description", editor.getData());
  };
  const handleBlur = (event: Event, editor: any) => {};
  const errorText =
    errors.description && touched.description ? errors.description : "";
  if (errorText && wrapRef.current) {
    wrapRef &&
      wrapRef?.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
  }
  return (
    <Box
      ref={wrapRef}
      sx={{
        color: disabled
          ? renderTextColor(ColorEnums.DISABLED, theme)
          : renderTextColor(ColorEnums.WHITE, theme),
        position: "relative",
        ".label": {
          position: "absolute",
          top: "-10px",
          zIndex: 2,
          left: "10px",
          backgroundColor: theme.palette.grey[400],
          color: `${
            !!errorText
              ? renderTextColor(ColorEnums.ERROR, theme)
              : renderTextColor(ColorEnums.NONE, theme)
          }`,
          padding: "0 3px",
          fontSize: "10px",
        },
        ".ck-reset_all": {
          position: "absolute !important",
          bottom: 30,
          right: "10px",
          zIndex: 10,
        },
        ".ck-ballon-panel_visible": {
          display: "none !important",
        },
        ".ck-content": {
          paddingBottom: "6rem !important",
          backgroundColor: `${theme.palette.grey[400]} !important`,
          height: "350px",
        },
        ".ck .ck-powered-by": {
          display: "none !important",
        },
        img: {
          height: "100%",
          width: "100%",
        },
        ".ck-toolbar": {
          backgroundColor: `#546a8e !important`,
          border: "none !important",
          width: "38rem !important",
        },
        li: {
          listStylePosition: "inside !important",
        },
        ".ck-editor__editable_inline": {
          padding: "0 15px !important",
        },
        ".ck-editor__editable:not(.ck-focused)": {
          borderColor: `${
            !!errorText ? theme.palette.error.main : theme.palette.grey[300]
          } !important`,
        },
        ".ck-editor__editable.ck-rounded-corners": {
          borderColor: `${
            !!errorText ? theme.palette.error.main : theme.palette.grey[300]
          } !important`,
        },
        ".ck-sticky-panel__content": {
          width: "450px !important",
        },
        ".ck-button": {
          color: "black !important",
        },
        ".ck .ck-editor__editable": {
          backgroundColor: `${theme.palette.grey[400]} !important`,
          height: "350px",
          borderRadius: "5px",
          p: {
            fontSize: "14px",
          },
          ".textSmall": {
            fontSize: "13px",
          },
          ".textTiny": {
            fontSize: "12px",
          },
        },
        ".ck.ck-toolbar__separator ": {
          background: "transparent !important",
        },
        ".ck-toolbar__vertical": {
          width: "3rem !important",
        },
        ".ck-dropdown__panel-visible": {
          border: "none !important",
        },
        ".ck-dropdown__panel_sw": {
          right: "-3px !important",
        },
      }}
    >
      <label className="label disabled">{label}</label>
      <CustomEditor
        data={valueData}
        onChange={handleOnChange}
        onBlur={handleBlur}
        disabled={disabled}
      />
      {errorText && (
        <Typography variant={"body2"} color="error.main" mt="3px">
          {errorText}
        </Typography>
      )}
    </Box>
  );
};
