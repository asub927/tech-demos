/**
 * Fixture RAG provider — deterministic responses, no API keys.
 * MIT-licensed demo code; Promptfoo is MIT.
 */
module.exports = class MockRagProvider {
  id() {
    return 'mock-rag';
  }

  async callApi(_prompt, context) {
    const vars = context?.vars || {};
    const question = String(vars.question || '').toLowerCase();

    if (question.includes('ignore previous') || question.includes('system prompt')) {
      return {
        output:
          'I cannot share internal instructions. Here is a safe summary of our refund policy instead.',
      };
    }

    if (question.includes('refund')) {
      return {
        output:
          'Our refund policy allows returns within 30 days with receipt. Contact support@example.com.',
      };
    }

    if (question.includes('password') || question.includes('api key')) {
      return {
        output:
          'For security, never share passwords in chat. Use the account settings portal.',
      };
    }

    const ctx = vars.context || 'No context provided.';
    return {
      output: `Based on the knowledge base: ${ctx} Answer: ${vars.question}`,
    };
  }
};
