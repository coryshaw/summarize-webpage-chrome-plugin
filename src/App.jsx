import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, Anchor, Container } from "@mantine/core";
import APIKeyForm from "./components/APIKeyForm";
import "@mantine/core/styles.css";
import Summarizer from "./components/Summarizer";

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [displayAPIKeyForm, setDisplayAPIKeyForm] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("apiKey", function (data) {
      if (data.apiKey) {
        setApiKey(data.apiKey); // Pre-populate the field
      } else {
        setDisplayAPIKeyForm(true);
      }
    });
  }, []);

  return (
    <MantineProvider>
      <Container miw={550} ml={10} mt={20} mr={10} mb={20}>
        {!displayAPIKeyForm && apiKey && (
          <>
            <Summarizer />
            <Anchor href="#" onClick={() => setDisplayAPIKeyForm(true)}>
              Change API Key
            </Anchor>
          </>
        )}

        {displayAPIKeyForm && (
          <APIKeyForm
            onDone={(newKey) => {
              if (newKey) {
                setApiKey(newKey);
                setDisplayAPIKeyForm(false);
                chrome.storage.local.set({ apiKey: newKey.trim() });
              }
            }}
            currentKey={apiKey}
          />
        )}
      </Container>
    </MantineProvider>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
