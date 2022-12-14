import React, { useMemo } from "react";
import { Bullseye, Card, CardBody, CardTitle } from "@patternfly/react-core";
import { ChartDonut, ChartThemeColor } from "@patternfly/react-charts";
import { usePackagesIncidentsQuery } from "queries/packages-incidents";
import { Application } from "api/models";

const MAX_PACKAGES_SHOW = 9;

interface ChartData {
  packageName: string;
  packageCount: number;
}

export interface IJavaIncidentsByPackageProps {
  application: Application;
}

export const JavaIncidentsByPackage: React.FC<IJavaIncidentsByPackageProps> = ({
  application,
}) => {
  const allPackagesIncidents = usePackagesIncidentsQuery();

  const chartData: ChartData[] = useMemo(() => {
    const applicationPackages = allPackagesIncidents.data?.find(
      (f) => f.applicationId === application.id
    );

    const packages = applicationPackages?.packages || {};

    const result = Object.entries(packages)
      .map(([packageName, packageCount]) => ({
        packageName,
        packageCount,
      }))
      .sort((a, b) => b.packageCount - a.packageCount);

    const topN = result.slice(0, MAX_PACKAGES_SHOW);
    const others: ChartData[] =
      result.length > MAX_PACKAGES_SHOW
        ? [
            {
              packageName: "Other",
              packageCount: result
                .slice(MAX_PACKAGES_SHOW - result.length)
                .reduce((prev, current) => prev + current.packageCount, 0),
            },
          ]
        : [];

    return topN.concat(others);
  }, [application, allPackagesIncidents.data]);

  return (
    <Card isFullHeight>
      <CardTitle>Java Incidents by Package</CardTitle>
      <CardBody style={{ height: "400px" }}>
        <Bullseye>
          <ChartDonut
            constrainToVisibleArea
            data={chartData.map((e) => ({
              x: e.packageName,
              y: e.packageCount,
            }))}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
            legendData={chartData.map((e) => ({
              name: `${e.packageName} (${e.packageCount})`,
            }))}
            legendOrientation="vertical"
            legendPosition="right"
            padding={{
              bottom: 10,
              left: 10,
              right: 140, // Adjusted to accommodate legend
              top: 10,
            }}
            subTitle="Incidents"
            title={chartData
              .reduce((prev, current) => prev + current.packageCount, 0)
              .toString()}
            themeColor={ChartThemeColor.multiOrdered}
            width={400}
            height={400}
            innerRadius={100}
          />
        </Bullseye>
      </CardBody>
    </Card>
  );
};
