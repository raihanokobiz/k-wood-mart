import React, { useState } from "react";

interface TruncatedHtmlProps {
  html: string;
  maxLength?: number;
}

const TruncatedHtml: React.FC<TruncatedHtmlProps> = ({
  html,
  maxLength = 100,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const getTextContent = (htmlString: string) => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    return div.textContent || div.innerText || "";
  };

  const textContent = getTextContent(html);
  const shouldTruncate = textContent.length > maxLength;

  const truncatedText = shouldTruncate
    ? textContent.substring(0, maxLength) + "..."
    : textContent;

  return (
    <div className="w-[250px]">
      <div
        dangerouslySetInnerHTML={{
          __html: expanded || !shouldTruncate ? html : truncatedText,
        }}
      />
      {shouldTruncate && (
        <button
          onClick={toggleExpanded}
          className="text-blue-500 hover:underline focus:outline-none"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </div>
  );
};

export default TruncatedHtml;
