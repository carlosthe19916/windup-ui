import React from "react";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";
import { SimpleSelect } from "@project-openubl/lib-ui";

export interface ISelectRiskFilterProps {
  value?: string[];
  options?: string[];
  onChange: (values: string[]) => void;
}

export const SelectRiskFilter: React.FC<ISelectRiskFilterProps> = ({
  value = [],
  options = [],
  onChange,
}) => {
  return (
    <SimpleSelect
      toggleIcon={<FilterIcon />}
      variant={SelectVariant.checkbox}
      aria-label="tag"
      aria-labelledby="tag"
      placeholderText="Tag"
      value={value}
      options={options}
      onChange={(option) => {
        const optionValue = option as string;

        const elementExists = value.some((f) => f === optionValue);
        let newElements: string[];
        if (elementExists) {
          newElements = value.filter((f) => f !== optionValue);
        } else {
          newElements = [...value, optionValue];
        }

        onChange(newElements);
      }}
      hasInlineFilter
      onClear={() => onChange([])}
    />
  );
};
