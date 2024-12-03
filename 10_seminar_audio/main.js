import { AudioPlayer } from './audio-player.js';

const tracks = [
    {
        title: 'Beethoven-Moonlight-Sonata',
        url: 'media/Beethoven-Moonlight-Sonata.mp3'
    },
    {
        title: 'O Holy Night (Acoustic Version) (Instrumental Version) - Bird Of Figment',
        url: 'media/O Holy Night (Acoustic Version) (Instrumental Version) - Bird Of Figment.mp3'
    },
    {
        title: 'Pachelbel-Canon-in-D-Major',
        url: 'media/Pachelbel-Canon-in-D-Major.mp3'
    },
    {
        title: 'Ravel-Bolero',
        url: 'media/Ravel-Bolero.mp3'
    },
]

const audioPlayer = new AudioPlayer();
audioPlayer.loadTracks(tracks);