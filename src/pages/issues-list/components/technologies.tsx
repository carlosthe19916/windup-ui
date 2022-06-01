import React from "react";
import { Technology } from "api/models";
import { Label, Split, SplitItem } from "@patternfly/react-core";

interface ITechnologiesProps {
  technologies: Technology[];
}

export const Technologies: React.FC<ITechnologiesProps> = ({
  technologies,
}) => {
  return (
    <Split hasGutter>
      {technologies.map((technology) => (
        <SplitItem key={technology.id}>
          <Label isCompact color="blue">
            {[technology.id, technology.versionRange]
              .filter((e) => e)
              .join(": ")}
          </Label>
        </SplitItem>
      ))}
    </Split>
  );
};
