// Import required libraries
import fs from 'fs';
import fetch from 'node-fetch';
import readline from 'readline';

// Read data from data.txt
const data = fs.readFileSync('data.txt', 'utf-8').split('\n');
const authToken = data[0].trim(); // Discord token
const channel = data[1].trim(); // Channel ID
let lastmsg = data[2].trim(); // Optional last Message ID
let firstIteration = true; // A flag to determine if the current iteration is the first run of the clearMessages function

const limit = parseInt(data[3]) || 0; // Optional limit for messages to delete
const delay = 2000; // Constant delay in milliseconds (2 seconds is enough)

const baseURL = `https://discord.com/api/v10/channels/${channel}/messages`;
const headers = { "Authorization": authToken };

// Log messages with a timestamp using the current system time
const logMessage = message => {
    const log = `[${new Date().toLocaleString()}] ${message}\n`;
    fs.appendFileSync('log.txt', log, 'utf-8');
    console.log(log.trim());
}

// Prompt the user for confirmation before proceeding with message deletion
const promptUserConfirmation = () => new Promise(resolve => readline.createInterface(process.stdin, process.stdout).question('Are you sure you want to start deleting your messages? This action cannot be undone! Type "yes" if you wish to continue or you can enter any other key to cancel: ', answer => {
    rl.close();
    resolve(answer.toLowerCase().includes("y"));
}));

// Validate the provided username and token by fetching the current user's information from the Discord API
const fetchUser = async () => {
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', { headers });

    if (userResponse.status === 401)
        return logMessage("Error: Invalid token. Double check the token you entered and try again.");

    return await userResponse.json();
}

// Store the ID of the last fetched message in the previous iteration, used to identify if there are no more messages to delete
let lastFetchedMessage = "", errorCount = deletedMessagesCount = 0;

// Main function to clear messages in a Discord channel
async function clearMessages() {
    if (limit > 0 && deletedMessagesCount >= limit)
        return logMessage("Message limit reached, stopping execution.");

    // Fetch and check user
    const currentUser = await fetchUser();
    if (!currentUser) return;

    try {

        // If last message is not defined, it can find the last message from user.
        if (!lastmsg)
            lastmsg = await fetch(baseURL + "/search?author_id=" + currentUser.id + "&limit=1", { headers })
                .then(m => m.json()).then(m => m.messages[0][0].id);

        const response = await fetch(baseURL + "?before=" + (BigInt(lastmsg) + BigInt(1)), { headers });

        const messages = await response.json();

        // Check for wrong channel ID
        if (response.status === 404 || messages.code === 10003)
            return logMessage("Error: Unknown channel. Please double check the channel ID you entered and try again.");

        // Check if messages were fetched successfully
        if (!Array.isArray(messages))
            return logMessage("Error: Failed to fetch messages from the Discord API. This may be due to network issues. Try again later.");

        if (!messages.length)
            return logMessage(firstIteration ?
                "If you are seeing this message right after you tried to run the program and you were not even prompted for confirmation, this means you entered an invalid message ID. Messages will only be deleted if you entered the correct message ID and chose to continue after you were prompted for confirmation."
                : "No more messages to delete, stopping execution."
            );


        // Check if the last fetched message is the same as in the previous iteration
        const newLastFetchedMessage = messages.at(-1).id;

        if (lastFetchedMessage === newLastFetchedMessage)
            return logMessage("No more messages to delete, stopping execution.");

        // Update the lastFetchedMessage variable
        lastFetchedMessage = newLastFetchedMessage;

        if (firstIteration) {
            firstIteration = false; // Set the firstIteration flag to false

            const targetMessage = messages.find(message => message.id === lastmsg);

            if (!targetMessage)
                return logMessage("Error: The provided message ID does not exist in the specified channel. Please double check the message ID and try again.");

            // to-do: maybe it is not require to check
            if (targetMessage.author.id !== currentUser.id)
                return logMessage("Error: The provided message ID does not belong to the specified user; you can only delete messages you have sent. Please double check the message ID and try again.");

            // Prompt the user to confirm whether they want to proceed with message deletion and handle their response
            const userConfirmation = await promptUserConfirmation();
            if (!userConfirmation)
                return logMessage("User cancelled the operation. No messages will be deleted.");

        }

        for (const message of messages) {
            lastmsg = message.id;

            if (message.author.id === currentUser.id) {

                await new Promise(resolve => setTimeout(resolve, delay));
                const res = await fetch(`${baseURL}/${message.id}`, { headers, method: 'DELETE' });

                if (res.ok)
                    logMessage(`Completed: ${++deletedMessagesCount}`);
                else
                    logMessage("ERROR: " + res.status + " Error Count:" + (++errorCount));

                if (limit > 0 && deletedMessagesCount >= limit)
                    return logMessage("Message limit reached, stopping execution.");

            } else
                logMessage("Ignoring message sent by another user.");

        }

        clearMessages();
    } catch (error) {
        console.error(error);
        logMessage(`Error: An error occurred while fetching messages from the Discord API. This may be due to network issues, try again later. Error message: ${error.message}`);
    }
}

// Start clearing messages in the specified channel
clearMessages();