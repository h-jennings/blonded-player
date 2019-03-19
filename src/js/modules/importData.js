export default async function getTracks() {
  return fetch('/.netlify/functions/getTracks').then(response => response.json());
}
