import React from "react";

/**
 * Safely renders any content (string, object, array) to avoid "Objects as React Child" errors.
 */
export const renderContent = (content: any): React.ReactNode => {
  if (content === null || content === undefined) return "";
  if (typeof content === "string" || typeof content === "number")
    return content;
  if (Array.isArray(content)) {
    return content.map((item, i) => (
      <React.Fragment key={i}>
        {i > 0 && ", "}
        {renderContent(item)}
      </React.Fragment>
    ));
  }
  if (typeof content === "object") {
    if (content.description) return content.description;
    if (content.name) return content.name;
    if (content.title) return content.title;
    if (content.report) return content.report;
    return JSON.stringify(content);
  }
  return String(content);
};
