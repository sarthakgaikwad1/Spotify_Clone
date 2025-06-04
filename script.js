const audio = new Audio(); // Initialize audio object
const playBtn = document.querySelector(".player-controls img:nth-child(3)"); // Play/Pause button
const nextBtn = document.querySelector(".player-controls img:nth-child(4)"); // Next button
const muteBtn = document.querySelector(".mute-btn"); // Mute button
const speedControl = document.querySelector(".speed-control"); // Speed dropdown
const loopBtn = document.querySelector(".loop-btn"); // Loop button
const shuffleBtn = document.querySelector(".shuffle-btn"); // Shuffle button
const volumeSlider = document.querySelector(".volume-slider"); // Volume slider
const currentTimeDisplay = document.querySelector(".current-time"); // Current time display
const totalTimeDisplay = document.querySelector(".total-time"); // Total duration display
const selectPartBtn = document.querySelector(".select-part-btn"); // Button to select song part
const progressBar = document.querySelector(".progress-bar"); // Progress bar

// Playlist
const playlist = [
    "assets/Happy Music.mp3",
    "assets/Saajan Ve_Song.mp3",
    "assets/Gulabi Sadi_Song.mp3",
    "assets/Malang Sajna_Song.mp3"
];

let currentSongIndex = 0;
let isPlaying = false;
let startTime = 0;
let endTime = 0;
let playingSelectedPart = false;

audio.src = playlist[currentSongIndex];

// Update total duration when metadata is loaded
audio.addEventListener("loadedmetadata", () => {
    totalTimeDisplay.textContent = formatTime(audio.duration || 0);
});


// Update progress bar and current time
audio.addEventListener("timeupdate", () => {
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    if (playingSelectedPart && audio.currentTime >= endTime) {
        audio.pause();
        playingSelectedPart = false;
        isPlaying = false;
        playBtn.src = "assets/player_icon3.png";
    }
});

// Play/Pause button functionality
playBtn.addEventListener("click", () => {
    if (isPlaying) {
        audio.pause();
        playBtn.src = "assets/player_icon3.png";
    } else {
        audio.play().catch(err => console.log("Autoplay blocked:", err));
        playBtn.src = "assets/pause_icon.webp";
    }
    isPlaying = !isPlaying;
});

// Next button functionality
nextBtn.addEventListener("click", () => {
    playNextSong();
});

// Volume control
volumeSlider.addEventListener("input", () => {
    audio.volume = volumeSlider.value;
});

// Mute button functionality
muteBtn.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteBtn.innerHTML = audio.muted ? "🔈" : "🔊";
});

// Speed control functionality
speedControl.addEventListener("change", () => {
    audio.playbackRate = speedControl.value;
});

// Loop button functionality
loopBtn.addEventListener("click", () => {
    audio.loop = !audio.loop;
    loopBtn.classList.toggle("active-loop", audio.loop);
});

// Shuffle button functionality
shuffleBtn.addEventListener("click", () => {
    let randomSongIndex;
    do {
        randomSongIndex = Math.floor(Math.random() * playlist.length);
    } while (randomSongIndex === currentSongIndex);
    currentSongIndex = randomSongIndex;
    playCurrentSong();
});

// Select part of a song functionality
selectPartBtn.addEventListener("click", () => {
    startTime = 30;
    endTime = 60;
    audio.currentTime = startTime;
    playingSelectedPart = true;
    audio.play();
    isPlaying = true;
    playBtn.src = "assets/pause_icon.webp";
});

// Progress bar control
progressBar.addEventListener("input", () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// Play next song when current song ends
audio.addEventListener("ended", () => {
    if (!audio.loop) playNextSong();
});

// Function to play the next song
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    playCurrentSong();
}

// Function to play the current song
function playCurrentSong() {
    audio.src = playlist[currentSongIndex];
    audio.load(); // Load new song
    audio.play().catch(err => console.log("Autoplay blocked:", err));
    isPlaying = true;
    playingSelectedPart = false;
    playBtn.src = "assets/pause_icon.webp";
}

// Function to format time
function formatTime(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

