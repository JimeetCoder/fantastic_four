/**
 * Web Control Module
 * Handles tab management, YouTube control, and web automation
 */

class WebController {
    constructor() {
        this.commands = {
            'open': this.handleOpenCommand.bind(this),
            'play': this.handlePlayCommand.bind(this),
            'pause': this.handlePauseCommand.bind(this),
            'search': this.handleSearchCommand.bind(this),
            'close': this.handleCloseCommand.bind(this),
            'switch': this.handleSwitchCommand.bind(this),
            'new tab': this.handleNewTab.bind(this),
            'scroll': this.handleScrollCommand.bind(this),
            'scroll down': this.handleScrollDown.bind(this),
            'scroll up': this.handleScrollUp.bind(this)
        };
    }

    async handleOpenCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Extract URL from command
        const url = this.extractUrl(command);
        if (url) {
            return await this.openUrl(url);
        }
        
        // YouTube variations
        const youtubePhrases = ['youtube', 'yt', 'you tube'];
        if (youtubePhrases.some(phrase => lowerCommand.includes(phrase))) {
            return await this.openYouTube(lowerCommand);
        }
        
        // Common sites with variations
        const siteMap = {
            'google': ['google', 'goog', 'g'],
            'gmail': ['gmail', 'email', 'mail'],
            'facebook': ['facebook', 'fb', 'face book'],
            'twitter': ['twitter', 'x', 'tweet'],
            'instagram': ['instagram', 'insta', 'ig'],
            'reddit': ['reddit', 'red it'],
            'github': ['github', 'git hub'],
            'stackoverflow': ['stackoverflow', 'stack overflow', 'stack'],
            'netflix': ['netflix', 'net flix'],
            'amazon': ['amazon', 'amzn'],
            'wikipedia': ['wikipedia', 'wiki'],
            'linkedin': ['linkedin', 'linked in'],
            'discord': ['discord', 'disc'],
            'spotify': ['spotify', 'spot'],
            'whatsapp': ['whatsapp', 'whats app', 'wa']
        };
        
        const siteUrls = {
            'google': 'https://www.google.com',
            'gmail': 'https://mail.google.com',
            'facebook': 'https://www.facebook.com',
            'twitter': 'https://twitter.com',
            'instagram': 'https://www.instagram.com',
            'reddit': 'https://www.reddit.com',
            'github': 'https://github.com',
            'stackoverflow': 'https://stackoverflow.com',
            'netflix': 'https://www.netflix.com',
            'amazon': 'https://www.amazon.com',
            'wikipedia': 'https://www.wikipedia.org',
            'linkedin': 'https://www.linkedin.com',
            'discord': 'https://discord.com',
            'spotify': 'https://open.spotify.com',
            'whatsapp': 'https://web.whatsapp.com'
        };
        
        for (const [site, phrases] of Object.entries(siteMap)) {
            if (phrases.some(phrase => lowerCommand.includes(phrase))) {
                return await this.openUrl(siteUrls[site]);
            }
        }
        
        // Try to extract website name from command using Ollama
        // Remove common words and try to find website name
        const websiteName = this.extractWebsiteName(command);
        if (websiteName) {
            // Try common TLDs
            const tlds = ['.com', '.org', '.net', '.edu', '.io', '.co'];
            for (const tld of tlds) {
                try {
                    const testUrl = `https://www.${websiteName}${tld}`;
                    // Just try opening it - browser will handle if invalid
                    return await this.openUrl(testUrl);
                } catch (e) {
                    continue;
                }
            }
        }
        
