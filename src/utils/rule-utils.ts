import { Rule } from "api/models";

export const getMarkdown = (rule: Rule): string => {
  const links = rule.links
    .map((link, index) => `${index + 1}. [${link.title}](${link.href})`)
    .join("\n");
  return [rule.message, links].join("\n");
};
