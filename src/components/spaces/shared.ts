import _ from "lodash";
import removeMd from "remove-markdown";
import moment from "moment";

export function formatDescription(description: string): string {
  const maxLength = 300;

  if (_.isEmpty(description)) {
    return "";
  }

  const withoutMarkdown = removeMd(description);
  if (withoutMarkdown.length < maxLength) {
    return withoutMarkdown;
  }

  const truncated = withoutMarkdown.substring(0, maxLength);
  return `${truncated}...`;
}

export function formatDate(date) {
  return moment(new Date(date)).format("ll");
}
