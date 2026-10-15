const API_URL = 'https://randomuser.me/api/';

const ROWS = [
  { n: 1, key: 'picture' },
  { n: 4, key: 'city' },
  { n: 2, key: 'name' },
  { n: 3, key: 'cell' },
  { n: 8, key: 'phone' }
];

const photo = document.getElementById('photo');
const info = document.getElementById('info');
const statusEl = document.getElementById('status');
const reloadBtn = document.getElementById('reload');

// Дістає з відповіді API лише потрібні поля
function pickFields(user) {
  return {
    picture: user.picture.large,
    city: user.location.city,
    name: `${user.name.title} ${user.name.first} ${user.name.last}`,
    cell: user.cell,
    phone: user.phone
  };
}

function setStatus(text, isError) {
  statusEl.textContent = text;
  statusEl.className = isError ? 'error' : '';
}

function render(data) {
  photo.src = data.picture;
  info.textContent = '';
  ROWS.forEach(row => {
    const tr = info.insertRow();
    tr.insertCell().textContent = row.n;
    tr.insertCell().textContent = row.key;
    tr.insertCell().textContent = row.key === 'picture' ? data.picture : data[row.key];
    tr.cells[0].className = 'num';
    tr.cells[1].className = 'key';
  });
}

// Запит через fetch + Promise
function loadUser() {
  reloadBtn.disabled = true;
  setStatus('Завантаження…', false);

  return fetch(API_URL)
    .then(response => {
      if (!response.ok) {
        throw new Error('Сервер відповів зі статусом ' + response.status);
      }
      return response.json();            // розбір JSON (теж повертає Promise)
    })
    .then(json => {
      if (!json.results || !json.results.length) {
        throw new Error('У відповіді немає даних');
      }
      const data = pickFields(json.results[0]);
      console.log('Отримані дані:', data);
      render(data);
      setStatus('Дані отримано', false);
    })
    .catch(error => {
      console.error(error);
      setStatus('Помилка: ' + error.message, true);
    })
    .finally(() => {
      reloadBtn.disabled = false;
    });
}

reloadBtn.addEventListener('click', loadUser);
loadUser();