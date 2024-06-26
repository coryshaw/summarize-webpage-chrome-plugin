import { Anchor, Box, Button, Group, Text, TextInput } from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";
import { IconX } from "@tabler/icons-react";

const APIKeyForm = ({ currentKey, onDone, onClearCurrentKey }) => {
  const form = useForm({
    mode: "controlled",
    initialValues: { apiKey: currentKey },
    validate: {
      apiKey: (value) => {
        console.log(value);
        return value === undefined ? "Required" : null;
      },
    },
  });

  const handleSubmit = (values) => {
    onDone(values.apiKey);
  };

  return (
    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Box id="apiKeyForm">
        <Text pb={12}>
          To get started with GPT Summarizer, you must enter your OpenAI API
          key. You can obtain one here:{" "}
          <Anchor href="https://platform.openai.com/api-keys" target="_blank">
            openai.com API keys
          </Anchor>
          .
        </Text>
        <TextInput
          id="apiKey"
          type="password"
          placeholder="Enter OpenAI API Key"
          label="OpenAI API Key"
          description="Your API key is stored securely in Chrome storage."
          value={form.values.apiKey || ""}
          required
          key={form.key("apiKey")}
          {...form.getInputProps("apiKey")}
          rightSection={
            currentKey && (
              <IconX
                size={14}
                variant="transparent"
                onClick={() => {
                  onClearCurrentKey();
                  form.setFieldValue("apiKey", "");
                }}
                rightSectionWidth={50}
                style={{ cursor: "pointer" }}
              />
            )
          }
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </form>
  );
};
export default APIKeyForm;
