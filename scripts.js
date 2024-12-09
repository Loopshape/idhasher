let buffer = []; // Buffer to store commands and outputs
let keySymbols = ""; // Buffer to hold key symbols as they are typed

document.addEventListener("DOMContentLoaded", () => {
    const commandInput = document.getElementById("commandInput");
    const bufferDiv = document.getElementById("buffer");

    // Event listener for keydown
    commandInput.addEventListener("keydown", (event) => {
        handleKeyPress(event, bufferDiv);
    });
});

// Handle single key press
function handleKeyPress(event, bufferDiv) {
    const commandInput = document.getElementById("commandInput");

    // Append the key symbol unless it's Enter
    if (event.key !== "Enter") {
        keySymbols += event.key;
    } else {
        event.preventDefault(); // Prevent default behavior (new line)
        parseAndProcessCommand(keySymbols.trim(), bufferDiv); // Parse and process entered command
        keySymbols = ""; // Reset key symbol buffer
        commandInput.value = ""; // Clear input field
    }

    // Display the captured symbols in real-time
    displayKeySymbols(bufferDiv);
}

// Display the currently typed key symbols in real-time
function displayKeySymbols(bufferDiv) {
    const livePrompt = document.getElementById("livePrompt");

    if (!livePrompt) {
        // Create a live prompt display if not already present
        const liveDisplay = document.createElement("div");
        liveDisplay.id = "livePrompt";
        liveDisplay.classList.add("prompt");
        bufferDiv.appendChild(liveDisplay);
    }

    // Update the live prompt with current key symbols
    document.getElementById("livePrompt").textContent = `Typing: ${keySymbols}`;
}

// Parse and process the command
function parseAndProcessCommand(input, bufferDiv) {
    if (!input) return; // Do nothing if input is empty

    // Add the command to the buffer
    buffer.push({ type: "input", content: input });

    // Parse and interpret the command
    try {
        const parsedCommand = parseCommand(input);
        const output = executeCommand(parsedCommand);
        buffer.push({ type: "output", content: output });
    } catch (error) {
        buffer.push({ type: "error", content: `Error: ${error.message}` });
    }

    // Clear live typing area
    const livePrompt = document.getElementById("livePrompt");
    if (livePrompt) livePrompt.remove();

    // Update the buffer display
    updateBufferDisplay(bufferDiv);
}

// Parse the command for structure
function parseCommand(command) {
    const validCommandPattern = /^(exec|call)\s+[\w\.\(\)]+/g;
    const matches = command.match(validCommandPattern);

    if (!matches) {
        throw new Error("Invalid command format. Use 'exec' or 'call' followed by valid syntax.");
    }

    // Split the command into parts for detailed parsing
    const parsed = matches.map((cmd) => {
        const parts = cmd.split(/\s+/);
        return { action: parts[0], content: parts.slice(1).join(" ") };
    });

    return parsed;
}

// Execute parsed commands
function executeCommand(parsedCommand) {
    const results = [];

    parsedCommand.forEach((cmd, index) => {
        if (cmd.action === "exec") {
            results.push(`EXEC: Executing ${cmd.content}`);
        } else if (cmd.action === "call") {
            results.push(`CALL: Calling ${cmd.content}`);
        } else {
            throw new Error(`Unknown action: ${cmd.action}`);
        }
    });

    return results.join("\n");
}

// Update the buffer display
function updateBufferDisplay(bufferDiv) {
    bufferDiv.innerHTML = ""; // Clear the buffer display

    buffer.forEach((entry) => {
        const div = document.createElement("div");
        div.classList.add("prompt");

        if (entry.type === "input") {
            div.textContent = `Command: ${entry.content}`;
            div.style.backgroundColor = "#563a42";
        } else if (entry.type === "output") {
            div.textContent = `Output:\n${entry.content}`;
            div.style.backgroundColor = "#4a3b3f";
        } else if (entry.type === "error") {
            div.textContent = entry.content;
            div.style.backgroundColor = "#702f3a";
        }

        bufferDiv.appendChild(div);
    });

    // Scroll to the bottom of the buffer
    bufferDiv.scrollTop = bufferDiv.scrollHeight;
}
