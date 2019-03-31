import { Howl, Howler } from 'howler';

export default class Player {
  constructor(tracks, svgs) {
    this.tracks = tracks;
    this.svgs = svgs;
    this.index = 0;
    this.timer = document.querySelector('.text--time__elapsed');
    this.mobileTimer = document.querySelector('.m-text--time__elapsed');
    this.trackTitle = document.querySelector('.text--track');
    this.mobileTrackTitle = document.querySelector('.m-text--track');
    this.trackNumber = document.querySelector('.text--track__current');
    this.trackTotalContainer = document.querySelector('.text--track__total');
    this.playBtn = document.querySelector('button.play-button');
    this.playBtnImg = this.playBtn.getElementsByTagName('img').item(0);
    this.previousBtn = document.querySelector('button.seek-button--left');
    this.nextBtn = document.querySelector('button.seek-button--right');
    this.buttons = {
      type: [this.playBtn, this.nextBtn, this.previousBtn],
    };

    /* This function takes in a the seek position
      and formats it into a whole number */
    this.formatTime = (secs) => {
      const minutes = Math.floor(secs / 60) || 0;
      const seconds = (secs - minutes * 60) || 0;
      return `${minutes < 1 ? '00' : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };
    this.initEvents();
    this.updatePlayerContent();
  }

  initEvents() {
    this.clickHandler = (e) => {
      const buttonDataset = e.target.dataset;

      if (buttonDataset.buttontype === 'play'
        || buttonDataset.buttontype === 'pause') {
        if (buttonDataset.buttontype === 'play') {
          this.playTrack(this.index);
          buttonDataset.buttontype = 'pause';
        } else if (buttonDataset.buttontype === 'pause') {
          this.pauseTrack(this.index);
          buttonDataset.buttontype = 'play';
        }
      }
      if (buttonDataset.buttontype === 'next') {
        this.nextTrack(this.index);
      }
      if (buttonDataset.buttontype === 'back') {
        this.prevTrack(this.index);
      }
    };

    this.buttons.type.forEach(button => button.addEventListener('click', this.clickHandler));
  }

  playTrack(index) {
    this.playBtnImg.src = this.svgs['pause-comp'];

    // Instantiates the sound variable which will contain the howl object
    let sound;

    // Grab the specific track to be played from the array
    const data = this.tracks[index];


    /* Checks if the track already is playing/has a howl object created for it
      if not, then in the else statement we start creating one. */

    if (data.howl) {
      // If the track already has a howl object, then we go ahead and set it as the sound variable
      sound = data.howl;
    } else {
      // Create a new howl object for this track
      sound = new Howl({
        src: [data.url],
        format: 'mp3',
        onplay: () => {
          // Start updating the progress of the track.
          this.getTrackPosition();
          // Update the player's display content
          this.updatePlayerContent();
        },
        onend: () => {
          this.playBtn.dataset.buttontype = 'play';
          this.playBtnImg.src = this.svgs.play;
        },
      });

      // Setting the track's howl object as the 'sound' variable
      data.howl = sound;
    }

    // Calls the 'play' method on the howl object
    sound.play();
  }

  pauseTrack(index) {
    // Grab the specific track to be paused from the array
    const sound = this.tracks[index].howl;

    // Calls the pause method on the howler object
    sound.pause();

    // switches the button image to the play svg
    this.playBtnImg.src = this.svgs.play;
  }

  getTrackPosition() {
    const self = this;

    // Get the howl that we're manipulating
    const sound = self.tracks[self.index].howl;

    // Quick check to make sure that we are altering a track that has a howl object
    if (sound === null) { return; }
    // Getting current track progress (in seconds)
    const seek = sound.seek();
    const seekRounded = Math.round(seek);
    this.timer.innerHTML = this.formatTime(seekRounded);
    this.mobileTimer.innerHTML = this.formatTime(seekRounded);

    // This function runs every frame to update the audio track progress
    // and stops running once a track is finished playing
    if (sound.playing()) {
      requestAnimationFrame(this.getTrackPosition.bind(self));
    }
  }

  updatePlayerContent() {
    // Getting the current track that's playing
    const track = this.tracks[this.index];
    const trackCount = this.tracks.length;

    // Getting the DOM element the the title will go into
    this.trackTitle.innerHTML = track.title;
    this.mobileTrackTitle.innerHTML = track.title;

    // Updates the track total with the total amount in the tracks array
    this.trackTotalContainer.innerHTML = `${trackCount <= 10 ? `0${trackCount}` : trackCount}`;

    // Display's the value of the current track
    const trackNumberValue = this.index + 1;
    this.trackNumber.innerHTML = `${trackNumberValue <= 9 ? `0${trackNumberValue}` : trackNumberValue}`;
  }

  nextTrack(index) {
    // Increases the index number by 1
    this.index += 1;

    // Checking to see whether the index number is larger than the track array's length
    if (this.index >= this.tracks.length) {
      // If that's true then we want to reset the player and return
      this.timer.innerHTML = '00:00';
      this.mobileTimer.innerHTML = '00:00';
      this.playBtnImg.src = this.svgs.play;
      this.index = 0;
      this.playBtn.dataset.buttontype = 'play';
      this.tracks[index].howl.stop();
      this.updatePlayerContent();
      return;
    }

    // Updating the player's display content
    this.updatePlayerContent();

    // Checking to see if the howl has already been created
    if (!this.tracks[index].howl === null) {
      // Making sure that the play button state is correct
      this.playBtn.dataset.buttontype = 'play';
      return;
    }

    if (this.tracks[index].howl !== null) {
      // If a track is playing then we want it to stop
      const sound = this.tracks[index].howl;
      sound.stop();
    }

    // Playing the next track in the array
    this.playTrack(this.index);

    // Setting the button state to pause
    this.playBtn.dataset.buttontype = 'pause';
  }

  prevTrack(index) {
    // Checking to see if the howl has already been created
    if (!this.tracks[index].howl) {
      // If not then making sure that the play button state is correct
      // and then returning early
      this.playBtn.dataset.buttontype = 'play';
      return;
    }

    // stopping any sounds that are currently playing
    const sound = this.tracks[index].howl;
    sound.stop();

    // decrease the array index value by 1
    this.index -= 1;

    // Checking to see if the array's value is below 0
    if (this.index <= -1) {
      // If so then we just reset the player
      this.timer.innerHTML = '00:00';
      this.mobileTimer.innerHTML = '00:00';
      this.index = 0;
      this.playBtnImg.src = this.svgs.play;
      this.playBtn.dataset.buttontype = 'play';
      return;
    }

    // Playing then previous track in the array
    this.playTrack(this.index);

    // Setting the button's play state to pause
    this.playBtn.dataset.buttontype = 'pause';
  }
}
