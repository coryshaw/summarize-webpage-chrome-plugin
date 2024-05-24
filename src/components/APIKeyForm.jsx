import { Anchor, Box, Button, Group, Text, TextInput } from "@mantine/core";
import React from "react";
import { useForm } from "@mantine/form";

const APIKeyForm = ({ currentKey, onDone }) => {
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
          key. You can obtain one by creating an account at{" "}
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
          value={form.values.apiKey || ""}
          required
          key={form.key("apiKey")}
          {...form.getInputProps("apiKey")}
        />
        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </Box>
    </form>
  );
};
export default APIKeyForm;
