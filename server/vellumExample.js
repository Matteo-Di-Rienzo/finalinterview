require('dotenv').config();
const { VellumClient } = require('vellum-ai');

async function runWorkflow(transcript) {
  const client = new VellumClient({ apiKey: process.env.VELLUM_API_KEY });

  const request = {
    workflowDeploymentName: 'interview', // <- your workflow deployment name
    releaseTag: 'LATEST',
    inputs: [
      // include your transcript if your workflow expects it
      { type: 'STRING', name: 'transcript', value: transcript || '' },

      // EXAMPLE numeric inputs (MUST be numbers, not objects)
      // { type: 'NUMBER', name: 'age', value: 20 },
      // { type: 'NUMBER', name: 'study_time_week', value: 6 },
      // { type: 'NUMBER', name: 'daytime_evening_classes', value: 1 },
      // { type: 'NUMBER', name: 'attendance', value: 95 },
      // { type: 'NUMBER', name: 'previous_qualifications', value: 2 },
      // { type: 'NUMBER', name: 'displaced', value: 0 },
      // { type: 'NUMBER', name: 'entertainment_hours', value: 10 },
      // { type: 'NUMBER', name: 'work', value: 15 },
      // { type: 'NUMBER', name: 'average_sleep', value: 7 },
      // { type: 'NUMBER', name: 'mental_health', value: 8 },
    ],
  };

  const result = await client.executeWorkflow(request);

  if (result.data.state === 'REJECTED') {
    throw new Error(result.data.error?.message || 'Workflow rejected');
  }

  // result.data.outputs is an array; pick what you need
  console.log(result.data.outputs);
  return result.data.outputs;
}

module.exports = { runWorkflow };
