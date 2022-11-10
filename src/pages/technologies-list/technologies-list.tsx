import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useMatch } from "react-router-dom";

import {
  Bullseye,
  Divider,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
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
  ToolbarContent,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  compoundExpand,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  TableComposable,
  Tbody,
  Td,
  Tr,
} from "@patternfly/react-table";
import { ArrowUpIcon, FilterIcon } from "@patternfly/react-icons";

import {
  SimpleTableWithToolbar,
  useTable,
  useTableControls,
  ConditionalRender,
  SimpleSelect,
  OptionWithValue,
} from "@project-openubl/lib-ui";

import {
  SimpleContextSelector,
  Context,
  useSimpleContext,
} from "context/simple-context";

import { useTechnologiesQuery } from "queries/technologies";
import { useApplicationsQuery } from "queries/applications";

import { useCellSelectionState } from "shared/hooks";

import {
  ALL_TECHNOLOGY_GROUPS,
  Application,
  TechnologyDetails,
  TechnologyGroup,
} from "api/models";

interface RowData {
  application: Application;
  technologyGroups: { [key in TechnologyGroup]: TechnologyDetails };
}

const getTechnologyEntriesSorted = (val: TechnologyDetails) => {
  return Object.entries(val).sort(([a], [b]) => a.localeCompare(b));
};

const DataKey = "DataKey";

const getRow = (rowData: IRowData): RowData => {
  return rowData[DataKey];
};

