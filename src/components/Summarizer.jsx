import { Loader, Container, Alert } from "@mantine/core";
import React, { useState, useEffect } from "react";
import { extractPageText } from "../utils/extractContent";
import { fetchSummary } from "../utils/fetchSummary";
import { IconAlertCircle } from "@tabler/icons-react";

function Summarizer() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  // on load, extract page text and fetch summary
  useEffect(() => {
    const summarizeContent = async () => {
      try {
        const extractedText = await extractPageText();
        if (!extractedText) {
          setError("No content available.");
          setLoading(false);
          return;
        }
        const fetchedSummary = await fetchSummary(extractedText);
        const formattedSummary = marked.parse(fetchedSummary);
        setSummary(formattedSummary);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    summarizeContent();
  }, []);

  return (
    <Container>
      {loading && <Loader size="lg" />}
      {error && (
        <Alert variant="light" color="red" title={error} icon={IconAlertCircle}>
          {error}
        </Alert>
      )}
      {summary && <div dangerouslySetInnerHTML={{ __html: summary }} />}
    </Container>
  );
}

export default Summarizer;
