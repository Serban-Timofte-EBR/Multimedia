export class AudioPlayer {
    #audio;
    #ulTracks;
    #btnPlayPause;

    constructor() {
        this.#audio = document.getElementById('audio');
        this.#ulTracks = document.getElementById('ul-tracks');
        this.#btnPlayPause = document.getElementById('btn-play-pause');

        const btnPlayPause = document.getElementById('btn-play-pause');
        const audio = document.querySelector('audio');

        btnPlayPause.addEventListener('click', () => {
            if (audio.paused) {
                audio.play()
                btnPlayPause.textContent = 'Pause'
            } else {
                audio.pause()
                btnPlayPause.textContent = 'Play'
            }
        })

        const spanCurrentTime = document.getElementById('current-time')
        const spanDuration = document.getElementById('duration')

        this.#audio.addEventListener('loadedmetadata', () => {
            spanDuration.textContent = this.#audio.duration.toFixed(2);
        });

        this.#audio.addEventListener('timeupdate', () => {
            spanCurrentTime.textContent = this.#audio.currentTime.toFixed(2);
        });

        this.#audio.src="media/O Holy Night (Acoustic Version) (Instrumental Version) - Bird Of Figment.mp3"
    }

    loadTracks(tracks) {
        this.#ulTracks.replaceChildren();
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.dataset.url = track.url;
            li.addEventListener('click', () => {
                this.#audio.src = li.dataset.url;
                this.#audio.play();
                this.#btnPlayPause.textContent = 'Pause';
            });
            this.#ulTracks.appendChild(li);
        });
    }
}