import { Loader, Alert, Flex, ActionIcon } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { extractPageText } from "../utils/extractContent";
import { fetchSummary } from "../utils/fetchSummary";
import { IconCheck, IconClipboard, IconRefresh } from "@tabler/icons-react";
import markedAlert from "marked-alert";

function Summarizer() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState("Error!");

  const summarizeContent = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const extractedText = await extractPageText();
      if (!extractedText) {
        setError("No content available.");
        setLoading(false);
        return;
      }
      const fetchedSummary = await fetchSummary(extractedText);
      const formattedSummary = marked.use(markedAlert()).parse(fetchedSummary);
      setSummary(formattedSummary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // on load, extract page text and fetch summary
  useEffect(() => {
    summarizeContent();
  }, []);

  const copyToClipboard = async () => {
    setIsCopied(true);
    if (summary) {
      const text = summary.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
      await navigator.clipboard.writeText(text);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <div>
      {loading && (
        <Flex justify="center" align="center" style={{ height: "100%" }}>
          <Loader type="dots" color="pink" />
        </Flex>
      )}
      {error && <Alert variant="light" title={error} color="red" />}
      {summary && (
        <>
          <ActionIcon
            style={{ position: "absolute", top: "20px", right: "20px" }}
            onClick={() => summarizeContent()}
            variant="default"
            aria-label="Settings"
          >
            <IconRefresh style={{ width: "70%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            style={{ position: "absolute", top: "60px", right: "20px" }}
            onClick={copyToClipboard}
            variant="default"
            aria-label="Copy to clipboard"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <IconCheck style={{ width: "70%", height: "70%" }} stroke={1.5} />
            ) : (
              <IconClipboard
                style={{ width: "70%", height: "70%" }}
                stroke={1.5}
              />
            )}
          </ActionIcon>
          <div dangerouslySetInnerHTML={{ __html: summary }} />
        </>
      )}
    </div>
  );
}

export default Summarizer;
