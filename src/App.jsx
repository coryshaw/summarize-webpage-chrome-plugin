import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, Container, Divider, Button } from "@mantine/core";
import APIKeyForm from "./components/APIKeyForm";
import "@mantine/core/styles.css";
import Summarizer from "./components/Summarizer";
import { IconSettings } from "@tabler/icons-react";

function App() {
  const [apiKey, setApiKey] = useState(null);
  const [displayAPIKeyForm, setDisplayAPIKeyForm] = useState(false);
  const [localColorScheme, setLocalColorScheme] = useState("dark");

  useEffect(() => {
    // get api key
    chrome.storage.local.get("apiKey", function (data) {
      if (data.apiKey) {
        setApiKey(data.apiKey); // Pre-populate the field
      } else {
        setDisplayAPIKeyForm(true);
      }
    });

    // detect theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setLocalColorScheme(event.matches ? "dark" : "light");
    };

    if (mediaQuery.matches) {
      setLocalColorScheme("dark");
    }

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      forceColorScheme={localColorScheme}
    >
      <Container miw={550} ml={10} mt={20} mr={10} mb={20}>
        {!displayAPIKeyForm && apiKey && (
          <>
            <Summarizer />
            <Divider mt={20} mb={20} />
            <Button
              leftSection={<IconSettings size={14} />}
              variant="default"
              href="#"
              onClick={() => setDisplayAPIKeyForm(true)}
            >
              Settings
            </Button>
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
