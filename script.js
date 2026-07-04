// Spotify Web Player Clone - Logic & Interactions

// 1. Mock Database of Songs & Playlists
const songs = [
    {
        id: 1,
        title: "Retro Sunrise",
        artist: "Futurecop!",
        album: "Synthwave Dreams",
        cover: "assets/album_synthwave.png",
        duration: 165, // in seconds (2:45)
        playlistId: "pl-synth",
        liked: false
    },
    {
        id: 2,
        title: "Neon Cityscape",
        artist: "Lazerhawk",
        album: "Synthwave Dreams",
        cover: "assets/album_synthwave.png",
        duration: 210, // 3:30
        playlistId: "pl-synth",
        liked: true
    },
    {
        id: 3,
        title: "Study Session",
        artist: "Lofi Girl",
        album: "Lo-Fi Study Beats",
        cover: "assets/album_chill.png",
        duration: 180, // 3:00
        playlistId: "pl-chill",
        liked: false
    },
    {
        id: 4,
        title: "Rainy Days",
        artist: "ChilledCow",
        album: "Lo-Fi Study Beats",
        cover: "assets/album_chill.png",
        duration: 195, // 3:15
        playlistId: "pl-chill",
        liked: false
    },
    {
        id: 5,
        title: "Cyberpunk Night",
        artist: "Netrunner",
        album: "Cyberpunk Night",
        cover: "assets/album_cyberpunk.png",
        duration: 240, // 4:00
        playlistId: "pl-cyber",
        liked: false
    },
    {
        id: 6,
        title: "Grid Racer",
        artist: "Power Glove",
        album: "Cyberpunk Night",
        cover: "assets/album_cyberpunk.png",
        duration: 155, // 2:35
        playlistId: "pl-cyber",
        liked: false
    },
    {
        id: 7,
        title: "Midnight Jazz Cafe",
        artist: "Coffee Shop Club",
        album: "Midnight Jazz Cafe",
        cover: "assets/album_jazz.png",
        duration: 220, // 3:40
        playlistId: "pl-jazz",
        liked: true
    },
    {
        id: 8,
        title: "Afternoon Coffee",
        artist: "Smooth Sax Quartet",
        album: "Midnight Jazz Cafe",
        cover: "assets/album_jazz.png",
        duration: 205, // 3:25
        playlistId: "pl-jazz",
        liked: false
    }
];

// 2. Playback State Control variables
let isPlaying = false;
let currentSong = songs[0]; // Start with first song
let currentTime = 0; // Current progress time in seconds
let volume = 0.7; // 0.0 to 1.0
let isMuted = false;
let previousVolume = 0.7;
let isShuffle = false;
let isRepeat = false;
let playInterval = null;

// 3. Select DOM Elements
const homeNavBtn = document.getElementById('nav-home');
const searchNavBtn = document.getElementById('nav-search');
const homeView = document.getElementById('home-view');
const searchView = document.getElementById('search-view');

const headerSearchBar = document.getElementById('header-search-bar');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search');
const searchDefaultContent = document.getElementById('search-default-content');
const searchResultsContent = document.getElementById('search-results-content');
const topResultCardContainer = document.getElementById('top-result-card-container');
const songsSearchResultsGrid = document.getElementById('songs-search-results');

const recentlyPlayedGrid = document.getElementById('recently-played-grid');
const madeForYouGrid = document.getElementById('made-for-you-grid');

const playerArt = document.getElementById('player-art');
const playerTitle = document.getElementById('player-title');
const playerArtist = document.getElementById('player-artist');
const playerLikeBtn = document.getElementById('player-like');

const playBtn = document.getElementById('player-play');
const prevBtn = document.getElementById('player-prev');
const nextBtn = document.getElementById('player-next');
const shuffleBtn = document.getElementById('player-shuffle');
const repeatBtn = document.getElementById('player-repeat');

const timeCurrentSpan = document.getElementById('time-current');
const timeTotalSpan = document.getElementById('time-total');
const timelineContainer = document.getElementById('timeline-slider-container');
const timelineFill = document.getElementById('timeline-slider-fill');
const timelineThumb = document.getElementById('timeline-slider-thumb');

const volumeBtn = document.getElementById('player-volume-btn');
const volumeContainer = document.getElementById('volume-slider-container');
const volumeFill = document.getElementById('volume-slider-fill');
const volumeThumb = document.getElementById('volume-slider-thumb');

// 4. Initializer function
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Set dynamic greeting text
    setDynamicGreeting();
    
    // Render music grids
    renderMusicGrids();
    
    // Set default song details in player bar
    updatePlayerBarUI();
    
    // Setup tab switching
    setupTabs();
    
    // Setup search logic
    setupSearch();
    
    // Setup player control buttons
    setupPlayerControls();
    
    // Setup custom slider sliders
    setupSliders();

    // Setup sidebar items navigation
    setupSidebarPlaylists();
});

