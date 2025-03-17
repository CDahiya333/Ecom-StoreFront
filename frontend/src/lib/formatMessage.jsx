
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const formatMessage = (text) => {
  if (!text) return "";
  return (
    <div className="prose prose-sm mb-3">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default formatMessage;
