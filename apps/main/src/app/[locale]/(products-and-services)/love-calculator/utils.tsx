import React from "react";

/**
 * Helper to safely render any content (string, object, array)
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
    if (Object.keys(content).length === 0) return "";
    if (content.description) return renderContent(content.description);
    if (content.name) return renderContent(content.name);
    if (content.title) return renderContent(content.title);
    if (content.report) return renderContent(content.report);
    return JSON.stringify(content);
  }
  return String(content);
};

export const premiumStyles = `
  @keyframes float {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes pulse-soft {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  .animate-spin-slow { animation: spin-slow 20s linear infinite; }
  .animate-pulse-soft { animation: pulse-soft 4s ease-in-out infinite; }
  .glass-card {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(48, 17, 24, 0.1);
  }
  .text-burgundy { color: #301118; }
  .bg-burgundy { background-color: #301118; }
  .border-burgundy { border-color: #301118; }
  .text-gold { color: #d4af37; }
`;
