import { CKEditor } from "@ckeditor/ckeditor5-react";
import Event from "@ckeditor/ckeditor5-utils/src/eventinfo";
import React from "react";
import { axiosClient } from "@/core/api/services/base/axios.instance";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

type Props = {
  disabled?: boolean;
  data?: string;
  onChange?: (event: Event, editor: any) => void;
  onReady?: (editor: any) => void;
  onBlur?: (event: Event, editor: any) => void;
  onFocus?: (event: Event, editor: any) => void;
};

const getTypeOfFile = (name: string) => {
  const nameArr = name.split(".");
  if (!nameArr?.length) return "";
  return nameArr[nameArr.length - 1];
};

const CustomEditor: React.FC<Props> = ({
  data,
  disabled,
  onChange,
  onBlur,
  onFocus,
}) => {
  function uploadAdapter(
    loader: any,
    allowedTypes: string[],
    maxSizeMB: number
  ) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const body = new FormData();
          loader.file.then(async (file: any) => {
            // Check file size
            const fileSizeMB = file.size / (1024 * 1024);
            // Check file size
            if (fileSizeMB > maxSizeMB) {
              reject(new Error(`Image size must not exceed ${maxSizeMB}MB`));
              return;
            }

            // Check file type
            const fileType = getTypeOfFile(file.name);
            if (!allowedTypes.includes(fileType)) {
              reject(new Error("Image type must be png/jpg"));
              return;
            }

            body.append("file", file);
            try {
              const urlImage = await axiosClient.post("storage/images", body, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              });
              if (urlImage) {
                resolve({
                  default: urlImage.data,
                });
              }
            } catch (error) {
              reject(error);
            }
          });
        });
      },
    };
  }
  function uploadPlugin(editor: any) {
    editor.plugins.get("FileRepository").createUploadAdapter = (
      loader: any
    ) => {
      const allowedTypes = ["png", "jpg"];
      const maxSizeMB = 15;
      return uploadAdapter(loader, allowedTypes, maxSizeMB);
    };
  }
  const config: any = {
    extraPlugins: [uploadPlugin],
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontfamily",
        "fontsize",
        "fontColor",
        "uploadImage",
        "|",
        "bold",
        "italic",
        "underline",
        "alignment",
        "fontBackgroundColor",
        "strikethrough",
        "|",
        "link",
        "blockQuote",
        "|",
        "bulletedList",
        "numberedList",
        "indent",
      ],
    },
    fontFamily: {
      options: [
        "Tenon",
        "Arial, Helvetica, sans-serif",
        "Courier New, Courier, monospace",
        "Georgia, serif",
        "Tahoma, Geneva, sans-serif",
        "Times New Roman, Times, seri",
      ],
    },
    ui: {
      poweredBy: {
        position: "border",
        side: "right",
        label: "",
        verticalOffset: 0,
        horizontalOffset: 0,
      },
    },
  };
  return (
    <CKEditor
      editor={DecoupledEditor as any}
      config={config}
      data={data}
      disabled={disabled}
      onReady={(editor) => {
        editor.ui
          .getEditableElement()
          ?.parentElement.insertBefore(
            editor.ui.view.toolbar.element,
            editor.ui.getEditableElement()
          );
      }}
      onChange={onChange}
      onBlur={onBlur}
      onFocus={(e) => {
        onFocus;
      }}
    />
  );
};

export default CustomEditor;
