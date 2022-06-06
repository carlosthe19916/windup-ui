import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Bullseye,
  Button,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Modal,
  PageSection,
  PageSectionVariants,
  Spinner,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  IAction,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  truncate,
} from "@patternfly/react-table";
import { ArrowUpIcon } from "@patternfly/react-icons";

import {
  SimpleTableWithToolbar,
  useTable,
  useTableControls,
  ConditionalRender,
  useModal,
} from "@project-openubl/lib-ui";
import { useSelectionState } from "@konveyor/lib-ui";

import {
  SimpleContextSelector,
  Context,
  useSimpleContext,
} from "context/simple-context";

import { ApplicationRoute } from "Routes";
import { IssueProcessed } from "api/processed-models";

import { useApplicationsQuery } from "queries/applications";
import { useRulesQuery } from "queries/rules";
import { useFilesQuery } from "queries/files";
import { useIssuesQuery } from "queries/issues";

import { RuleEditor } from "./components/rule-editor";
import { Technologies } from "./components/technologies";
import { IssueOverview } from "./components/issue-overview";
import { FileEditor } from "./components/file-editor";

const DataKey = "DataKey";

const columns: ICell[] = [
  {
    title: "Issue",
    transforms: [cellWidth(45), sortable],
    cellTransforms: [],
  },
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
    transforms: [cellWidth(15)],
    cellTransforms: [truncate],
  },
  {
    title: "Total storypoints",
    transforms: [cellWidth(10)],
  },
];

export const compareByColumnIndex = (
  a: IssueProcessed,
  b: IssueProcessed,
  columnIndex?: number
) => {
  return 0;
};

const getRow = (rowData: IRowData): IssueProcessed => {
  return rowData[DataKey];
};

export const IssuesList: React.FC = () => {
  const params = useParams<ApplicationRoute>();
  const navigate = useNavigate();

  const appContext = useSimpleContext();
  const onContextChange = (context: Context) => {
    navigate("/issues/applications/" + context.key);
  };

  const allApplications = useApplicationsQuery();
  const allIssues = useIssuesQuery();
  const allRules = useRulesQuery();
  const allFiles = useFilesQuery();

  const issueModal = useModal<"showRule", IssueProcessed>();
  const issueModalMappedRule = useMemo(() => {
    return allRules.data?.find((rule) => rule.id === issueModal.data?.ruleId);
  }, [allRules.data, issueModal.data]);

  const fileModal = useModal<"showFile", string>();
  const fileModalMappedFile = useMemo(() => {
    return allFiles.data?.find((file) => file.id === fileModal.data);
  }, [allFiles.data, fileModal.data]);

  const issues = useMemo(() => {
    return (
      allIssues.data?.find(
        (f) => f.applicationId === appContext.currentContext?.key
      )?.issues || []
    );
  }, [allIssues, appContext.currentContext]);

  const {
    isItemSelected: isRowExpanded,
    toggleItemSelected: toggleRowExpanded,
  } = useSelectionState<IssueProcessed>({
    items: issues,
    isEqual: (a, b) => a.id === b.id,
  });

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<IssueProcessed>({
    items: issues,
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: compareByColumnIndex,
    filterItem: (item) => {
      return true;
    },
  });

  const itemsToRow = (items: IssueProcessed[]) => {
    const rows: IRow[] = [];
    items.forEach((item) => {
      const isExpanded = isRowExpanded(item);

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
            title: <Technologies ruleId={item.ruleId} variant="source" />,
          },
          {
            title: <Technologies ruleId={item.ruleId} variant="target" />,
          },
          {
            title: item.levelOfEffort,
          },
          {
            title: 0,
          },
        ],
      });

      // Expanded area
      if (isExpanded) {
        rows.push({
          parent: rows.length - 1,
          fullWidth: true,
          cells: [
            {
              title: (
                <div className="pf-u-m-md">
                  <IssueOverview
                    issue={item}
                    onShowFile={(file) => fileModal.open("showFile", file)}
                  />
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
                allContexts={(allApplications.data || []).map((e) => ({
                  key: e.id,
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
          when={allApplications.isLoading || allIssues.isLoading}
          then={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          <ConditionalRender
            when={!appContext.currentContext}
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
                toggleRowExpanded(issue);
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
              isLoading={allIssues.isFetching}
              loadingVariant="skeleton"
              fetchError={allIssues.isError}
              // Toolbar filters
              // toolbarClearAllFilters={clearAllFilters}
              filtersApplied={false}
            />
          </ConditionalRender>
        </ConditionalRender>
      </PageSection>

      <Modal
        title={`Rule: ${issueModalMappedRule?.id}`}
        isOpen={issueModal.isOpen && issueModal.action === "showRule"}
        onClose={issueModal.close}
        variant="large"
      >
        {issueModalMappedRule && <RuleEditor rule={issueModalMappedRule} />}
      </Modal>
      <Modal
        title={`File ${fileModalMappedFile?.prettyPath}`}
        isOpen={fileModal.isOpen && fileModal.action === "showFile"}
        onClose={fileModal.close}
        variant="default"
        position="top"
        disableFocusTrap
        actions={[
          <Button key="close" variant="primary" onClick={fileModal.close}>
            Close
          </Button>,
        ]}
      >
        {fileModalMappedFile && <FileEditor file={fileModalMappedFile} />}
      </Modal>
    </>
  );
};
