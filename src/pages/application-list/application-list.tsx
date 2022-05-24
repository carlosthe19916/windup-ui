import React, { useMemo, useState } from "react";
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
  PageSection,
  PageSectionVariants,
  SearchInput,
  SelectVariant,
  Split,
  SplitItem,
  Text,
  TextContent,
  ToolbarChip,
  ToolbarChipGroup,
  ToolbarFilter,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  compoundExpand,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
} from "@patternfly/react-table";
import { TagIcon, TaskIcon, FilterIcon } from "@patternfly/react-icons";

import {
  SimpleTableWithToolbar,
  useTable,
  useTableControls,
  useToolbar,
  SimpleSelect,
} from "@project-openubl/lib-ui";

import { useApplicationsQuery } from "queries/applications";
import { Application } from "api/models";
import { useCellSelectionState } from "shared/hooks";

const DataKey = "DataKey";

enum ColumnKey {
  tags = "tags",
  incidents = "incidents",
}
const columnKeys: ColumnKey[] = Object.values(ColumnKey) as ColumnKey[];

const columns: ICell[] = [
  { title: "Name", transforms: [cellWidth(20), sortable] },
  {
    title: "Runtime labels",
    transforms: [cellWidth(20)],
  },
  {
    title: "Tags",
    transforms: [cellWidth(20)],
    cellTransforms: [compoundExpand],
    data: ColumnKey.tags,
  },
  {
    title: "Incidents",
    transforms: [cellWidth(20)],
    cellTransforms: [compoundExpand],
    data: ColumnKey.incidents,
  },
  {
    title: "Story points",
    transforms: [cellWidth(20)],
  },
];

export const compareByColumnIndex = (
  a: Application,
  b: Application,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // name
      return a.name.localeCompare(b.name);
    default:
      return 0;
  }
};

const getRow = (rowData: IRowData): Application => {
  return rowData[DataKey];
};

const getColumn = (colIndex: number): ColumnKey => {
  return columns[colIndex].data;
};

