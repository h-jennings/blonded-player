const axios = require('axios');
const btoa = require('btoa');


const { API_CLIENT_ID, API_CLIENT_SECRET } = process.env;


const encoded = btoa(API_CLIENT_ID + ':' + API_CLIENT_SECRET);


exports.handler = function(event, context, callback) {
      
      // Getting the Access Token 
      const getToken = () => {
        axios({
          url: 'https://accounts.spotify.com/api/token',
          method: 'post',
          headers: {
            "Accept": "application/json", 
            "Authorization": 'Basic ' + encoded,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          data:"grant_type=client_credentials"
        })
          .then(token => {

            const accessToken = token.data.access_token;
            

            console.log('Success! Here is the token: ', accessToken);
            // Success! Now we want to return the response with a status code of 200


            axios.get('https://api.spotify.com/v1/albums/3mH6qwIy9crq0I9YQbOuDf/tracks?market=US', {
              headers: {
                'Authorization': 'Bearer ' + accessToken
              }
            })
              .then(tracks => {
                // Album tracks have be received from the API
                console.log('Here are the requested tracks: ', tracks.data);

                return callback(null, {
                  statusCode: 200,
                  headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers':
                      'Origin, X-Requested-With, Content-Type, Accept'
                  },
                  body: JSON.stringify(tracks.data)
                })

              })
              .catch(error => {
                console.log('Error', error);

                // Something went wrong when fetching the tracks from the API

                return callback(null, {
                  statusCode: 400,
                  body: JSON.stringify(error)
                })
              })

          })
          .catch(error => {
            console.log('Error', error);
            // Something went wrong need to return a status code of 400
            return callback(null, {
              statusCode: 400,
              body: JSON.stringify(error)
            })
          })
      }

      // Make sure method is POST
      if (event.httpMethod == 'GET') {
        // Run
        getToken();
      };

  };