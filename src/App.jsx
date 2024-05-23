import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, Anchor, Container } from "@mantine/core";
import APIKeyForm from "./components/APIKeyForm";
import Summary from "./components/Summary";
import "@mantine/core/styles.css";

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [displayApp, setDisplayApp] = useState(false);
  const [displayAPIKeyForm, setDisplayAPIKeyForm] = useState(false);
  const [displayChangeKeyLink, setDisplayChangeKeyLink] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("apiKey", function (data) {
      if (data.apiKey) {
        setApiKey(data.apiKey); // Pre-populate the field
        setDisplayApp(true);
        setDisplayChangeKeyLink(true);
      } else {
        setDisplayApp(false);
        setDisplayChangeKeyLink(false);
        setDisplayAPIKeyForm(true);
      }
    });
  }, []);

  return (
    <MantineProvider>
      {!displayAPIKeyForm && displayApp && (
        <Container>
          <Summary />
          {displayChangeKeyLink && (
            <Anchor href="#" onClick={() => setDisplayAPIKeyForm(true)}>
              Change API Key
            </Anchor>
          )}
        </Container>
      )}

      {displayAPIKeyForm && <APIKeyForm />}
    </MantineProvider>
  );
}

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<App />);
