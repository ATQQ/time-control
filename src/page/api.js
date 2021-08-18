export function getConfig() {
  return fetch('http://localhost:3001/config').then((res) => res.json());
}

export function getEveryDayData() {
  return fetch('http://localhost:3001/json').then((res) => res.json());
}
