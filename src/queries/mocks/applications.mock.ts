import { Application } from "api/models";

export let MOCK_APPLICATIONS: Application[];

if (
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_DATA_SOURCE === "mock"
) {
  const application1: Application = {
    id: 1,
    name: "AdministracionEfectivo.ear",
    tags: [
      "Spring XML",
      "AOP Alliance",
      "Apache Commons Logging",
      "Apache Log4J",
      "Bouncy Castle",
      "Common Annotations",
      "EAR",
      "Hibernate",
      "JBoss logging",
      "JDBC",
      "JDBC XA datasources",
      "JFreeChart",
      "JPA XML 2.0",
      "JPA Entities",
      "JPA named queries",
      "JSF",
      "JSF Page",
      "JTA",
      "Jasypt",
      "Manifest",
      "Maven XML",
      "Oracle DB Driver",
      "Persistence units",
      "PrimeFaces",
      "Properties",
      "SLF4J",
      "Servlet",
      "Spring",
      "Spring DI",
      "Spring Scheduled",
      "Stateless (SLSB)",
      "Web XML 3.0",
    ],
    runtimeLabels: ["JWS", "EAP"],
    storyPoints: 45,
    incidents: {
      mandatory: 7,
      optional: 27,
      potential: 5,
      information: 68,
    },
  };

  const application2: Application = {
    id: 2,
    name: "jee-example-app-1.0.0.ear",
    tags: [
      "WebLogic EJB XML",
      "WebLogic Web XML",
      "Apache Log4J",
      "EAR",
      "EJB XML 2.1",
      "JTA",
      "Manifest",
      "Maven XML",
      "Message (MDB)",
      "Properties",
      "Servlet",
      "Stateless (SLSB)",
      "Web XML 2.4",
    ],
    runtimeLabels: ["JWS"],
    storyPoints: 90,
    incidents: { mandatory: 53, optional: 1, potential: 38, information: 11 },
  };

  MOCK_APPLICATIONS = [application1, application2];
}
