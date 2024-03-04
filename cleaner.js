// Import required libraries
import fs from 'fs';
import fetch from 'node-fetch';
import readline from 'readline';

// Read data from data.txt
const data = fs.readFileSync('data.txt', 'utf-8').split('\n');
const youruser = data[0].trim(); // Discord username
const authToken = data[1].trim(); // Discord token
const channel = data[2].trim(); // Channel ID
let lastmsg = data[3].trim(); // Latest message ID
let firstIteration = true; // A flag to determine if the current iteration is the first run of the clearMessages function

const limit = parseInt(data[4]) || 0; // Optional limit for messages to delete
const delay = 4 * 1000; // Constant delay in milliseconds (4 seconds)

// Counter and increment function for deleted messages
let deletedMessagesCount = 0;
function incrementCounter() {
  deletedMessagesCount++;
  return deletedMessagesCount;
}

// Log messages with a timestamp using the current system time
function logMessage(message) {
  const timestamp = new Date().toLocaleString();
  const log = `[${timestamp}] ${message}\n`;
  fs.appendFileSync('log.txt', log, 'utf-8');
  console.log(log.trim());
}

// Prompt the user for confirmation before proceeding with message deletion
async function promptUserConfirmation() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('Are you sure you want to start deleting your messages? This action cannot be undone! Type "yes" if you wish to continue or you can enter any other key to cancel: ', (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

// Store the ID of the last fetched message in the previous iteration, used to identify if there are no more messages to delete
let lastFetchedMessage = "";

// Validate the provided username and token by fetching the current user's information from the Discord API
async function validateUsername() {
  const headers = { "Authorization": authToken };
  const userResponse = await fetch('https://discord.com/api/v10/users/@me', { headers, method: 'GET' });

  if (userResponse.status === 401) {
    logMessage("Error: Invalid token. Double check the token you entered and try again.");
    return false;
  }

  const currentUser = await userResponse.json();
  if (currentUser.username !== youruser) {
    logMessage("Error: The entered username does not match the username associated with the provided token. Try again and make sure you entered your username correctly and NOT your display name.");
    return false;
  }

  return true;
}

// Main function to clear messages in a Discord channel
async function clearMessages() {
  if (limit > 0 && deletedMessagesCount >= limit) {
    logMessage("Message limit reached, stopping execution.");
    return;
  }

  const baseURL = `https://discord.com/api/v10/channels/${channel}/messages`;
  const headers = { "Authorization": authToken };

  // Check for invalid token and username before proceeding
  const isUsernameValid = await validateUsername();
  if (!isUsernameValid) {
    return;
  }

  try {
  const response = await fetch(baseURL + "?before=" + (BigInt(lastmsg) + BigInt(1)), { headers, method: 'GET' });

  const messages = await response.json();

  // Check for wrong channel ID
  if (response.status === 404 || messages.code === 10003) {
    logMessage("Error: Unknown channel. Please double check the channel ID you entered and try again.");
    return;
  }

  // Check if messages were fetched successfully
  if (!Array.isArray(messages)) {
    logMessage("Error: Failed to fetch messages from the Discord API. This may be due to network issues. Try again later.");
    return;
  }

  if (messages.length === 0) {
    logMessage("No more messages to delete, stopping execution.");
    if (firstIteration) {
      logMessage("If you are seeing this message right after you tried to run the program and you were not even prompted for confirmation, this means you entered an invalid message ID. Messages will only be deleted if you entered the correct message ID and chose to continue after you were prompted for confirmation.");
    }
    return;
  }

    // Check if the last fetched message is the same as in the previous iteration
    if (lastFetchedMessage === messages[messages.length - 1].id) {
      logMessage("No more messages to delete, stopping execution.");
      return;
    }
  
    // Update the lastFetchedMessage variable
    lastFetchedMessage = messages[messages.length - 1].id;

  if (firstIteration) {
    const targetMessage = messages.find(message => message.id === lastmsg);
    if (!targetMessage) {
      logMessage("Error: The provided message ID does not exist in the specified channel. Please double check the message ID and try again.");
      return;
    }

    if (targetMessage.author.username !== youruser) {
      logMessage("Error: The provided message ID does not belong to the specified user; you can only delete messages you have sent. Please double check the message ID and try again.");
      return;
    }

        // Prompt the user to confirm whether they want to proceed with message deletion and handle their response
        const userConfirmation = await promptUserConfirmation();
        if (!userConfirmation) {
          logMessage("User cancelled the operation. No messages will be deleted.");
          return;
        }
  }

  for (const message of messages) {
    lastmsg = message.id;

    if (message.author.username === youruser) {
      const count = incrementCounter();

      await new Promise(resolve => setTimeout(resolve, delay));
      await fetch(`${baseURL}/${message.id}`, { headers, method: 'DELETE' });

      logMessage(`Completed: ${count}`);

      if (limit > 0 && deletedMessagesCount >= limit) {
        logMessage("Message limit reached, stopping execution.");
        return;
      }
    } else {
      logMessage("Ignoring message sent by another user.");
    }
  }

  firstIteration = false; // Set the first Iteration flag to false
  clearMessages();
  } catch (error) {
    logMessage(`Error: An error occurred while fetching messages from the Discord API. This may be due to network issues, try again later. Error message: ${error.message}`);
  }
}

// Start clearing messages in the specified channel
clearMessages();