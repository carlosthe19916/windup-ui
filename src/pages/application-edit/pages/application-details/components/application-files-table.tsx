import React, { useMemo, useState } from "react";
import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
  List,
  ListItem,
  Stack,
  StackItem,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  IAction,
  ICell,
  IRow,
  IRowData,
} from "@patternfly/react-table";
import {
  SimpleTableWithToolbar,
  useTable,
  useTableControls,
} from "@project-openubl/lib-ui";
import { useSelectionState } from "@migtools/lib-ui";

import { useApplicationsDetailsQuery } from "queries/applications-details";
import { Application, ApplicationFiles } from "api/models";

import { ApplicationFilesChildrenTable } from "./application-files-children-table";
import { TagsChart } from "./tags-chart";

const DataKey = "DataKey";

const columns: ICell[] = [
  {
    title: "File name",
    transforms: [cellWidth(90)],
    cellTransforms: [],
  },
  {
    title: "Story points",
    transforms: [cellWidth(10)],
    cellTransforms: [],
  },
];

const getRow = (rowData: IRowData): ApplicationFiles => {
  return rowData[DataKey];
};

export interface IApplicationFilesTableProps {
  application: Application;
}

export const ApplicationFilesTable: React.FC<IApplicationFilesTableProps> = ({
  application,
}) => {
  // Filters
  const [filterText] = useState("");

  //
  const applicationsDetailsQuery = useApplicationsDetailsQuery();
  const applicationFiles = useMemo(() => {
    return (
      applicationsDetailsQuery.data?.find(
        (f) => f.applicationId === application?.id
      )?.applicationFiles || []
    );
  }, [applicationsDetailsQuery.data, application]);

  // Rows
  const {
    isItemSelected: isRowExpanded,
    toggleItemSelected: toggleRowExpanded,
    selectAll: expandAllRows,
    setSelectedItems: setExpandedRows,
  } = useSelectionState<ApplicationFiles>({
    items: applicationFiles,
    isEqual: (a, b) => a.fileId === b.fileId,
  });

  const {
    page: currentPage,
    sortBy: currentSortBy,
    changePage: onPageChange,
    changeSortBy: onChangeSortBy,
  } = useTableControls();

  const { pageItems, filteredItems } = useTable<ApplicationFiles>({
    items: applicationFiles,
    currentPage: currentPage,
    currentSortBy: currentSortBy,
    compareToByColumn: () => 0,
    filterItem: (item) => true,
  });

  const itemsToRow = (items: ApplicationFiles[]) => {
    const rows: IRow[] = [];
    items.forEach((item) => {
      const isExpanded = isRowExpanded(item);

      rows.push({
        [DataKey]: item,
        isOpen: isExpanded,
        cells: [
          {
            title: item.maven.duplicatePaths ? item.fileName : item.rootPath,
          },
          {
            title: item.storyPoints,
          },
        ],
      });

      // Expanded area
      if (isExpanded) {
        rows.push({
          parent: rows.length - 1,
          fullWidth: true,
          noPadding: true,
          cells: [
            {
              title: (
                <div className="pf-u-m-md">
                  <Stack>
                    <StackItem className="pf-u-mx-lg">
                      <Grid hasGutter lg={6}>
                        <GridItem>
                          <DescriptionList isHorizontal isCompact>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Story points
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {item.storyPoints}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Maven coordinates
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {item.maven.mavenIdentifier}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Organization
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                <List isPlain>
                                  {item.maven.organizations?.map(
                                    (org, index) => (
                                      <ListItem key={index}>{org}</ListItem>
                                    )
                                  )}
                                </List>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Name</DescriptionListTerm>
                              <DescriptionListDescription>
                                {item.maven.name}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Version</DescriptionListTerm>
                              <DescriptionListDescription>
                                {item.maven.version}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>Links</DescriptionListTerm>
                              <DescriptionListDescription>
                                <List isPlain>
                                  {item.maven.projectSite && (
                                    <ListItem>
                                      <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={item.maven.projectSite}
                                      >
                                        Project site
                                      </a>
                                    </ListItem>
                                  )}
                                  {item.maven.sha1 && (
                                    <ListItem>
                                      <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href={`http://search.maven.org/#search|ga|1|1:"${item.maven.sha1}"`}
                                      >
                                        Maven Central
                                      </a>
                                    </ListItem>
                                  )}
                                </List>
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                            <DescriptionListGroup>
                              <DescriptionListTerm>
                                Description
                              </DescriptionListTerm>
                              <DescriptionListDescription>
                                {item.maven.description}
                              </DescriptionListDescription>
                            </DescriptionListGroup>
                          </DescriptionList>
                        </GridItem>
                        <GridItem>
                          <Card isPlain isCompact>
                            <CardTitle>Tags found - Occurrence found</CardTitle>
                            <CardBody>
                              <TagsChart applicationFile={[item]} />
                            </CardBody>
                          </Card>
                        </GridItem>
                      </Grid>
                    </StackItem>
                    <StackItem>
                      <ApplicationFilesChildrenTable applicationFile={item} />
                    </StackItem>
                  </Stack>
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
    <>
      <Card>
        <CardTitle>Archive files</CardTitle>
        <CardBody>
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
            isLoading={applicationsDetailsQuery.isFetching}
            loadingVariant="skeleton"
            fetchError={applicationsDetailsQuery.isError}
            // Toolbar filters
            filtersApplied={filterText.trim().length > 0}
            toolbarToggle={
              <>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      variant={ButtonVariant.link}
                      onClick={() => setExpandedRows([])}
                    >
                      Collapes all
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      variant={ButtonVariant.link}
                      onClick={() => expandAllRows()}
                    >
                      Expand all
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
          />
        </CardBody>
      </Card>
    </>
  );
};
