import React, { useMemo, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

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
  SearchInput,
  SelectVariant,
  Spinner,
  Text,
  TextContent,
  Title,
  Toolbar,
  ToolbarChip,
  ToolbarChipGroup,
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
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
  SimpleSelect,
  useToolbar,
  OptionWithValue,
} from "@project-openubl/lib-ui";
import { useSelectionState } from "@migtools/lib-ui";

import {
  SimpleContextSelector,
  Context,
  useSimpleContext,
} from "context/simple-context";

import { IssueProcessed } from "api/processed-models";

import { useApplicationsQuery } from "queries/applications";
import { useRulesQuery } from "queries/rules";
import { useFilesQuery } from "queries/files";
import { useIssuesQuery } from "queries/issues";

import { RuleEditor } from "./components/rule-editor";
import { Technologies } from "./components/technologies";
import { IssueOverview } from "./components/issue-overview";
import { FileEditor } from "./components/file-editor";
import { technologiesToArray } from "utils/rule-utils";
import { Technology } from "api/models";

const toOption = (option: string | ToolbarChip): OptionWithValue => {
  if (typeof option === "string") {
    const toStringFn = () => option;
    return {
      value: option,
      toString: toStringFn,
      compareTo: (other: string | OptionWithValue) => {
        return typeof other === "string"
          ? toStringFn().toLowerCase().includes(other.toLocaleLowerCase())
          : option === other.value;
      },
    };
  } else {
    const toStringFn = () => option.node as string;
    return {
      value: option.key,
      toString: toStringFn,
      compareTo: (other: string | OptionWithValue) => {
        return typeof other === "string"
          ? toStringFn().toLowerCase().includes(other.toLowerCase())
          : option.key === other.value;
      },
    };
  }
};

const toToolbarChip = (option: OptionWithValue): ToolbarChip => {
  return {
    key: option.value,
    node: option.toString(),
  };
};

const DataKey = "DataKey";

