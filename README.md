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

6. Open the data.txt file in a text editor and enter:
**Discord username** without # and the numbers after it

**Token**. You can obtain your Discord token by following these steps:
a. Open Discord in your web browser and log in to your account.
b. Press the F12 key on your keyboard to open the Developer Tools.
c. Select the Network tab. Press the F5 key on your keyboard and search for "science"
d. Select "science" and look for Headers->Request Headers.
e. Look for "authorizarion". Right-click on it and "Copy value". You now have your Discord token.
**Note: Keep your Discord token safe and do not share it with anyone.**

7. 
