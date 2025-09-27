require('dotenv').config();
const { VellumClient } = require('vellum-ai');

// Pass transcript (Answer) and the current Question
async function runWorkflow(transcript, question) {
  const client = new VellumClient({ apiKey: process.env.VELLUM_API_KEY });

  const request = {
    workflowDeploymentName: 'interview', // <-- your deployment name
    releaseTag: 'LATEST',
    inputs: [
      { type: 'STRING', name: 'Question', value: question || '' },  // must match Vellum var
      { type: 'STRING', name: 'Answer',   value: transcript || '' } // must match Vellum var
    ],
  };

  const result = await client.executeWorkflow(request);
  if (result.data.state === 'REJECTED') {
    throw new Error(result.data.error?.message || 'Workflow rejected');
  }
  return result.data.outputs;
}

module.exports = { runWorkflow };
