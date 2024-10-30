// recoveryJournal.js

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Define file paths
const appDataPath = path.join(process.env.APPDATA, 'RecoveryJournal');
const strugglesFilePath = path.join(appDataPath, 'struggles.json');
const journalFilePath = path.join(appDataPath, 'journal.json');
const milestonesFilePath = path.join(appDataPath, 'milestones.json');
const passwordFilePath = path.join(appDataPath, 'password.json');

// Ensure app data directory exists
if (!fs.existsSync(appDataPath)) {
    fs.mkdirSync(appDataPath);
}

// Initialize the program
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to load JSON data from a file
const loadJSON = (filePath) => {
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    }
    return {};
};

// Function to save JSON data to a file
const saveJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Function to display the main menu
const mainMenu = () => {
    console.clear();
    console.log('=== Recovery Journal ===');
    console.log('1. Log Struggle');
    console.log('2. View Journal');
    console.log('3. Log Milestone');
    console.log('4. Exit');

    rl.question('Select an option: ', (option) => {
        switch (option) {
            case '1':
                logStruggle();
                break;
            case '2':
                viewJournal();
                break;
            case '3':
                logMilestone();
                break;
            case '4':
                console.log('Exiting program...');
                rl.close();
                break;
            default:
                console.log('Invalid option, try again.');
                mainMenu();
                break;
        }
    });
};

// Function to log a struggle
const logStruggle = () => {
    rl.question('Did you struggle today? (y/n): ', (answer) => {
        const struggles = loadJSON(strugglesFilePath);
        const date = new Date().toLocaleDateString();

        if (answer.toLowerCase() === 'y') {
            rl.question('Please specify how you struggled: ', (details) => {
                struggles[date] = details;
                saveJSON(strugglesFilePath, struggles);
                console.log('Struggle logged successfully.');
                mainMenu();
            });
        } else {
            console.log('No struggle logged.');
            mainMenu();
        }
    });
};

// Function to view the journal
const viewJournal = () => {
    const journal = loadJSON(journalFilePath);
    console.clear();
    console.log('=== Journal Entries ===');
    Object.keys(journal).forEach((date) => {
        console.log(`${date}: ${journal[date]}`);
    });
    rl.question('Press Enter to return to the menu...', () => mainMenu());
};

// Function to log a milestone
const logMilestone = () => {
    rl.question('Enter milestone description: ', (milestone) => {
        const milestones = loadJSON(milestonesFilePath);
        const date = new Date().toLocaleDateString();
        milestones[date] = milestone;
        saveJSON(milestonesFilePath, milestones);
        console.log('Milestone logged successfully.');
        mainMenu();
    });
};

// Start the program
console.log('Welcome to Recovery Journal!');
mainMenu();
