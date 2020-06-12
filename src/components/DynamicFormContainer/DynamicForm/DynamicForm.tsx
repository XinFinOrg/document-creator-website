import styled from "@emotion/styled";
import { merge } from "lodash";
import React, { FunctionComponent } from "react";
import JsonForm from "react-jsonschema-form";
import tw from "twin.macro";
import { mixin } from "../../../styles";
import { FileUploadType, Form } from "../../../types";
import { AttachmentDropzone } from "./AttachmentDropzone";
import { CustomFieldTemplate, CustomObjectFieldTemplate } from "./CustomTemplates";
import { DataFileButton } from "./DataFileButton";

export interface DynamicForm {
  schema: Form["schema"];
  className?: string;
  formData: any;
  setFormData: (formData: any) => void;
  form: any;
}

export const DynamicFormRaw: FunctionComponent<DynamicForm> = ({
  schema,
  formData,
  setFormData,
  className,
  form,
}) => {
  console.log(form);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFormValue = (value: any): void => {
    if (!formData) return;
    setFormData({ ...formData, formData: merge(formData.formData, value) });
  };

  const handleUpload = (processedFiles: FileUploadType[]): void => {
    const attachedFile = formData.formData.attachments || [];
    const allAttachments = [...attachedFile, ...processedFiles];

    setFormData({
      ...formData,
      formData: { attachments: allAttachments },
    });
  };

  const handleRemoveUpload = (fileIndex: number): void => {
    const allAttachments = formData.formData.attachments.filter(
      (file: FileUploadType, index: number) => index !== fileIndex
    );

    setFormData({
      ...formData,
      formData: { attachments: allAttachments },
    });
  };

  const allowAttachments = !!form.attachments?.allow;
  const acceptedFormat = form.attachments?.accept ? form.attachments?.accept : "";

  return (
    <div className={`${className} max-w-screen-sm mx-auto mt-6`}>
      <div className="mb-10">
        <DataFileButton onDataFile={setFormValue} />
      </div>
      <JsonForm
        schema={schema}
        onChange={setFormData}
        formData={formData?.formData}
        ObjectFieldTemplate={CustomObjectFieldTemplate}
        FieldTemplate={CustomFieldTemplate}
      />
      {allowAttachments && (
        <AttachmentDropzone
          acceptedFormat={acceptedFormat}
          onUpload={handleUpload}
          onRemove={handleRemoveUpload}
          uploadedFiles={formData?.formData?.attachments}
        />
      )}
    </div>
  );
};

export const DynamicForm = styled(DynamicFormRaw)`
.form-group .form-group.field.field-object .dynamicForm-items {
  ${tw`
    my-4
  `}
}

legend {
  ${mixin.fontRobotoBold()}
  ${mixin.fontSize(20)}
  ${tw`
    text-grey-dark w-full mt-8 pt-6 capitalize border-t border-solid border-grey-lighter
  `}
}

.field-string, .field-integer, .field-number, .field-null {
  ${tw`
    flex flex-wrap items-center
  `}
}
.field-string .file-drop-zone {
  ${tw`flex flex-wrap w-full my-4`}
}

.checkbox label {
  ${tw`flex flex-wrap items-center w-full justify-center`}

  input {
    ${tw`mr-4`}
  }
}

.field-array {
  ${tw`
    mt-4
  `}
}

.array-item {
  ${tw`
    border-b border-grey-lighter border-solid pb-2 mb-4
  `}
}

label {
  ${tw`
    w-full sm:w-3/12 px-0 sm:px-4 sm:text-right text-grey-dark
  `}
}

.field-string [type=text], .field-number input, .field-integer input {
  ${tw`
    w-full sm:w-8/12 px-0 sm:px-2 h-10 rounded-none border border-solid border-grey-lighter
  `}
}

.btn {
  ${tw`
    border border-solid border-orange bg-orange rounded py-2 px-4 text-white m-2 shadow-md inline-block align-middle
  `}

  &:not(:disabled):not(.disabled):active,
  &:focus,
  &.focus,
  &:hover,
  &:active,
  &.active {
    box-shadow: -10px -10px 20px rgba(255, 255, 255, 0.2), 2px 2px 5px rgba(0, 0, 0, 0.4);
  }

  :first-of-type {
    ${tw`ml-0`}
  }

  :last-child {
    ${tw`mr-0`}
  }
}

.btn[type=submit] {
  display: none;
}

i.glyphicon {
  ${tw`hidden`}
}
.btn-add::after {
  content: "Add";
}
.array-item-move-up::after {
  content: "Move Up";
}
.array-item-move-down::after {
  content: "Move Down";
}
.array-item-remove::after {
  content: "Remove";
}

.item-pd-0,
.item-pd-0 > fieldset {
  ${tw`px-0`}
}

.help-block {
  ${tw`
    text-sm my-2 mx-0
  `}
}
`;