// 5. Dynamic Welcome Greeting based on current hours
function setDynamicGreeting() {
    const hour = new Date().getHours();
    const greetingText = document.getElementById('greeting-text');
    
    if (hour >= 5 && hour < 12) {
        greetingText.textContent = "Good morning";
    } else if (hour >= 12 && hour < 18) {
        greetingText.textContent = "Good afternoon";
    } else {
        greetingText.textContent = "Good evening";
    }
}

// 6. Sidebar tabs toggler
function setupTabs() {
    homeNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        homeNavBtn.classList.add('active');
        searchNavBtn.classList.remove('active');
        homeView.classList.remove('hidden');
        searchView.classList.add('hidden');
        headerSearchBar.classList.add('hidden');
    });

    searchNavBtn.addEventListener('click', (e) => {
        e.preventDefault();
        searchNavBtn.classList.add('active');
        homeNavBtn.classList.remove('active');
        searchView.classList.remove('hidden');
        homeView.classList.add('hidden');
        headerSearchBar.classList.remove('hidden');
        searchInput.focus();
    });
}

// 7. Render dynamic grids
function renderMusicGrids() {
    // Clear first
    recentlyPlayedGrid.innerHTML = "";
    madeForYouGrid.innerHTML = "";

    // Recently Played: songs 1, 3, 5, 7
    const recentlyPlayedSongs = songs.filter(s => [1, 3, 5, 7].includes(s.id));
    recentlyPlayedSongs.forEach(song => {
        const card = createMusicCard(song);
        recentlyPlayedGrid.appendChild(card);
    });

    // Made For You: songs 2, 4, 6, 8
    const madeForYouSongs = songs.filter(s => [2, 4, 6, 8].includes(s.id));
    madeForYouSongs.forEach(song => {
        const card = createMusicCard(song);
        madeForYouGrid.appendChild(card);
    });
}

// Create Card Element
function createMusicCard(song) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'music-card';
    cardDiv.setAttribute('data-id', song.id);
    
    cardDiv.innerHTML = `
        <div class="card-img-container">
            <img src="${song.cover}" alt="${song.title}">
            <button class="card-play-btn" title="Play ${song.title}">
                <i data-lucide="play" fill="black"></i>
            </button>
        </div>
        <h3>${song.title}</h3>
        <p>${song.artist} • ${song.album}</p>
    `;
    
    // Refresh Icons for the dynamically generated button
    lucide.createIcons({
        node: cardDiv
    });
    
    // Play button click on card
    const cardPlayBtn = cardDiv.querySelector('.card-play-btn');
    cardPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop navigation click
        loadSong(song);
        playSong();
    });

    // Main Card click plays/selects song
    cardDiv.addEventListener('click', () => {
        loadSong(song);
        playSong();
    });

    return cardDiv;
}

// 8. Search Functionality
function setupSearch() {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        
        if (query === "") {
            clearSearchBtn.classList.add('hidden');
            searchDefaultContent.classList.remove('hidden');
            searchResultsContent.classList.add('hidden');
            return;
        }

        clearSearchBtn.classList.remove('hidden');
        searchDefaultContent.classList.add('hidden');
        searchResultsContent.classList.remove('hidden');

        // Filter Songs
        const filteredSongs = songs.filter(song => 
            song.title.toLowerCase().includes(query) || 
            song.artist.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query)
        );

        renderSearchResults(filteredSongs, query);
    });

    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = "";
        clearSearchBtn.classList.add('hidden');
        searchDefaultContent.classList.remove('hidden');
        searchResultsContent.classList.add('hidden');
    });
}

