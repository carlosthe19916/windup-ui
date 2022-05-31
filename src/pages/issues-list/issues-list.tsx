import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "github-markdown-css/github-markdown.css";

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Grid,
  GridItem,
  Label,
  Modal,
  PageSection,
  PageSectionVariants,
  Spinner,
  Split,
  SplitItem,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  Truncate,
} from "@patternfly/react-core";
import {
  cellWidth,
  IAction,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { ArrowUpIcon } from "@patternfly/react-icons";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

import {
  SimpleTableWithToolbar,
  useTable,
  useTableControls,
  ConditionalRender,
  useModal,
} from "@project-openubl/lib-ui";
import { useSelectionState } from "@konveyor/lib-ui";

import { useIssuesQuery } from "queries/issues";
import {
  SimpleContextSelector,
  Context,
  useSimpleContext,
} from "context/simple-context";
import { useApplicationsQuery } from "queries/applications";

import { ApplicationRoute } from "Routes";
import { IncidentFile, Issue } from "api/models";

const DataKey = "DataKey";

const columns: ICell[] = [
  { title: "Issue", transforms: [cellWidth(25), sortable] },
  {
    title: "Category",
    transforms: [cellWidth(10)],
  },
  {
    title: "Source technologies",
    transforms: [cellWidth(10)],
  },
  {
    title: "Target technologies",
    transforms: [cellWidth(10)],
  },
  {
    title: "Level of effort",
    transforms: [cellWidth(20)],
  },
  {
    title: "Total storypoints",
    transforms: [cellWidth(10)],
  },
];

export const compareByColumnIndex = (
  a: Issue,
  b: Issue,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // name
      return a.name.localeCompare(b.name);
    default:
      return 0;
  }
};

const getRow = (rowData: IRowData): Issue => {
  return rowData[DataKey];
};