        return null;
    }

    extractWebsiteName(command) {
        // Extract website name from commands like "open example" or "go to example"
        const patterns = [
            /(?:open|go to|visit|navigate to|show me|take me to)\s+(?:the\s+)?(?:website\s+)?(?:www\.)?([a-z0-9-]+)(?:\s+website)?/i,
            /(?:open|go to|visit)\s+([a-z0-9-]+)\.(?:com|org|net|edu|io|co)/i
        ];
        
        for (const pattern of patterns) {
            const match = command.match(pattern);
            if (match && match[1]) {
                return match[1].toLowerCase().trim();
            }
        }
        
        return null;
    }

    async openYouTube(command) {
        let url = 'https://www.youtube.com';
        
        // Check for specific video or search
        if (command.includes('play') || command.includes('video')) {
            const searchQuery = this.extractSearchQuery(command);
            if (searchQuery) {
                url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
            } else {
                url = 'https://www.youtube.com';
            }
        }
        
        return await this.openUrl(url);
    }

    async handlePlayCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Various phrasings for playing YouTube videos
        const playPhrases = [
            'play', 'playing', 'start', 'begin', 'watch', 'watching', 
            'show', 'showing', 'run', 'running', 'launch', 'launching'
        ];
        const videoPhrases = [
            'video', 'videos', 'clip', 'clips', 'movie', 'movies',
            'song', 'songs', 'music', 'track', 'tracks'
        ];
        const youtubePhrases = [
            'youtube', 'yt', 'you tube', 'on youtube', 'from youtube',
            'youtube video', 'youtube videos'
        ];
        
        const hasPlayPhrase = playPhrases.some(phrase => lowerCommand.includes(phrase));
        const hasVideoPhrase = videoPhrases.some(phrase => lowerCommand.includes(phrase));
        const hasYouTubePhrase = youtubePhrases.some(phrase => lowerCommand.includes(phrase));
        
        // Check for feed-related commands
        const feedPhrases = ['feed', 'first video', 'next video', 'this video', 'video in feed'];
        if (feedPhrases.some(phrase => lowerCommand.includes(phrase))) {
            // Play video from feed
            if (await this.isYouTubePage()) {
                if (lowerCommand.includes('next')) {
                    return await this.playNextVideoInFeed();
                } else if (lowerCommand.includes('first')) {
                    return await this.playFirstVideoInFeed();
                } else {
                    return await this.playVideoInFeed();
                }
            } else if (await this.isInstagramPage()) {
                return await this.playInstagramVideo();
            } else {
                // Open YouTube and play first video in feed
                await this.openUrl('https://www.youtube.com');
                setTimeout(async () => {
                    await this.playFirstVideoInFeed();
                }, 3000);
                return 'Opening YouTube and playing first video in feed';
            }
        }
        
        // Check if command is about playing YouTube video (various phrasings)
        if ((hasPlayPhrase && hasVideoPhrase) || hasYouTubePhrase || 
            (hasPlayPhrase && hasYouTubePhrase)) {
            
            // Extract video name from command
            const videoName = this.extractVideoName(command);
            const searchQuery = videoName || this.extractSearchQuery(command);
            
            if (searchQuery) {
                // If on YouTube page, use Ollama to understand screen content and find video
                if (await this.isYouTubePage()) {
                    return await this.findAndPlayVideoWithOllama(searchQuery);
                } else {
                    // Open YouTube search
                    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
                    await this.openUrl(url);
                    
                    // Wait for page to load, then use Ollama to find and play the video
                    setTimeout(async () => {
                        await this.findAndPlayVideoWithOllama(searchQuery);
                    }, 3000);
                    
                    return `Searching for and playing ${searchQuery} on YouTube`;
                }
            } else if (hasYouTubePhrase || (hasPlayPhrase && hasVideoPhrase)) {
                // Just "play YouTube video" or "playing video" - open YouTube
                if (!(await this.isYouTubePage())) {
                    await this.openUrl('https://www.youtube.com');
                    return 'Opening YouTube';
                } else {
                    // Already on YouTube, play current video
                    await this.playYouTubeVideo();
                    return 'Playing video';
                }
            }
        }
        
        // Play video on current YouTube page (various phrasings)
        if (await this.isYouTubePage() && hasPlayPhrase) {
            await this.playYouTubeVideo();
            return 'Playing video';
        }
        
        return null;
    }

    async findAndPlayVideoWithOllama(searchQuery) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                // Extract all video titles from the page
                const videos = await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        const videoElements = document.querySelectorAll(
                            'ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer'
                        );
                        const videos = [];
                        videoElements.forEach((element, index) => {
                            if (index < 20) { // Get top 20 videos
                                const titleElement = element.querySelector('a#video-title, a#video-title-link');
                                const title = titleElement?.textContent?.trim() || '';
                                const link = titleElement?.href || '';
                                if (title) {
                                    videos.push({ index: index + 1, title, link });
                                }
                            }
                        });
                        return videos;
                    }
                });

                if (videos && videos[0] && videos[0].result && videos[0].result.length > 0) {
                    // Format video list for Ollama
                    const videoList = videos[0].result.map(v => 
                        `${v.index}. ${v.title}`
                    ).join('\n');

                    // Use Ollama to find the best matching video
                    const ollamaPrompt = `I want to play a video about "${searchQuery}". Here are the available videos:\n\n${videoList}\n\nWhich video number best matches what I'm looking for? Respond with just the number.`;
                    
                    // Request Ollama response
                    chrome.runtime.sendMessage({
                        action: 'processWithOllama',
                        prompt: ollamaPrompt,
                        speak: false
                    }).then(response => {
                        if (response && response.success && response.response) {
                            // Extract number from response
                            const match = response.response.match(/\d+/);
                            if (match) {
                                const videoIndex = parseInt(match[0]) - 1;
                                if (videoIndex >= 0 && videoIndex < videos[0].result.length) {
                                    // Play the selected video
                                    chrome.scripting.executeScript({
                                        target: { tabId: tabs[0].id },
                                        args: [videos[0].result[videoIndex].link],
                                        func: (link) => {
                                            window.location.href = link;
                                        }
                                    });
                                }
                            }
                        }
                    }).catch(() => {
                        // Fallback to simple search
                        this.findAndPlayYouTubeVideo(searchQuery);
                    });
                }
            }
        } catch (error) {
            console.error('Error finding video with Ollama:', error);
            // Fallback to simple search
            await this.findAndPlayYouTubeVideo(searchQuery);
        }
    }

    async handlePauseCommand(command) {
        if (await this.isYouTubePage()) {
            await this.pauseYouTubeVideo();
            return 'Video paused';
        }
        return null;
    }

    async handleSearchCommand(command) {
        const searchQuery = this.extractSearchQuery(command);
        if (searchQuery) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
            await this.openUrl(url);
            
            // Wait for page to load, then extract and process results with Ollama
            setTimeout(async () => {
                await this.processSearchResultsWithOllama(searchQuery);
            }, 3000);
            
            return `Searching for ${searchQuery}`;
        }
        return null;
    }

    async processSearchResultsWithOllama(searchQuery) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                // Extract search results from the page
                const results = await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        const searchResults = [];
                        // Extract Google search results
                        const resultElements = document.querySelectorAll('div.g, div[data-ved]');
                        resultElements.forEach((element, index) => {
                            if (index < 5) { // Get top 5 results
                                const title = element.querySelector('h3')?.textContent || '';
                                const snippet = element.querySelector('span')?.textContent || '';
                                const link = element.querySelector('a')?.href || '';
                                if (title) {
                                    searchResults.push({ title, snippet, link });
                                }
                            }
                        });
                        return searchResults;
                    }
                });

                if (results && results[0] && results[0].result && results[0].result.length > 0) {
                    // Format results for Ollama
                    const resultsText = results[0].result.map((r, i) => 
                        `${i + 1}. ${r.title}\n   ${r.snippet}`
                    ).join('\n\n');

                    // Send to Ollama to summarize
                    const ollamaPrompt = `Summarize these search results for "${searchQuery}":\n\n${resultsText}\n\nProvide a concise summary of the top results.`;
                    
                    // Request Ollama response via message to app.js and speak results
                    chrome.runtime.sendMessage({
                        action: 'processWithOllama',
                        prompt: ollamaPrompt,
                        speak: true
                    }).then(response => {
                        if (response && response.success && response.response) {
                            // Results will be spoken by app.js
                            console.log('Search results processed and spoken');
                        }
                    }).catch(() => {
                        // If message fails, fallback
                        console.log(`Found ${results[0].result.length} results for ${searchQuery}`);
                    });
                }
            }
        } catch (error) {
            console.error('Error processing search results with Ollama:', error);
        }
    }

    async handleCloseCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('tab')) {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.tabs.remove(tabs[0].id);
                return 'Tab closed';
            }
        }
        
        return null;
    }

    async handleSwitchCommand(command) {
        // Switch to next/previous tab
        const lowerCommand = command.toLowerCase();
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const currentTab = tabs.find(t => t.active);
        
        if (!currentTab) return null;
        
        const currentIndex = tabs.indexOf(currentTab);
        
        if (lowerCommand.includes('next')) {
            const nextIndex = (currentIndex + 1) % tabs.length;
            await chrome.tabs.update(tabs[nextIndex].id, { active: true });
            return 'Switched to next tab';
        } else if (lowerCommand.includes('previous') || lowerCommand.includes('prev')) {
            const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
            await chrome.tabs.update(tabs[prevIndex].id, { active: true });
            return 'Switched to previous tab';
        }
        
        return null;
    }

    async handleNewTab(command) {
        const url = this.extractUrl(command) || 'chrome://newtab/';
        await chrome.tabs.create({ url });
        return 'New tab opened';
    }

    async openUrl(url) {
        try {
            await chrome.tabs.create({ url });
            return `Opening ${url}`;
        } catch (error) {
            console.error('Error opening URL:', error);
            throw new Error(`Failed to open ${url}`);
        }
    }

    async isYouTubePage() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0] && tabs[0].url) {
                return tabs[0].url.includes('youtube.com') || tabs[0].url.includes('youtu.be');
            }
        } catch (error) {
            console.error('Error checking YouTube page:', error);
        }
        return false;
    }

    async isInstagramPage() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0] && tabs[0].url) {
                return tabs[0].url.includes('instagram.com');
            }
        } catch (error) {
            console.error('Error checking Instagram page:', error);
        }
        return false;
    }

    async playVideoInFeed() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Try to find and click the first video in the feed
                        // YouTube homepage feed videos
                        const videoSelectors = [
                            'ytd-rich-item-renderer a#video-title-link',
                            'ytd-video-renderer a#video-title-link',
                            'ytd-grid-video-renderer a#video-title-link',
                            'a#video-title-link',
                            'a#video-title'
                        ];
                        
                        for (const selector of videoSelectors) {
                            const video = document.querySelector(selector);
                            if (video) {
                                video.click();
                                return;
                            }
                        }
                        
                        // If no video found, try clicking any video thumbnail
                        const thumbnails = document.querySelectorAll('ytd-thumbnail a');
                        if (thumbnails.length > 0) {
                            thumbnails[0].click();
                        }
                    }
                });
                return 'Playing video in feed';
            }
        } catch (error) {
            console.error('Error playing video in feed:', error);
        }
        return null;
    }

    async playFirstVideoInFeed() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Find the first video in the feed
                        const videoSelectors = [
                            'ytd-rich-item-renderer:first-child a#video-title-link',
                            'ytd-video-renderer:first-child a#video-title-link',
                            'ytd-grid-video-renderer:first-child a#video-title-link',
                            'a#video-title-link',
                            'a#video-title'
                        ];
                        
                        for (const selector of videoSelectors) {
                            const video = document.querySelector(selector);
                            if (video) {
                                video.click();
                                return;
                            }
                        }
                    }
                });
                return 'Playing first video in feed';
            }
        } catch (error) {
            console.error('Error playing first video in feed:', error);
        }
        return null;
    }

    async playNextVideoInFeed() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Find all videos in the feed
                        const allVideos = document.querySelectorAll(
                            'ytd-rich-item-renderer a#video-title-link, ' +
                            'ytd-video-renderer a#video-title-link, ' +
                            'ytd-grid-video-renderer a#video-title-link, ' +
                            'a#video-title-link'
                        );
                        
                        // Find the currently playing video or first visible video
                        const currentVideo = document.querySelector('.ytp-title-link, .ytp-impression-link');
                        let currentIndex = 0;
                        
                        if (currentVideo) {
                            // Try to find the index of current video
                            for (let i = 0; i < allVideos.length; i++) {
                                if (allVideos[i].href === currentVideo.href) {
                                    currentIndex = i;
                                    break;
                                }
                            }
                        }
                        
                        // Play next video
                        const nextIndex = (currentIndex + 1) % allVideos.length;
                        if (allVideos[nextIndex]) {
                            allVideos[nextIndex].click();
                        }
                    }
                });
                return 'Playing next video in feed';
            }
        } catch (error) {
            console.error('Error playing next video in feed:', error);
        }
        return null;
    }

    async playInstagramVideo() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Find video element in Instagram feed
                        const videoSelectors = [
                            'video',
                            'article video',
                            'div[role="main"] video'
                        ];
                        
                        for (const selector of videoSelectors) {
                            const video = document.querySelector(selector);
                            if (video) {
                                if (video.paused) {
                                    video.play();
                                }
                                return;
                            }
                        }
                        
                        // Try clicking play button
                        const playButton = document.querySelector('button[aria-label*="Play"], button[aria-label*="play"]');
                        if (playButton) {
                            playButton.click();
                        }
                    }
                });
                return 'Playing Instagram video';
            }
        } catch (error) {
            console.error('Error playing Instagram video:', error);
        }
        return null;
    }

    async playYouTubeVideo() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        const playButton = document.querySelector('.ytp-play-button');
                        if (playButton) {
                            playButton.click();
                        } else {
                            // Try space key
                            document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error playing YouTube video:', error);
        }
    }

    async pauseYouTubeVideo() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        const playButton = document.querySelector('.ytp-play-button');
                        if (playButton && playButton.getAttribute('aria-label')?.includes('Play')) {
                            // Video is paused, click to play (this will pause if playing)
                            playButton.click();
                        } else {
                            // Try space key
                            document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', code: 'Space' }));
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error pausing YouTube video:', error);
        }
    }

    async findAndPlayYouTubeVideo(searchQuery) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    args: [searchQuery.toLowerCase()],
                    func: (query) => {
                        // Find video that matches the search query
                        const videoLinks = document.querySelectorAll('a#video-title, a#video-title-link, ytd-video-renderer a#video-title-link');
                        
                        for (const link of videoLinks) {
                            const title = link.textContent.toLowerCase();
                            const titleElement = link.querySelector('#video-title') || link;
                            const titleText = titleElement.textContent.toLowerCase();
                            
                            // Check if title contains search query
                            if (titleText.includes(query) || title.includes(query)) {
                                link.click();
                                return;
                            }
                        }
                        
                        // If no match found, click first video
                        if (videoLinks.length > 0) {
                            videoLinks[0].click();
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error finding and playing YouTube video:', error);
        }
    }

    async playFirstYouTubeResult() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Wait for results to load, then click first video
                        setTimeout(() => {
                            const firstVideo = document.querySelector('a#video-title, a#video-title-link');
                            if (firstVideo) {
                                firstVideo.click();
                            }
                        }, 2000);
                    }
                });
            }
        } catch (error) {
            console.error('Error playing first YouTube result:', error);
        }
    }

    extractUrl(command) {
        // Try to extract URL from command
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/i;
        const match = command.match(urlRegex);
        if (match) {
            let url = match[0];
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            return url;
        }
        return null;
    }

    extractSearchQuery(command) {
        // Extract search query from various phrasings
        const patterns = [
            /(?:search|find|look\s+for|look\s+up|get|show\s+me)\s+(?:for\s+)?(?:a\s+)?(?:video\s+)?(?:about\s+)?(.+?)(?:\s+on\s+youtube|\s+video)?$/i,
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(?:a\s+)?(?:the\s+)?(?:youtube\s+)?(?:video\s+)?(?:about\s+)?(.+?)(?:\s+(?:video|videos|on\s+youtube|from\s+youtube))?$/i,
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(.+)/i,
            /(?:video|videos|song|songs|music|track|tracks|clip|clips)\s+(?:about\s+)?(.+)/i
        ];
        
        for (const pattern of patterns) {
            const match = command.match(pattern);
            if (match && match[1]) {
                let query = match[1].trim();
                // Remove common words
                query = query.replace(/\s+(video|videos|song|songs|music|track|tracks|on\s+youtube|from\s+youtube|youtube\s+video)$/i, '');
                query = query.replace(/^(the|a|an)\s+/i, '');
                
                // Don't return if it's just common words
                const commonWords = ['video', 'videos', 'youtube', 'play', 'playing', 'this', 'that', 'it'];
                if (!commonWords.includes(query.toLowerCase()) && query.length > 2) {
                    return query;
                }
            }
        }
        
        return null;
    }

    extractVideoName(command) {
        // Extract video name from various phrasings
        const patterns = [
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(?:a\s+)?(?:the\s+)?(?:youtube\s+)?(?:video\s+)?(?:about\s+)?(?:called\s+)?(.+?)(?:\s+(?:video|videos|clip|clips|song|songs|music|track|tracks|on\s+youtube|from\s+youtube))?$/i,
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(?:a\s+)?(?:the\s+)?(.+?)\s+(?:video|videos|clip|clips|song|songs|music|track|tracks)/i,
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(?:on\s+youtube|from\s+youtube)\s+(?:a\s+)?(?:video\s+)?(?:about\s+)?(.+)/i,
            /(?:play|playing|start|begin|watch|watching|show|showing|run|running|launch|launching)\s+(.+)/i
        ];
        
        for (const pattern of patterns) {
            const match = command.match(pattern);
            if (match && match[1]) {
                // Remove common words and phrases
                let videoName = match[1].trim();
                videoName = videoName.replace(/\s+(video|videos|clip|clips|song|songs|music|track|tracks|on\s+youtube|from\s+youtube|youtube\s+video)$/i, '');
                videoName = videoName.replace(/^(the|a|an)\s+/i, '');
                
                // Don't return if it's just common words
                const commonWords = ['video', 'videos', 'youtube', 'play', 'playing', 'this', 'that', 'it'];
                if (!commonWords.includes(videoName.toLowerCase()) && videoName.length > 2) {
                    return videoName;
                }
            }
        }
        
        return null;
    }

    async handleScrollCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        if (lowerCommand.includes('down')) {
            return await this.handleScrollDown(command);
        } else if (lowerCommand.includes('up')) {
            return await this.handleScrollUp(command);
        } else if (lowerCommand.includes('youtube')) {
            return await this.scrollYouTube(command);
        } else if (lowerCommand.includes('instagram')) {
            return await this.scrollInstagram(command);
        }
        
        return null;
    }

    async handleScrollDown(command) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Smooth scroll down
                        window.scrollBy({
                            top: 500,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                });
                return 'Scrolled down';
            }
        } catch (error) {
            console.error('Error scrolling down:', error);
        }
        return null;
    }

    async handleScrollUp(command) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0]) {
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: () => {
                        // Smooth scroll up
                        window.scrollBy({
                            top: -500,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                });
                return 'Scrolled up';
            }
        } catch (error) {
            console.error('Error scrolling up:', error);
        }
        return null;
    }

    async scrollYouTube(command) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0] && (tabs[0].url.includes('youtube.com') || tabs[0].url.includes('youtu.be'))) {
                const lowerCommand = command.toLowerCase();
                const scrollAmount = lowerCommand.includes('more') ? 1000 : 500;
                const direction = lowerCommand.includes('up') ? -1 : 1;
                
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    args: [scrollAmount * direction],
                    func: (amount) => {
                        // Smooth scroll
                        window.scrollBy({
                            top: amount,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                });
                return `Scrolled YouTube ${direction > 0 ? 'down' : 'up'}`;
            }
        } catch (error) {
            console.error('Error scrolling YouTube:', error);
        }
        return null;
    }

    async scrollInstagram(command) {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs[0] && tabs[0].url.includes('instagram.com')) {
                const lowerCommand = command.toLowerCase();
                const scrollAmount = lowerCommand.includes('more') ? 1000 : 500;
                const direction = lowerCommand.includes('up') ? -1 : 1;
                
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    args: [scrollAmount * direction],
                    func: (amount) => {
                        // Smooth scroll
                        window.scrollBy({
                            top: amount,
                            left: 0,
                            behavior: 'smooth'
                        });
                    }
                });
                return `Scrolled Instagram ${direction > 0 ? 'down' : 'up'}`;
            }
        } catch (error) {
            console.error('Error scrolling Instagram:', error);
        }
        return null;
    }

    async processCommand(command) {
        const lowerCommand = command.toLowerCase();
        
        // Check for scroll commands first (more specific)
        const scrollPhrases = ['scroll', 'scrolling', 'move', 'moving', 'go', 'going'];
        if (scrollPhrases.some(phrase => lowerCommand.includes(phrase))) {
            if (lowerCommand.includes('youtube') || lowerCommand.includes('yt')) {
                try {
                    const result = await this.scrollYouTube(command);
                    if (result) return result;
                } catch (error) {
                    console.error('Error scrolling YouTube:', error);
                }
            } else if (lowerCommand.includes('instagram') || lowerCommand.includes('insta')) {
                try {
                    const result = await this.scrollInstagram(command);
                    if (result) return result;
                } catch (error) {
                    console.error('Error scrolling Instagram:', error);
                }
            } else if (lowerCommand.includes('down') || lowerCommand.includes('below') || lowerCommand.includes('lower')) {
                try {
                    const result = await this.handleScrollDown(command);
                    if (result) return result;
                } catch (error) {
                    console.error('Error scrolling down:', error);
                }
            } else if (lowerCommand.includes('up') || lowerCommand.includes('above') || lowerCommand.includes('higher')) {
                try {
                    const result = await this.handleScrollUp(command);
                    if (result) return result;
                } catch (error) {
                    console.error('Error scrolling up:', error);
                }
            }
        }
        
        // Check for open/visit/navigate commands with various phrasings
        const openPhrases = ['open', 'opening', 'go to', 'go', 'visit', 'visiting', 'navigate to', 'navigate', 'show me', 'show', 'take me to', 'take', 'launch', 'launching'];
        if (openPhrases.some(phrase => lowerCommand.includes(phrase))) {
            try {
                const result = await this.handleOpenCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling open command:', error);
            }
        }
        
        // Check for play/watch/start commands with various phrasings
        const playPhrases = ['play', 'playing', 'start', 'begin', 'watch', 'watching', 'show', 'showing', 'run', 'running', 'launch', 'launching'];
        if (playPhrases.some(phrase => lowerCommand.includes(phrase))) {
            try {
                const result = await this.handlePlayCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling play command:', error);
            }
        }
        
        // Check for pause/stop commands
        const pausePhrases = ['pause', 'pausing', 'stop', 'stopping', 'halt', 'halting'];
        if (pausePhrases.some(phrase => lowerCommand.includes(phrase))) {
            try {
                const result = await this.handlePauseCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling pause command:', error);
            }
        }
        
        // Check for search commands with various phrasings
        const searchPhrases = ['search', 'searching', 'find', 'finding', 'look for', 'look up', 'lookup', 'get', 'getting'];
        if (searchPhrases.some(phrase => lowerCommand.includes(phrase))) {
            try {
                const result = await this.handleSearchCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling search command:', error);
            }
        }
        
        // Check for close commands
        const closePhrases = ['close', 'closing', 'shut', 'shutting'];
        if (closePhrases.some(phrase => lowerCommand.includes(phrase))) {
            try {
                const result = await this.handleCloseCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling close command:', error);
            }
        }
        
        // Check for switch/change tab commands
        const switchPhrases = ['switch', 'switching', 'change', 'changing', 'next', 'previous', 'prev'];
        if (switchPhrases.some(phrase => lowerCommand.includes(phrase)) && lowerCommand.includes('tab')) {
            try {
                const result = await this.handleSwitchCommand(command);
                if (result) return result;
            } catch (error) {
                console.error('Error handling switch command:', error);
            }
        }
        
        return null;
    }
}

// Export for use in main app
if (typeof window !== 'undefined') {
    window.WebController = WebController;
}

