import React, { useMemo } from "react";
import { AppFile, Issue } from "api/models";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Truncate,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { useFilesQuery } from "queries/files";
import { useRulesQuery } from "queries/rules";

import { getMarkdown } from "utils/rule-utils";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

interface IIssueOverviewProps {
  issue: Issue;
  onShowFile: (file: AppFile) => void;
}

export const IssueOverview: React.FC<IIssueOverviewProps> = ({
  issue,
  onShowFile,
}) => {
  const allFiles = useFilesQuery();
  const allRules = useRulesQuery();

  const rule = useMemo(() => {
    return allRules.data?.find((rule) => rule.id === issue.rule.id);
  }, [issue, allRules.data]);

  const files = useMemo(() => {
    return (allFiles.data || []).filter((file) => {
      return file.hints?.some((hint) => hint.rule.id === issue.rule.id);
    });
  }, [issue, allFiles.data]);

  return (
    <Grid hasGutter>
      <GridItem md={5}>
        <Card isCompact isFullHeight>
          <CardBody>
            <TableComposable aria-label="Files table" variant="compact">
              <Thead>
                <Tr>
                  <Th>File</Th>
                  <Th>Incidents found</Th>
                </Tr>
              </Thead>
              <Tbody>
                {files.map((file) => (
                  <Tr key={file.filename}>
                    <Td dataLabel="File">
                      {file.fileContent ? (
                        <Button variant="link" onClick={() => onShowFile(file)}>
                          <Truncate content={file.filename} />
                        </Button>
                      ) : (
                        file.filename
                      )}
                    </Td>
                    <Td dataLabel="Incidents found">
                      <Badge isRead>1</Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </TableComposable>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem md={7}>
        {rule && (
          <Card isCompact isFullHeight>
            <CardBody>
              <ReactMarkdown
                className="markdown-body"
                children={getMarkdown(rule)}
                remarkPlugins={[remarkGfm]}
                linkTarget="_blank"
              />
            </CardBody>
          </Card>
        )}
      </GridItem>
    </Grid>
  );
};
