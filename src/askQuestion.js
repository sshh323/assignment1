import readline from 'node:readline';

// Create a single readline interface for the whole application.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Wrap `rl.question` in a Promise so it can be awaited from async functions.
 * @param {string} query The prompt to show the user.
 * @returns {Promise<string>} Resolves with the user's input.
 */
export function askQuestion(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

/**
 * Close the readline interface when no more questions are needed.
 * This allows the Node.js process to exit cleanly.
 */
export function noMoreQuestions() {
  rl.close();
}
