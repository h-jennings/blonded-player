const getTracks = async () => await ( await fetch('http://localhost:9000/getTracks')).json();

getTracks()
  .then(album => {
    const tracks = album.items;

    const trackPreviews = [];

    tracks.forEach(trackPrev => trackPreviews.push({name: trackPrev.name, preview: trackPrev.preview_url}));
    
    const ul = document.querySelector('#trackList');

    if (!ul.firstChild) {
      trackPreviews.forEach(trackName => {
  
        const li = document.createElement('li');
  
        li.setAttribute('class', 'track');
  
        const trackText = document.createTextNode(trackName.name);
  
        li.appendChild(trackText);
  
        ul.appendChild(li);
        
      })
    }


  });