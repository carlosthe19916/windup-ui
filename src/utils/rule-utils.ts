import { Link, Technology } from "api/models";

export const getMarkdown = (body: string, links: Link[]): string => {
  const formattedLinks = links
    .map((link, index) => `${index + 1}. [${link.title}](${link.href})`)
    .join("\n");
  return [body, formattedLinks].join("\n");
};

export const technologiesToArray = (technologies: Technology[]) => {
  const technologyVersionMap: Map<string, Set<string>> = new Map();

  technologies.forEach((technology) => {
    let versions: string[] = [];

    if (technology.versionRange && technology.versionRange.length > 0) {
      versions = technology.versionRange
        //eslint-disable-next-line
        .replace(/[(\[\])]/g, "")
        .split(",")
        .filter((version) => version !== "");
    }

    const newVersions = new Set(technologyVersionMap.get(technology.id));
    versions.forEach((f) => newVersions.add(f));

    technologyVersionMap.set(technology.id, newVersions);
  });

  //
  const result: string[] = [];
  technologyVersionMap.forEach((versions, technology) => {
    result.push(technology);
    versions.forEach((version) => {
      result.push(`${technology} ${version}`);
    });
  });
  return result;
};