// Render filtered search results in UI
function renderSearchResults(filtered, query) {
    songsSearchResultsGrid.innerHTML = "";
    topResultCardContainer.innerHTML = "";

    if (filtered.length === 0) {
        songsSearchResultsGrid.innerHTML = `<div style="color: var(--text-muted); padding: 16px;">No songs found matching "${query}"</div>`;
        topResultCardContainer.innerHTML = `<div style="color: var(--text-muted); padding: 16px;">No results found</div>`;
        return;
    }

    // Top Result: first match
    const topSong = filtered[0];
    topResultCardContainer.innerHTML = `
        <img src="${topSong.cover}" alt="${topSong.title}">
        <h3>${topSong.title}</h3>
        <div class="top-result-meta">
            <span class="top-result-badge">Song</span>
            <span>•</span>
            <span>${topSong.artist}</span>
        </div>
        <button class="card-play-btn" title="Play ${topSong.title}">
            <i data-lucide="play" fill="black"></i>
        </button>
    `;
    
    // Add click handler to top result
    topResultCardContainer.addEventListener('click', () => {
        loadSong(topSong);
        playSong();
    });
    topResultCardContainer.querySelector('.card-play-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        loadSong(topSong);
        playSong();
    });

    // Populate songs list (up to 4 songs)
    const displayList = filtered.slice(0, 4);
    displayList.forEach(song => {
        const row = document.createElement('div');
        row.className = `song-row ${currentSong.id === song.id ? 'playing-row' : ''}`;
        
        row.innerHTML = `
            <div class="song-left-info">
                <div class="row-art-container">
                    <img src="${song.cover}" alt="${song.title}">
                    <div class="row-play-overlay">
                        <i data-lucide="${isPlaying && currentSong.id === song.id ? 'pause' : 'play'}"></i>
                    </div>
                </div>
                <div class="song-title-artist">
                    <span class="song-row-title ${currentSong.id === song.id ? 'active-song-green' : ''}">${song.title}</span>
                    <span class="song-row-artist">${song.artist}</span>
                </div>
            </div>
            <div class="song-right-info">
                <button class="song-row-heart ${song.liked ? 'liked-active' : ''}">
                    <i data-lucide="heart" ${song.liked ? 'fill="currentColor"' : ''}></i>
                </button>
                <span class="song-row-duration">${formatTime(song.duration)}</span>
            </div>
        `;

        row.addEventListener('click', () => {
            if (currentSong.id === song.id) {
                togglePlay();
            } else {
                loadSong(song);
                playSong();
            }
        });

        // Like button toggle within rows
        const heartBtn = row.querySelector('.song-row-heart');
        heartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            song.liked = !song.liked;
            heartBtn.classList.toggle('liked-active');
            
            // Sync with current song if active
            if (currentSong.id === song.id) {
                currentSong.liked = song.liked;
                updateLikeButtonState();
            }

            // Redraw row to refresh SVG properties
            renderSearchResults(filtered, query);
        });

        songsSearchResultsGrid.appendChild(row);
    });

    // Render Lucide icons for generated elements
    lucide.createIcons({
        node: searchResultsContent
    });
}

// Helper: Format Seconds to MM:SS
function formatTime(secs) {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// 9. Load Song details into playback bar
function loadSong(song) {
    currentSong = song;
    currentTime = 0;
    
    // Update player controls interface
    updatePlayerBarUI();
}

function updatePlayerBarUI() {
    playerArt.src = currentSong.cover;
    playerTitle.textContent = currentSong.title;
    playerArtist.textContent = currentSong.artist;
    
    timeCurrentSpan.textContent = "0:00";
    timeTotalSpan.textContent = formatTime(currentSong.duration);
    
    updateLikeButtonState();
    updateProgressBarUI();
}

function updateLikeButtonState() {
    if (currentSong.liked) {
        playerLikeBtn.classList.add('liked');
        playerLikeBtn.innerHTML = `<i data-lucide="heart" fill="currentColor"></i>`;
    } else {
        playerLikeBtn.classList.remove('liked');
        playerLikeBtn.innerHTML = `<i data-lucide="heart"></i>`;
    }
    lucide.createIcons({
        node: playerLikeBtn
    });
}

// 10. Core Player controls setup
function setupPlayerControls() {
    // Play/Pause Action
    playBtn.addEventListener('click', () => {
        togglePlay();
    });

    // Keyboard space bar action for play/pause
    window.addEventListener('keydown', (e) => {
        if (e.code === "Space" && e.target === document.body) {
            e.preventDefault();
            togglePlay();
        }
    });

    // Heart Action click
    playerLikeBtn.addEventListener('click', () => {
        currentSong.liked = !currentSong.liked;
        // Sync back to database
        const dbSong = songs.find(s => s.id === currentSong.id);
        if (dbSong) dbSong.liked = currentSong.liked;
        updateLikeButtonState();
    });

    // Navigation skips
    nextBtn.addEventListener('click', () => {
        playNextSong();
    });

    prevBtn.addEventListener('click', () => {
        playPrevSong();
    });

    // Shuffle & Repeat toggle states
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    });

    // Volume mute controls
    volumeBtn.addEventListener('click', () => {
        toggleMute();
    });
}

function playSong() {
    isPlaying = true;
    playBtn.innerHTML = `<i data-lucide="pause" fill="black"></i>`;
    lucide.createIcons({ node: playBtn });

    // Sync any playing rows in Search Results
    syncSearchResultsPlayingRows();

    // Start timer simulation
    if (playInterval) clearInterval(playInterval);
    playInterval = setInterval(() => {
        currentTime++;
        if (currentTime >= currentSong.duration) {
            if (isRepeat) {
                currentTime = 0;
                updateProgressBarUI();
            } else {
                playNextSong();
            }
        } else {
            updateProgressBarUI();
        }
    }, 1000);
}

