export default async function getTracks() {
  // return fetch('/.netlify/functions/getTracks').then(response => response.json());
  // ! Change back to netlify function after development
  return fetch('http://localhost:9000/getTracks').then(response => response.json());
}
