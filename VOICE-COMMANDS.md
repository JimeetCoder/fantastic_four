# Voice Commands Guide

## Fixed Issues
✅ **Error Message Fixed**: No more error messages during initialization
✅ **Tab Control**: Can now open and manage browser tabs
✅ **YouTube Control**: Can open YouTube, search, and play videos
✅ **Web Automation**: Control various websites via voice

## Available Voice Commands

### Tab Management
- **"Open new tab"** - Opens a new browser tab
- **"Open [website]"** - Opens a website (e.g., "open google", "open gmail")
- **"Close tab"** - Closes the current tab
- **"Switch to next tab"** - Switches to the next tab
- **"Switch to previous tab"** - Switches to the previous tab

### YouTube Commands
- **"Open YouTube"** - Opens YouTube
- **"Play [video name]"** - Searches and plays a video on YouTube
  - Example: "Play funny cat videos"
  - Example: "Play music"
- **"Play video"** - Plays video on current YouTube page
- **"Pause video"** - Pauses video on YouTube

### Web Navigation
- **"Open [site name]"** - Opens common websites:
  - Google, Gmail, Facebook, Twitter, Reddit, GitHub, StackOverflow
- **"Search for [query]"** - Opens Google search
  - Example: "Search for weather today"

### General Commands
- **"Hello Vision"** - Activates the assistant (wake word)
- Any other question - Gets AI response from Ollama

## Example Usage

1. **Say**: "Hello Vision"
2. **Wait for**: "Hello! How can I help you?"
3. **Say**: "Open YouTube"
4. **Result**: YouTube opens in a new tab

1. **Say**: "Hello Vision"
2. **Say**: "Play funny cat videos"
3. **Result**: YouTube opens, searches, and plays the first result

1. **Say**: "Hello Vision"
2. **Say**: "Open Gmail"
3. **Result**: Gmail opens in a new tab

1. **Say**: "Hello Vision"
2. **Say**: "Switch to next tab"
3. **Result**: Switches to the next browser tab

## How It Works

1. **Wake Word Detection**: Say "Hello Vision" to activate
2. **Command Recognition**: Your command is converted to text
3. **Action Processing**: 
   - Web commands (open, play, etc.) are handled directly
   - Other commands go to Ollama AI for response
4. **Response**: Action is performed or AI responds

## Troubleshooting

### Commands not working?
- Make sure you said "Hello Vision" first
- Speak clearly and wait for activation
- Check microphone permissions

### YouTube not playing?
- Make sure YouTube page is loaded
- Try saying "Play video" when on YouTube page
- Some videos may require manual interaction

### Tabs not opening?
- Check browser permissions for the extension
- Reload the extension if needed

## Tips

- Speak naturally: "Hello Vision, open YouTube"
- Be specific: "Play [exact video name]" works better
- Wait for activation: Say "Hello Vision" and wait for response
- Multiple commands: Say "Hello Vision" again for each new command