export const ApplicationList: React.FC = () => {
  const [filterText, setFilterText] = useState("");
  const { filters, addFilter, setFilter, removeFilter, clearAllFilters } =
    useToolbar<"name" | "tag", string>();

  const applications = useApplicationsQuery();
  const tags = useMemo(() => {
    const allTags = (applications.data || []).flatMap((f) => f.tags);
    return Array.from(new Set(allTags)).sort((a, b) => a.localeCompare(b));
  }, [applications.data]);

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<Application>({
    items: applications.data || [],
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: compareByColumnIndex,
    filterItem: (item) => {
      let isFilterTextFilterCompliant = true;
      if (filterText && filterText.trim().length > 0) {
        isFilterTextFilterCompliant =
          item.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
      }

      let isTagFilterCompliant = true;
      const selectedTags = filters.get("tag") || [];
      if (selectedTags.length > 0) {
        isTagFilterCompliant = selectedTags.some((f) =>
          item.tags.some((t) => f === t)
        );
      }

      return isFilterTextFilterCompliant && isTagFilterCompliant;
    },
  });

  const { isCellSelected, isSomeCellSelected, toggleCellSelected } =
    useCellSelectionState<number, ColumnKey>({
      rows: pageItems.map((f) => f.id),
      columns: columnKeys,
    });

  const itemsToRow = (items: Application[]) => {
    const rows: IRow[] = [];
    items.forEach((item) => {
      rows.push({
        [DataKey]: item,
        isOpen: isSomeCellSelected(item.id, columnKeys),
        cells: [
          {
            title: item.name,
          },
          {
            title: (
              <>
                <Split hasGutter isWrappable>
                  {[...item.runtimeLabels]
                    .sort((a, b) => a.localeCompare(b))
                    .map((e, index) => (
                      <SplitItem key={index}>
                        <Label isCompact>{e}</Label>
                      </SplitItem>
                    ))}
                </Split>
              </>
            ),
          },
          {
            title: (
              <>
                <TagIcon key="tags" /> {item.tags.length}
              </>
            ),
            props: {
              isOpen: isCellSelected(item.id, ColumnKey.tags),
            },
          },
          {
            title: (
              <>
                <TaskIcon key="incidents" />{" "}
                {Object.values(item.incidents).reduce((a, b) => a + b, 0)}
              </>
            ),
            props: {
              isOpen: isCellSelected(item.id, ColumnKey.incidents),
            },
          },
          {
            title: item.storyPoints,
          },
        ],
      });

      const parentIndex = rows.length - 1;

      rows.push({
        parent: parentIndex,
        compoundParent: 2,
        cells: [
          {
            title: (
              <div className="pf-u-m-md">
                <Split hasGutter isWrappable>
                  {[...item.tags]
                    .sort((a, b) => a.localeCompare(b))
                    .map((e, index) => (
                      <SplitItem key={index}>
                        <Label isCompact>{e}</Label>
                      </SplitItem>
                    ))}
                </Split>
              </div>
            ),
            props: { colSpan: 6, className: "pf-m-no-padding" },
          },
        ],
      });

      rows.push({
        parent: parentIndex,
        compoundParent: 3,
        cells: [
          {
            title: (
              <div className="pf-u-m-md">
                <DescriptionList isHorizontal isCompact>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Mandatory</DescriptionListTerm>
                    <DescriptionListDescription>
                      {item.incidents.mandatory}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Optional</DescriptionListTerm>
                    <DescriptionListDescription>
                      {item.incidents.optional}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Potential</DescriptionListTerm>
                    <DescriptionListDescription>
                      {item.incidents.potential}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                  <DescriptionListGroup>
                    <DescriptionListTerm>Information</DescriptionListTerm>
                    <DescriptionListDescription>
                      {item.incidents.information}
                    </DescriptionListDescription>
                  </DescriptionListGroup>
                </DescriptionList>
              </div>
            ),
            props: { colSpan: 6, className: "pf-m-no-padding" },
          },
        ],
      });
    });

    return rows;
  };

  const rows: IRow[] = itemsToRow(pageItems);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Applications</Text>
          <Text component="small">
            This report lists all analyzed applications. Select an individual
            application to show more details.
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant={PageSectionVariants.default}>
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
            toggleCellSelected(row.id, columnKey);
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
          isLoading={applications.isFetching}
          loadingVariant="skeleton"
          fetchError={applications.isError}
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
                    addFilter("name", value);
                    setFilterText("");
                  }}
                />
              </ToolbarItem>
              <ToolbarGroup variant="filter-group">
                <ToolbarFilter
                  chips={filters.get("tag")}
                  deleteChip={(
                    category: string | ToolbarChipGroup,
                    chip: ToolbarChip | string
                  ) => removeFilter("tag", chip)}
                  deleteChipGroup={() => setFilter("tag", [])}
                  categoryName={{ key: "tag", name: "Tag" }}
                >
                  <SimpleSelect
                    width={250}
                    maxHeight={300}
                    toggleIcon={<FilterIcon />}
                    variant={SelectVariant.checkbox}
                    aria-label="tag"
                    aria-labelledby="tag"
                    placeholderText="Tag"
                    value={filters.get("tag")}
                    options={tags}
                    onChange={(option) => {
                      const optionValue = option as string;

                      const elementExists = (filters.get("tag") || []).some(
                        (f) => f === optionValue
                      );
                      let newElements: string[];
                      if (elementExists) {
                        newElements = (filters.get("tag") || [])
                          .filter((f) => f !== optionValue)
                          .map((f) => f);
                      } else {
                        newElements = [
                          ...(filters.get("tag") || []),
                          optionValue,
                        ];
                      }

                      setFilter("tag", newElements);
                    }}
                    hasInlineFilter
                    onClear={() => setFilter("tag", [])}
                  />
                </ToolbarFilter>
              </ToolbarGroup>
            </>
          }
        />
      </PageSection>
    </>
  );
};
