import Player from './modules/musicPlayer';
// eslint-disable-next-line import/no-unresolved
import svgs from '../assets/images/*.svg';
import getTracks from './modules/importData';

getTracks()
  .then((album) => {
    const albumTracks = album.items.map(tracks => ({
      title: tracks.name,
      url: tracks.preview_url,
      howl: null,
    }));
    const musicPlayer = new Player(albumTracks, svgs);
  });
