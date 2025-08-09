import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownMessageProps {
  content: string;
  isStreaming?: boolean;
}

export default function MarkdownMessage({
  content,
  isStreaming,
}: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={tomorrow}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 bg-blue-50 py-2 my-4">
                {children}
              </blockquote>
            );
          },
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
              {children}
            </h2>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 my-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 my-4">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <span className="text-gray-700">{children}</span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
