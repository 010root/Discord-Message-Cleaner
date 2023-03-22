# Discord-Message-Cleaner
Simple cross-platform Discord Message Cleaner. It works on server channels and DMs.

## Disclaimer

This project is for educational purposes only and is not intended for use in violation of Discord's Terms of Service (TOS). Creating self-bots, automating user accounts, or using user tokens is against Discord's TOS and can result in the permanent suspension of your account. By using this project, you acknowledge the risks and accept full responsibility for any consequences that may arise. The author(s) and contributors of this project are not responsible for any actions taken by those who use this project.

PS
This program is designed with several safeguards in place to minimize the risk of violating Discord's TOS:

1. The program can only be used on an account you specifically own.
2. The program can only delete messages sent by your account, meaning it won't affect and cannot delete other users' messages.
3. The program includes a coded delay of 10 seconds between each message deletion, ensuring that only one message can be deleted every 10 seconds to avoid API rate limits.

These safeguards are intended to ensure that the program is used responsibly and with the understanding that its primary purpose is educational.

## Instructions

1. Install Node.js on your computer by downloading the installer from the official website and following the installation instructions. You can download the latest version from https://nodejs.org/en/download/.

2. Download the files from the GitHub repository by clicking on the "Code" button and then "Download ZIP". Extract the contents of the ZIP file to a folder on your computer.

3. Open the command prompt on your computer. You can do this by pressing the Windows key + R on your keyboard, typing "cmd" in the Run dialog box and pressing Enter.

4. Navigate to the folder where you extracted the files by using the "cd" command followed by the path of the folder. For example, if you extracted the files to the "C:\Tools\Discord-Message-Cleaner" folder, you would type:
cd /d C:\Tools\Discord-Message-Cleaner

5. Install the required dependencies by running the following command:
npm install

## data.txt

Open the data.txt file in a text editor and enter:

**Discord username** without # and the numbers after it.

**Token**.
You can obtain your Discord token by following these steps:
1. Open Discord in your web browser and log in to your account.
2. Press the F12 key on your keyboard to open the Developer Tools.
3. Select the Network tab. Press the F5 key on your keyboard and search for "science".
4. Select "science" and look for Headers->Request Headers.
5. Look for "authorizarion". Right-click on it and "Copy value". You now have your Discord token.

**Note: Keep your Discord token safe and do not share it with anyone.**

**Channel ID**
To find the channel ID in your web browser, follow these steps:

Navigate to the server channel or DM you want to delete messages from.
Look at the URL in your web browser's address bar. It should look something like this: https://discord.com/channels/123456789012345678/57849632587458963
The channel ID is the 18-digit number between the "channels/" and the second "/" in the URL. In this example, the channel ID is "123456789012345678".
Same case for DMs. The first 18-digit number after "@me/"

**Message ID**
To find the message ID in your web browser, follow these steps:

Navigate to the channel or DM where the message you want to delete is located.
Find the message you want to delete and click on the three dots icon in the upper right corner of the message.
Click on "Copy Link" in the menu that appears.
The message link will be copied to your clipboard. It should look something like this: https://discord.com/channels/123456789012345678/42589735845682456
For both server channels and DMs the message ID is the last 18-digit number at the end of the URL. In this example, the message ID is "42589735845682456".

Check **"dataexample.txt"** to see an example of what your **"data.txt"** should look like.
**The messages limit is only an option in case you only wanna delete a specific amount of messages. If you don't wanna have a limit don't only enter your username, toke, channel ID and message ID. The program will then continue to delete your messages every 10 seconds with no limit until there are no more messages to delete.**

Save and close the data.txt file.

## Run the program

1. In the command prompt, run the following command to start the program:
node cleaner.js

2. The program will prompt you for confirmation before proceeding with message deletion. Type "yes" to confirm and start deleting your messages, or enter any other key to cancel.

3. The program will run in the background and delete your messages according to the specified criteria. You can monitor its progress by checking the log.txt file in the same folder as the program.

## Final notes

1. The program can only run as long as you keep your Command Prompt open.
2. Once you run the program and agree to delete messages. All messages that were sent before the specified message ID will be deleted, starting with the message ID you entered.
3. The program was designed to avoid deleting messages accidentally. Hence why you have the option to set a limit.
4. If you stop the program and wish to continue deleting messages later in the same channel or DM. You need to update the message ID again since the original message ID you entered won't exist anymore.
