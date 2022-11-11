import React, { useMemo, useState } from "react";

import {
  Bullseye,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  List,
  ListItem,
  SearchInput,
  Spinner,
  Title,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  IAction,
  ICell,
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
} from "@project-openubl/lib-ui";
import { useSelectionState } from "@migtools/lib-ui";

import { Dependency } from "api/models";
import { useDependenciesQuery } from "queries/dependencies";

const DataKey = "DataKey";

const columns: ICell[] = [
  {
    title: "Name",
    transforms: [cellWidth(100), sortable],
    cellTransforms: [truncate],
  },
];

const compareByColumnIndex = (
  a: Dependency,
  b: Dependency,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 1: // name
      return a.name.localeCompare(b.name);
    default:
      return 0;
  }
};

const getRow = (rowData: IRowData): Dependency => {
  return rowData[DataKey];
};

export interface IDependenciesTableProps {
  applicationId?: string;
}

export const DependenciesTable: React.FC<IDependenciesTableProps> = ({
  applicationId,
}) => {
  // Filters
  const [filterText, setFilterText] = useState("");

  // Queries
  const allDependencies = useDependenciesQuery();

  const dependencies = useMemo(() => {
    if (applicationId === "") {
      return [...(allDependencies.data || [])].flatMap((e) => e.dependencies);
    }

    return (
      allDependencies.data?.find((f) => f.applicationId === applicationId)
        ?.dependencies || []
    );
  }, [allDependencies.data, applicationId]);

  // Rows
  const {
    isItemSelected: isRowExpanded,
    toggleItemSelected: toggleRowExpanded,
  } = useSelectionState<Dependency>({
    items: dependencies,
    isEqual: (a, b) => a.name === b.name,
  });

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<Dependency>({
    items: dependencies,
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: compareByColumnIndex,
    filterItem: (item) => {
      let isFilterTextFilterCompliant = true;
      if (filterText && filterText.trim().length > 0) {
        isFilterTextFilterCompliant =
          item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      }

      return isFilterTextFilterCompliant;
    },
  });

  const itemsToRow = (items: Dependency[]) => {
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
                  <DescriptionList isHorizontal>
                    <DescriptionListGroup>
                      <DescriptionListTerm>Maven URL</DescriptionListTerm>
                      <DescriptionListDescription>
                        <a
                          target="_blank"
                          rel="noreferrer"
                          href={`http://search.maven.org/#search|ga|1|1:"${item.sha1}"`}
                        >
                          Maven Central Link
                        </a>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    <DescriptionListGroup>
                      <DescriptionListTerm>SHA1 hash</DescriptionListTerm>
                      <DescriptionListDescription>
                        {item.sha1}
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                    {item.version && (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Version</DescriptionListTerm>
                        <DescriptionListDescription>
                          {item.version}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )}
                    {item.organization && (
                      <DescriptionListGroup>
                        <DescriptionListTerm>Organization</DescriptionListTerm>
                        <DescriptionListDescription>
                          {item.organization}
                        </DescriptionListDescription>
                      </DescriptionListGroup>
                    )}
                    <DescriptionListGroup>
                      <DescriptionListTerm>Found at path</DescriptionListTerm>
                      <DescriptionListDescription>
                        <List isPlain>
                          {item.foundPaths.map((path, index) => (
                            <ListItem key={index}>{path}</ListItem>
                          ))}
                        </List>
                      </DescriptionListDescription>
                    </DescriptionListGroup>
                  </DescriptionList>
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
  const actions: IAction[] = [];

  return (
    <ConditionalRender
      when={allDependencies.isLoading}
      then={
        <Bullseye>
          <Spinner />
        </Bullseye>
      }
    >
      {applicationId === undefined ? (
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
          isLoading={allDependencies.isFetching}
          loadingVariant="skeleton"
          fetchError={allDependencies.isError}
          // Toolbar filters
          filtersApplied={filterText.trim().length > 0}
          toolbarToggle={
            <>
              <ToolbarItem variant="search-filter">
                <SearchInput
                  value={filterText}
                  onChange={setFilterText}
                  onClear={() => setFilterText("")}
                />
              </ToolbarItem>
            </>
          }
        />
      )}
    </ConditionalRender>
  );
};
