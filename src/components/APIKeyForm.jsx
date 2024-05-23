import { Anchor, Box, Button, Text, TextInput } from "@mantine/core";
import React from "react";

const APIKeyForm = () => {
  const [apiKey, setApiKey] = React.useState("");

  const handleChange = (event) => {
    setApiKey(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the API key submission here
  };

  return (
    <Box id="apiKeyForm">
      <Text>
        To get started with GPT Summarizer, you must enter your OpenAI API key.
        You can obtain one by creating an account at{" "}
        <Anchor href="https://openai.com/api" target="_blank">
          openai.com
        </Anchor>
        .
      </Text>
      <TextInput
        id="apiKey"
        type="password"
        placeholder="Enter OpenAI API Key"
        label="OpenAI API Key"
        required
      />
      <Button id="save-btn" style={{ marginRight: "10px", marginTop: "10px" }}>
        Save API Key
      </Button>
      <Button id="cancel-btn" variant="outline" style={{ marginTop: "10px" }}>
        Cancel
      </Button>
    </Box>
  );
};
export default APIKeyForm;
