export default async function getTracks() {
  return fetch('/.netlify/functions/getTracks').then(response => response.json());
  // For Development
  // return fetch('http://localhost:9000/getTracks').then(response => response.json());
}