const columns: ICell[] = [
  {
    title: "Issue",
    transforms: [cellWidth(35), sortable],
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
    title: "Total incidents",
    transforms: [cellWidth(10)],
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
  switch (columnIndex) {
    case 1: // name
      return a.name.localeCompare(b.name);
    default:
      return 0;
  }
};

const getRow = (rowData: IRowData): IssueProcessed => {
  return rowData[DataKey];
};

export const IssuesList: React.FC = () => {
  const matchIssuesPage = useMatch("/issues");
  const matchAllApplicationsPage = useMatch("/issues/applications");
  const matchSingleApplicationPage = useMatch(
    "/issues/applications/:applicationId"
  );

  const applicationId = matchAllApplicationsPage
    ? ""
    : matchSingleApplicationPage?.params.applicationId;

  const navigate = useNavigate();

  const appContext = useSimpleContext();
  const onContextChange = (context: Context) => {
    navigate("/issues/applications/" + context.key);
  };

  // Filters
  const [filterText, setFilterText] = useState("");
  const { filters, addFilter, setFilter, removeFilter, clearAllFilters } =
    useToolbar<
      | "name"
      | "category"
      | "levelOfEffort"
      | "sourceTechnology"
      | "targetTechnology",
      ToolbarChip
    >();

  // Queries
  const allApplications = useApplicationsQuery();
  const allIssues = useIssuesQuery();
  const allRules = useRulesQuery();
  const allFiles = useFilesQuery();

  // Modal
  const issueModal = useModal<"showRule", IssueProcessed>();
  const issueModalMappedRule = useMemo(() => {
    return allRules.data?.find((rule) => rule.id === issueModal.data?.ruleId);
  }, [allRules.data, issueModal.data]);

  const fileModal = useModal<"showFile", string>();
  const fileModalMappedFile = useMemo(() => {
    return allFiles.data?.find((file) => file.id === fileModal.data);
  }, [allFiles.data, fileModal.data]);

  const issues = useMemo(() => {
    if (appContext.currentContext?.key === "") {
      return [...(allIssues.data || [])].flatMap((e) => e.issues);
    }

    return (
      allIssues.data?.find(
        (f) => f.applicationId === appContext.currentContext?.key
      )?.issues || []
    );
  }, [allIssues, appContext.currentContext]);

  //
  const categories = useMemo(() => {
    const allCategories = (allIssues.data || [])
      .flatMap((f) => f.issues)
      .map((e) => e.category);
    return Array.from(new Set(allCategories)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [allIssues.data]);

  const levelOfEfforts = useMemo(() => {
    const allLevelOfEfforts = (allIssues.data || [])
      .flatMap((f) => f.issues)
      .map((e) => e.levelOfEffort);
    return Array.from(new Set(allLevelOfEfforts)).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [allIssues.data]);

  const technologies = useMemo(() => {
    const sourceTechnologies = technologiesToArray(
      (allRules.data || [])
        .flatMap((e) => e.sourceTechnology)
        .reduce((prev, current) => {
          return current ? [...prev, current] : prev;
        }, [] as Technology[])
    );
    const targetTechnologies = technologiesToArray(
      (allRules.data || [])
        .flatMap((e) => e.targetTechnology)
        .reduce((prev, current) => {
          return current ? [...prev, current] : prev;
        }, [] as Technology[])
    );
    return { sourceTechnologies, targetTechnologies };
  }, [allRules.data]);

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
      let isFilterTextFilterCompliant = true;
      if (filterText && filterText.trim().length > 0) {
        isFilterTextFilterCompliant =
          item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      }

      let isCategoryFilterCompliant = true;
      const selectedCategories = filters.get("category") || [];
      if (selectedCategories.length > 0) {
        isCategoryFilterCompliant = selectedCategories.some(
          (f) => item.category === f.key
        );
      }

      let isLevelOfEffortCompliant = true;
      const selectedLevelOfEfforts = filters.get("levelOfEffort") || [];
      if (selectedLevelOfEfforts.length > 0) {
        isLevelOfEffortCompliant = selectedLevelOfEfforts.some(
          (f) => item.levelOfEffort === f.key
        );
      }

      // let isSourceCompliant = true;
      // const selectedSources = filters.get("sourceTechnology") || [];
      // if (selectedSources.length > 0) {
      //   isSourceCompliant = selectedSources.some(
      //     (f) => item.ruleId === f.key
      //   );
      // }

      return (
        isFilterTextFilterCompliant &&
        isCategoryFilterCompliant &&
        isLevelOfEffortCompliant
        // isSourceCompliant
      );
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
            title: "Missing",
          },
          {
            title: "Missing",
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
                <div className="pf-u-m-sm">
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
                contextKeyFromURL={applicationId}
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
          {matchIssuesPage ? (
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
          ) : (
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
              toolbarClearAllFilters={clearAllFilters}
              filtersApplied={filterText.trim().length > 0}
              toolbarToggle={
                <>
                  <ToolbarItem variant="search-filter">
                    <SearchInput
                      value={filterText}
                      onChange={setFilterText}
                      onSearch={(value) => {
                        addFilter("name", { key: value, node: value });
                        setFilterText("");
                      }}
                    />
                  </ToolbarItem>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarFilter
                      chips={filters.get("category")}
                      deleteChip={(
                        category: string | ToolbarChipGroup,
                        chip: ToolbarChip | string
                      ) => removeFilter("category", chip)}
                      deleteChipGroup={() => setFilter("category", [])}
                      categoryName={{ key: "category", name: "Category" }}
                    >
                      <SimpleSelect
                        maxHeight={300}
                        variant={SelectVariant.checkbox}
                        aria-label="category"
                        aria-labelledby="category"
                        placeholderText="Category"
                        value={filters.get("category")?.map(toOption)}
                        options={categories.map(toOption)}
                        onChange={(option) => {
                          const optionValue = option as OptionWithValue<string>;

                          const elementExists = (
                            filters.get("category") || []
                          ).some((f) => f.key === optionValue.value);
                          let newElements: ToolbarChip[];
                          if (elementExists) {
                            newElements = (
                              filters.get("category") || []
                            ).filter((f) => f.key !== optionValue.value);
                          } else {
                            newElements = [
                              ...(filters.get("category") || []),
                              toToolbarChip(optionValue),
                            ];
                          }

                          setFilter("category", newElements);
                        }}
                        hasInlineFilter
                        onClear={() => setFilter("category", [])}
                      />
                    </ToolbarFilter>
                  </ToolbarGroup>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarFilter
                      chips={filters.get("levelOfEffort")}
                      deleteChip={(
                        category: string | ToolbarChipGroup,
                        chip: ToolbarChip | string
                      ) => removeFilter("levelOfEffort", chip)}
                      deleteChipGroup={() => setFilter("levelOfEffort", [])}
                      categoryName={{
                        key: "levelOfEffort",
                        name: "Level of effort",
                      }}
                    >
                      <SimpleSelect
                        maxHeight={300}
                        variant={SelectVariant.checkbox}
                        aria-label="levelOfEffort"
                        aria-labelledby="levelOfEffort"
                        placeholderText="Level effort"
                        value={filters.get("levelOfEffort")?.map(toOption)}
                        options={levelOfEfforts.map(toOption)}
                        onChange={(option) => {
                          const optionValue = option as OptionWithValue<string>;

                          const elementExists = (
                            filters.get("levelOfEffort") || []
                          ).some((f) => f.key === optionValue.value);
                          let newElements: ToolbarChip[];
                          if (elementExists) {
                            newElements = (
                              filters.get("levelOfEffort") || []
                            ).filter((f) => f.key !== optionValue.value);
                          } else {
                            newElements = [
                              ...(filters.get("levelOfEffort") || []),
                              toToolbarChip(optionValue),
                            ];
                          }

                          setFilter("levelOfEffort", newElements);
                        }}
                        hasInlineFilter
                        onClear={() => setFilter("levelOfEffort", [])}
                      />
                    </ToolbarFilter>
                  </ToolbarGroup>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarFilter
                      chips={filters.get("sourceTechnology")}
                      deleteChip={(
                        category: string | ToolbarChipGroup,
                        chip: ToolbarChip | string
                      ) => removeFilter("sourceTechnology", chip)}
                      deleteChipGroup={() => setFilter("sourceTechnology", [])}
                      categoryName={{
                        key: "sourceTechnology",
                        name: "Source",
                      }}
                    >
                      <SimpleSelect
                        maxHeight={300}
                        variant={SelectVariant.checkbox}
                        aria-label="sourceTechnology"
                        aria-labelledby="sourceTechnology"
                        placeholderText="Source"
                        value={filters.get("sourceTechnology")?.map(toOption)}
                        options={technologies.sourceTechnologies.map(toOption)}
                        onChange={(option) => {
                          const optionValue = option as OptionWithValue<string>;

                          const elementExists = (
                            filters.get("sourceTechnology") || []
                          ).some((f) => f.key === optionValue.value);
                          let newElements: ToolbarChip[];
                          if (elementExists) {
                            newElements = (
                              filters.get("sourceTechnology") || []
                            ).filter((f) => f.key !== optionValue.value);
                          } else {
                            newElements = [
                              ...(filters.get("sourceTechnology") || []),
                              toToolbarChip(optionValue),
                            ];
                          }

                          setFilter("sourceTechnology", newElements);
                        }}
                        hasInlineFilter
                        onClear={() => setFilter("sourceTechnology", [])}
                      />
                    </ToolbarFilter>
                    <ToolbarFilter
                      chips={filters.get("targetTechnology")}
                      deleteChip={(
                        category: string | ToolbarChipGroup,
                        chip: ToolbarChip | string
                      ) => removeFilter("targetTechnology", chip)}
                      deleteChipGroup={() => setFilter("targetTechnology", [])}
                      categoryName={{
                        key: "targetTechnology",
                        name: "Target",
                      }}
                    >
                      <SimpleSelect
                        maxHeight={300}
                        variant={SelectVariant.checkbox}
                        aria-label="targetTechnology"
                        aria-labelledby="targetTechnology"
                        placeholderText="Target"
                        value={filters.get("targetTechnology")?.map(toOption)}
                        options={technologies.targetTechnologies.map(toOption)}
                        onChange={(option) => {
                          const optionValue = option as OptionWithValue<string>;

                          const elementExists = (
                            filters.get("targetTechnology") || []
                          ).some((f) => f.key === optionValue.value);
                          let newElements: ToolbarChip[];
                          if (elementExists) {
                            newElements = (
                              filters.get("targetTechnology") || []
                            ).filter((f) => f.key !== optionValue.value);
                          } else {
                            newElements = [
                              ...(filters.get("targetTechnology") || []),
                              toToolbarChip(optionValue),
                            ];
                          }

                          setFilter("targetTechnology", newElements);
                        }}
                        hasInlineFilter
                        onClear={() => setFilter("targetTechnology", [])}
                      />
                    </ToolbarFilter>
                  </ToolbarGroup>
                </>
              }
            />
          )}
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