export const TechnologiesList: React.FC = () => {
  const matchTechnologiesPage = useMatch("/technologies");
  const matchAllTechnologiesPage = useMatch("/technologies/applications");
  const matchSingleTechnologyPage = useMatch(
    "/technologies/applications/:applicationId"
  );

  const applicationId = matchAllTechnologiesPage
    ? ""
    : matchSingleTechnologyPage?.params.applicationId;

  const navigate = useNavigate();

  const appContext = useSimpleContext();
  const onContextChange = (context: Context) => {
    navigate("/technologies/applications/" + context.key);
  };

  // Filters
  const [filterText, setFilterText] = useState("");
  const [technologyGroup, setTechnologyGroup] =
    useState<TechnologyGroup>("View");

  // Queries
  const allApplications = useApplicationsQuery();
  const allTechnologies = useTechnologiesQuery();

  const applications = useMemo(() => {
    const toRowData = (appsToMap: Application[]) => {
      return appsToMap.reduce((prev, current) => {
        const applicationTechnologies = allTechnologies.data?.find(
          (appTech) => appTech.applicationId === current.id
        );

        if (applicationTechnologies) {
          const rowData: RowData = {
            application: current,
            technologyGroups: applicationTechnologies.technologyGroups,
          };
          return [...prev, rowData];
        } else {
          return prev;
        }
      }, [] as RowData[]);
    };

    if (appContext.currentContext?.key === "") {
      return toRowData(allApplications.data || []);
    } else {
      const selectedApplication = allApplications.data?.find(
        (f) => f.id === appContext.currentContext?.key
      );

      return toRowData(selectedApplication ? [selectedApplication] : []);
    }
  }, [allApplications.data, allTechnologies.data, appContext.currentContext]);

  // Category Select filter
  const toOption = useCallback((option: ToolbarChip) => {
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
  }, []);

  const allCategoryOptions = useMemo(() => {
    if (applications.length > 0) {
      return ALL_TECHNOLOGY_GROUPS.map((group) => {
        const technologies = applications[0].technologyGroups[group];
        const numberOfTechnologies = Object.keys(technologies).length;
        return toOption({
          key: group,
          node: `${group} (${numberOfTechnologies})`,
        });
      });
    } else {
      return ALL_TECHNOLOGY_GROUPS.map((elem) =>
        toOption({ key: elem, node: elem })
      );
    }
  }, [applications, toOption]);

  // Columns
  const columnKeys: string[] = useMemo(() => {
    if (applications.length > 0) {
      return Object.entries(applications[0].technologyGroups)
        .map(([groupName, groupValue]) =>
          Object.keys(groupValue).map((technologyName) => {
            return technologyName;
          })
        )
        .flatMap((e) => e);
    } else {
      return [];
    }
  }, [applications]);

  const columns: ICell[] = useMemo(() => {
    let result: ICell[] = [
      {
        title: "Application",
        transforms: [sortable],
        cellTransforms: [],
      },
    ];

    if (applications.length > 0) {
      const technologies = applications[0].technologyGroups[technologyGroup];
      const techColumns = getTechnologyEntriesSorted(technologies).map(
        ([technologyName, technologyValue]) => {
          const colum: ICell = {
            title: technologyName,
            transforms: [sortable],
            cellTransforms: [compoundExpand],
            data: technologyName,
          };
          return colum;
        }
      );
      result = [...result, ...techColumns];
    }

    return result;
  }, [technologyGroup, applications]);

  const getColumn = useCallback(
    (colIndex: number): string => {
      return columns[colIndex].data;
    },
    [columns]
  );

  // Rows
  const { isCellSelected, isSomeCellSelected, toggleCellSelected } =
    useCellSelectionState<string, string>({
      rows: applications.map((f) => f.application.id),
      columns: columnKeys,
    });

  const compareByColumnIndex = (
    a: RowData,
    b: RowData,
    columnIndex?: number
  ) => {
    switch (columnIndex) {
      case 0:
        return a.application.name.localeCompare(b.application.name);
      default:
        if (columnIndex !== undefined) {
          const [, v1] = getTechnologyEntriesSorted(
            a.technologyGroups[technologyGroup]
          )[columnIndex - 1];
          const [, v2] = getTechnologyEntriesSorted(
            b.technologyGroups[technologyGroup]
          )[columnIndex - 1];

          return v1.total - v2.total;
        }

        return 0;
    }
  };

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<RowData>({
    items: applications,
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: compareByColumnIndex,
    filterItem: (item) => {
      let isFilterTextFilterCompliant = true;
      if (filterText && filterText.trim().length > 0) {
        isFilterTextFilterCompliant =
          item.application.name
            .toLowerCase()
            .indexOf(filterText.toLowerCase()) !== -1;
      }

      return isFilterTextFilterCompliant;
    },
  });

  const itemsToRow = (items: RowData[]) => {
    const rows: IRow[] = [];
    items.forEach((item) => {
      const technologies = getTechnologyEntriesSorted(
        item.technologyGroups[technologyGroup]
      );
      const numberOfTechnologies = Object.keys(technologies).length;

      const cells: ICell[] = technologies.map(
        ([technologyName, technologyValue]) => {
          return {
            title: technologyValue.total,
            props: {
              isOpen: isCellSelected(item.application.id, technologyName),
            },
          };
        }
      );

      rows.push({
        [DataKey]: item,
        isOpen: isSomeCellSelected(item.application.id, columnKeys),
        cells: [
          {
            title: item.application.name,
          },
          ...cells,
        ],
      });

      const parentIndex = rows.length - 1;

      // Expanded area
      technologies.forEach(([technologyName, { total, ...rest }], index) => {
        rows.push({
          parent: parentIndex,
          compoundParent: 1 + index,
          cells: [
            {
              title: (
                <div>
                  <TableComposable
                    aria-label="Simple table"
                    variant="compact"
                    isStriped
                  >
                    <Tbody>
                      {Object.entries(rest).map(([k, v], index) => (
                        <Tr key={index}>
                          <Td width={30} dataLabel={`key-${index}`}>
                            {k}
                          </Td>
                          <Td dataLabel={`val-${index}`}>{v}</Td>
                        </Tr>
                      ))}
                      <Tr>
                        <Td width={30} dataLabel="Total">
                          <strong>Total</strong>
                        </Td>
                        <Td width={70}>
                          <strong>{total}</strong>
                        </Td>
                      </Tr>
                    </Tbody>
                  </TableComposable>
                </div>
              ),
              props: {
                colSpan: numberOfTechnologies + 1,
                className: "pf-m-no-padding",
              },
            },
          ],
        });
      });
    });

    return rows;
  };

  const rows: IRow[] = itemsToRow(pageItems);

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
          <Text component="h1">Dependencies</Text>
          <Text component="small">
            This report is a statistic of technologies occurrences in the input
            applications. It shows how the technologies are distributed and is
            mostly useful when analysing many applications.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
        <ConditionalRender
          when={allTechnologies.isLoading}
          then={
            <Bullseye>
              <Spinner />
            </Bullseye>
          }
        >
          {matchTechnologiesPage ? (
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
              onExpand={(
                event: React.MouseEvent,
                rowIndex: number,
                colIndex: number,
                isOpen: boolean,
                rowData: IRowData,
                extraData: IExtraData
              ) => {
                const row = getRow(rowData);
                const columnKey = getColumn(colIndex);
                toggleCellSelected(row.application.id, columnKey);
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
              // Fech data
              isLoading={
                allApplications.isFetching || allTechnologies.isFetching
              }
              loadingVariant="skeleton"
              fetchError={allApplications.isError || allTechnologies.isError}
              // Toolbar filters
              filtersApplied={filterText.trim().length > 0}
              toolbarToggle={
                <>
                  <ToolbarItem variant="search-filter">
                    <SearchInput value={filterText} onChange={setFilterText} />
                  </ToolbarItem>
                  <ToolbarGroup variant="filter-group">
                    <ToolbarFilter categoryName="Category">
                      <SimpleSelect
                        width={250}
                        maxHeight={300}
                        toggleIcon={<FilterIcon />}
                        variant={SelectVariant.single}
                        aria-label="category"
                        aria-labelledby="category"
                        placeholderText="Category"
                        value={allCategoryOptions.find(
                          (e) => e.value === technologyGroup
                        )}
                        options={allCategoryOptions}
                        onChange={(option) => {
                          const optionValue =
                            option as OptionWithValue<TechnologyGroup>;
                          setTechnologyGroup(optionValue.value);
                        }}
                      />
                    </ToolbarFilter>
                  </ToolbarGroup>
                </>
              }
            />
          )}
        </ConditionalRender>
      </PageSection>
    </>
  );
};
