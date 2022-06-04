import { Link } from "api/models";

export const getMarkdown = (body: string, links: Link[]): string => {
  const formattedLinks = links
    .map((link, index) => `${index + 1}. [${link.title}](${link.href})`)
    .join("\n");
  return [body, formattedLinks].join("\n");
};
