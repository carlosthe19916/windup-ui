import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  PageSection,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartThemeColor,
  ChartTooltip,
} from "@patternfly/react-charts";
import { useIssuesQuery } from "queries/issues";

import { Application } from "api/models";

interface IncidentsData {
  category: string;
  totalIncidents: number;
  totalStoryPoints: number;
}

type IncidentsChart = {
  [key in "IncidentsBar" | "StoryPointsBar"]: {
    getY: (data: IncidentsData) => number;
    getTooltip: (data: any) => string;
  };
};
const INCIDENTS_CHART: IncidentsChart = {
  IncidentsBar: {
    getY: (data: IncidentsData) => {
      return data.totalIncidents;
    },
    getTooltip: ({ datum }: any) => `${datum.y} incidents`,
  },
  StoryPointsBar: {
    getY: (data: IncidentsData) => {
      return data.totalStoryPoints;
    },
    getTooltip: ({ datum }: any) => `${datum.y} SP`,
  },
};

const sortIncidentsData = (data: IncidentsData[]) => {
  const getCategoryPriority = (category: string) => {
    switch (category) {
      case "mandatory":
        return 1;
      case "optional":
        return 2;
      case "potential":
        return 3;
      case "cloud-mandatory":
        return 4;
      case "cloud-optional":
        return 5;
      case "information":
        return 6;
      default:
        return 0;
    }
  };

  return data.sort(
    (a, b) => getCategoryPriority(a.category) - getCategoryPriority(b.category)
  );
};

export const ApplicationDashboard: React.FC = () => {
  const application = useOutletContext<Application | null>();

  const allIssues = useIssuesQuery();

  const applicationIssues = useMemo(() => {
    return allIssues.data?.find((f) => f.applicationId === application?.id);
  }, [application, allIssues.data]);

  // Incidents Chart
  const incidents = useMemo(() => {
    return (applicationIssues?.issues || []).reduce((prev, current) => {
      const prevVal: IncidentsData | undefined = prev.find(
        (e) => e.category === current.category
      );

      let result: IncidentsData[];
      if (prevVal) {
        result = [
          ...prev.filter((e) => e.category !== current.category),
          {
            category: current.category,
            totalIncidents: prevVal.totalIncidents + current.totalIncidents,
            totalStoryPoints:
              prevVal.totalStoryPoints + current.totalStoryPoints,
          },
        ];
      } else {
        result = [
          ...prev,
          {
            category: current.category,
            totalIncidents: 0,
            totalStoryPoints: 0,
          },
        ];
      }

      return sortIncidentsData(result);
    }, [] as IncidentsData[]);
  }, [applicationIssues]);

  return (
    <>
      <PageSection>
        <Grid md={6}>
          <GridItem>
            <Card isFullHeight>
              <CardTitle>Incidents</CardTitle>
              <CardBody>
                <TableComposable>
                  <Thead>
                    <Tr>
                      <Th width={40}>Category</Th>
                      <Th>Incidents</Th>
                      <Th>Total Story Points</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {incidents.map((incident) => (
                      <Tr key={incident.category}>
                        <Td>{incident.category}</Td>
                        <Td>{incident.totalIncidents}</Td>
                        <Td>{incident.totalStoryPoints}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </TableComposable>
              </CardBody>
            </Card>
          </GridItem>
          <GridItem>
            <Card isFullHeight>
              <CardTitle>Incidents and Story Points</CardTitle>
              <CardBody>
                <div>
                  <Chart
                    themeColor={ChartThemeColor.multiOrdered}
                    domainPadding={{ x: 35 }}
                    padding={{
                      bottom: 40,
                      top: 20,
                      left: 40,
                      right: 0,
                    }}
                  >
                    <ChartAxis />
                    <ChartAxis dependentAxis showGrid={false} />
                    <ChartGroup offset={10}>
                      {Object.entries(INCIDENTS_CHART).map(
                        ([barName, barConfig]) => (
                          <ChartBar
                            key={barName}
                            data={incidents.map((incident) => ({
                              name: barName,
                              x: incident.category,
                              y: barConfig.getY(incident),
                              label: barConfig.getTooltip,
                            }))}
                            labelComponent={
                              <ChartTooltip constrainToVisibleArea />
                            }
                          />
                        )
                      )}
                    </ChartGroup>
                  </Chart>
                </div>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </PageSection>
    </>
  );
};
