// npm install vellum-ai --save
import { VellumClient, Vellum } from "vellum-ai";

// configurable parameters
const workflowDeploymentName = "grade-habits";
const releaseTag = "LATEST";
const inputs: Vellum.WorkflowRequestInputRequest[] = [
  {
    type: "NUMBER",
    name: "age",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "study_time_week",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "daytime_evening_classes",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "attendance",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "previous_qualifications",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "displaced",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "entertainment_hours",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "work",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "average_sleep",
    value: { 'example-key': 'example-value' },
  },
  {
    type: "NUMBER",
    name: "mental_health",
    value: { 'example-key': 'example-value' },
  },
]

// create your API key here: https://app.vellum.ai/organization?tab=workspaces&workspace-settings-tab=environments
const vellum = new VellumClient({
  apiKey: process.env.VELLUM_API_KEY!,
});

// setup the workflow
const request: Vellum.ExecuteWorkflowRequest = {
  workflowDeploymentName,
  releaseTag,
  inputs,
};

// execute the workflow
const result = await client.executeWorkflow(request);

if (result.data.state === "REJECTED") {
  throw new Error(result.data.error!.message)
}

console.log(result.data.outputs);