function pauseSong() {
    isPlaying = false;
    playBtn.innerHTML = `<i data-lucide="play" fill="black"></i>`;
    lucide.createIcons({ node: playBtn });
    
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
    
    syncSearchResultsPlayingRows();
}

function togglePlay() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Sync visual rows inside the search view
function syncSearchResultsPlayingRows() {
    const rows = document.querySelectorAll('.song-row');
    rows.forEach(row => {
        const titleSpan = row.querySelector('.song-row-title');
        // Find if this row is the current song
        const isCurrent = titleSpan.textContent === currentSong.title;
        row.classList.toggle('playing-row', isCurrent);
        
        // Update green text active marker
        if (titleSpan) {
            titleSpan.classList.toggle('active-song-green', isCurrent);
        }
        
        // Update play/pause icon in overlay
        const playIcon = row.querySelector('.row-play-overlay i');
        if (playIcon) {
            const desiredIcon = isPlaying && isCurrent ? 'pause' : 'play';
            playIcon.setAttribute('data-lucide', desiredIcon);
        }
    });
    
    // Re-render icons on rows
    const searchLayout = document.getElementById('search-results-content');
    if (searchLayout && !searchLayout.classList.contains('hidden')) {
        lucide.createIcons({ node: searchLayout });
    }
}

function playNextSong() {
    let nextIndex = 0;
    
    if (isShuffle) {
        nextIndex = Math.floor(Math.random() * songs.length);
    } else {
        const currentIndex = songs.findIndex(s => s.id === currentSong.id);
        nextIndex = (currentIndex + 1) % songs.length;
    }
    
    loadSong(songs[nextIndex]);
    playSong();
}

function playPrevSong() {
    let prevIndex = 0;
    
    if (currentTime > 3) {
        // Restart song if played > 3s
        currentTime = 0;
        updateProgressBarUI();
        return;
    }

    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    
    loadSong(songs[prevIndex]);
    playSong();
}

// 11. Custom Progress Slider Scrubbing / Interaction
function setupSliders() {
    // Timeline slider click/drag handler
    timelineContainer.addEventListener('mousedown', (e) => {
        handleSliderDrag(e, timelineContainer, (percentage) => {
            currentTime = Math.floor(percentage * currentSong.duration);
            updateProgressBarUI();
        });
    });

    // Volume slider click/drag handler
    volumeContainer.addEventListener('mousedown', (e) => {
        handleSliderDrag(e, volumeContainer, (percentage) => {
            volume = percentage;
            isMuted = false;
            updateVolumeUI();
        });
    });
}

function handleSliderDrag(mouseDownEvent, container, updateCallback) {
    function processPosition(e) {
        const rect = container.getBoundingClientRect();
        let percentage = (e.clientX - rect.left) / rect.width;
        percentage = Math.max(0, Math.min(1, percentage));
        updateCallback(percentage);
    }

    // Process initial click position
    processPosition(mouseDownEvent);

    // Bind move and release actions
    function onMouseMove(e) {
        processPosition(e);
    }

    function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
}

function updateProgressBarUI() {
    const percent = (currentTime / currentSong.duration) * 100;
    timelineFill.style.width = `${percent}%`;
    timelineThumb.style.left = `${percent}%`;
    timeCurrentSpan.textContent = formatTime(currentTime);
}

function updateVolumeUI() {
    const percent = volume * 100;
    volumeFill.style.width = `${percent}%`;
    volumeThumb.style.left = `${percent}%`;
    
    // Choose correct volume icon
    let iconName = 'volume-2'; // full volume
    if (volume === 0 || isMuted) {
        iconName = 'volume-x';
    } else if (volume < 0.3) {
        iconName = 'volume';
    } else if (volume < 0.7) {
        iconName = 'volume-1';
    }
    
    volumeBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
    lucide.createIcons({ node: volumeBtn });
}

function toggleMute() {
    if (isMuted) {
        volume = previousVolume;
        isMuted = false;
    } else {
        previousVolume = volume;
        volume = 0;
        isMuted = true;
    }
    updateVolumeUI();
}

// 12. Connect sidebar playlists clicks to load custom content
function setupSidebarPlaylists() {
    const sidebarPlaylistItems = document.querySelectorAll('.playlist-item');
    
    sidebarPlaylistItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active style from all playlists
            sidebarPlaylistItems.forEach(i => i.classList.remove('active-playlist'));
            item.classList.add('active-playlist');
            
            // Navigate to Home Tab
            homeNavBtn.click();

            const playlistId = item.getAttribute('data-id');
            if (playlistId === "pl-liked") {
                // Find first liked song
                const liked = songs.find(s => s.liked);
                if (liked) {
                    loadSong(liked);
                    playSong();
                }
            } else {
                // Find first song matching playlistId
                const song = songs.find(s => s.playlistId === playlistId);
                if (song) {
                    loadSong(song);
                    playSong();
                }
            }
        });
    });
}