export const IssuesList: React.FC = () => {
  const params = useParams<ApplicationRoute>();
  const navigate = useNavigate();

  const context = useSimpleContext();

  const issueModal = useModal<"showRule", Issue>();
  const incidentFileModal = useModal<"showFile", IncidentFile>();

  const applications = useApplicationsQuery();
  const issues = useIssuesQuery();
  const applicationIssues = useMemo(() => {
    return (
      issues.data?.find(
        (f) => `${f.application.id}` === context.currentContext?.key
      )?.issues || []
    );
  }, [issues, context.currentContext]);

  const {
    isItemSelected: isItemExpanded,
    toggleItemSelected: toggleItemExpanded,
  } = useSelectionState<Issue>({
    items: applicationIssues,
    isEqual: (a, b) => a.name === b.name,
  });

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<Issue>({
    items: applicationIssues,
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: compareByColumnIndex,
    filterItem: (item) => {
      return true;
    },
  });

  const onContextChange = (context: Context) => {
    navigate("/issues/applications/" + context.key);
  };

  const itemsToRow = (items: Issue[]) => {
    const rows: IRow[] = [];
    items.forEach((item) => {
      const isExpanded = isItemExpanded(item);

      rows.push({
        [DataKey]: item,
        isOpen: isExpanded,
        cells: [
          {
            title: item.name,
          },
          {
            title: item.category,
          },
          {
            title: (
              <Split hasGutter>
                {item.incident.rule.sourceTechnology?.map((f) => (
                  <SplitItem key={f.id}>
                    <Label isCompact color="blue">
                      {f.id}
                    </Label>
                  </SplitItem>
                ))}
              </Split>
            ),
          },
          {
            title: (
              <Split hasGutter>
                {item.incident.rule.targetTechnology?.map((f) => (
                  <SplitItem key={f.id}>
                    <Label isCompact color="blue">
                      {f.id}
                    </Label>
                  </SplitItem>
                ))}
              </Split>
            ),
          },
          {
            title: item.levelOfEffort,
          },
          {
            title:
              item.incident.storyPoints *
              item.incident.files
                .map((f) => f.incidentsFound)
                .reduce((a, b) => a + b, 0),
          },
        ],
      });

      // Expanded area
      if (isExpanded) {
        const markdown = [
          item.incident.hint.description,
          item.incident.hint.links
            .map((link, index) => `${index + 1}. [${link.title}](${link.href})`)
            .join("\n"),
        ].join("\n");

        rows.push({
          parent: rows.length - 1,
          fullWidth: true,
          cells: [
            {
              title: (
                <div className="pf-u-m-md">
                  <Grid hasGutter>
                    <GridItem md={5}>
                      <Card isCompact isFullHeight>
                        <CardBody>
                          <TableComposable
                            aria-label="Files table"
                            variant="compact"
                          >
                            <Thead>
                              <Tr>
                                <Th>File</Th>
                                <Th>Incidents found</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {item.incident.files.map((file) => (
                                <Tr key={file.name}>
                                  <Td dataLabel="File">
                                    {file.content ? (
                                      <Button
                                        variant="link"
                                        onClick={() =>
                                          incidentFileModal.open(
                                            "showFile",
                                            file
                                          )
                                        }
                                      >
                                        <Truncate content={file.name} />
                                      </Button>
                                    ) : (
                                      file.name
                                    )}
                                  </Td>
                                  <Td dataLabel="Incidents found">
                                    {file.incidentsFound}
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </TableComposable>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem md={7}>
                      <Card isCompact isFullHeight>
                        <CardBody>
                          <ReactMarkdown
                            className="markdown-body"
                            children={markdown}
                            remarkPlugins={[remarkGfm]}
                            linkTarget="_blank"
                          />
                        </CardBody>
                      </Card>
                    </GridItem>
                  </Grid>
                </div>
              ),
            },
          ],
        });
      }
    });

    return rows;
  };

  const rows: IRow[] = itemsToRow(pageItems);
  const actions: IAction[] = [
    {
      title: "View rule",
      onClick: (
        event: React.MouseEvent,
        rowIndex: number,
        rowData: IRowData,
        extraData: IExtraData
      ) => {
        const row = getRow(rowData);
        issueModal.open("showRule", row);
      },
    },
  ];

  return (
    <>
      <PageSection padding={{ default: "noPadding" }}>
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>Application:</ToolbarItem>
            <ToolbarItem>
              <SimpleContextSelector
                contextKeyFromURL={params.applicationId}
                allContexts={(applications.data || []).map((e) => ({
                  key: `${e.id}`,
                  label: e.name,
                }))}
                onChange={onContextChange}
              />
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
      </PageSection>
      <Divider />
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Issues</Text>
          <Text component="small">
            This report provides a concise summary of all issues identified.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <ConditionalRender
          when={applications.isLoading || issues.isLoading}
          then={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <ConditionalRender
            when={!context.currentContext}
            then={
              <Bullseye>
                <EmptyState>
                  <EmptyStateIcon icon={ArrowUpIcon} />
                  <Title headingLevel="h4" size="lg">
                    Select an application
                  </Title>
                  <EmptyStateBody>
                    Select an application whose data you want to get access to.
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            }
          >
            <SimpleTableWithToolbar
              hasTopPagination
              hasBottomPagination
              totalCount={filteredItems.length}
              // Expand
              onCollapse={(_event, _rowIndex, _isOpen, rowData) => {
                const issue = getRow(rowData);
                toggleItemExpanded(issue);
              }}
              // Sorting
              sortBy={
                currentSortBy || { index: undefined, defaultDirection: "asc" }
              }
              onSort={onChangeSortBy}
              // Pagination
              currentPage={currentPage}
              onPageChange={onPageChange}
              // Table
              rows={rows}
              cells={columns}
              actions={actions}
              // Fech data
              isLoading={issues.isFetching}
              loadingVariant="skeleton"
              fetchError={issues.isError}
              // Toolbar filters
              // toolbarClearAllFilters={clearAllFilters}
              filtersApplied={false}
            />
          </ConditionalRender>
        </ConditionalRender>
      </PageSection>

      <Modal
        title={`Rule ${issueModal.data?.incident.rule.name}`}
        isOpen={issueModal.isOpen && issueModal.action === "showRule"}
        onClose={issueModal.close}
        variant="large"
      >
        <CodeEditor
          isDarkTheme
          isLineNumbersVisible
          isReadOnly
          isMinimapVisible
          isLanguageLabelVisible
          isDownloadEnabled
          code={issueModal.data?.incident.rule.content}
          language={Language.xml}
          onEditorDidMount={(editor, monaco) => {
            editor.layout();
            editor.focus();
            monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
          }}
          height="600px"
        />
      </Modal>
      <Modal
        title={`File ${incidentFileModal.data?.name}`}
        isOpen={
          incidentFileModal.isOpen && incidentFileModal.action === "showFile"
        }
        onClose={incidentFileModal.close}
        variant="default"
      >
        <CodeEditor
          isDarkTheme
          isLineNumbersVisible
          isReadOnly
          isMinimapVisible
          isLanguageLabelVisible
          isDownloadEnabled
          code={incidentFileModal.data?.content}
          language={Language.java}
          onEditorDidMount={(editor, monaco) => {
            editor.layout();
            editor.focus();
            monaco.editor.getModels()[0].updateOptions({ tabSize: 5 });
          }}
          height="600px"
        />
      </Modal>
    </>
  );
};
