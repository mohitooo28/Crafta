export const truncateString = (str, maxLength = 2000) => {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength) + "... [TRUNCATED]";
};

export const getFilesSummary = (files) => {
  if (!files) return "";

  const summary = Object.entries(files)
    .filter(
      ([path, _]) => path !== "/src/main.jsx" && path !== "/src/index.css"
    )
    .map(([path, fileData]) => {
      const code = fileData?.code || "";
      const truncatedCode = truncateString(code, 500);
      return `FILE: ${path}\n${truncatedCode}\n---`;
    })
    .join("\n");

  return summary ? `\n\nCURRENT WEBSITE CONTEXT:\n${summary}` : "";
};

export const summarizeMessages = (messages, maxMessages = 6) => {
  if (!messages || messages.length === 0) return [];

  const latestMessage = messages[messages.length - 1];

  if (messages.length <= maxMessages) {
    return messages;
  }

  const firstMessage = messages[0];
  const recentMessages = messages.slice(-maxMessages + 1);

  if (recentMessages.some((msg) => msg === firstMessage)) {
    return recentMessages;
  }

  return [firstMessage, ...recentMessages];
};

export const createContextualPrompt = (messages, files, basePrompt) => {
  const summarizedMessages = summarizeMessages(messages);
  const filesSummary = getFilesSummary(files);

  const messagesString = JSON.stringify(summarizedMessages);

  return messagesString + filesSummary + basePrompt;
};
