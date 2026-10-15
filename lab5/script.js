const FORM_ROWS = [1, 5, 6, 7, 8];

// Перевірка, що дата існує і не з майбутнього
function isRealDate(s) {
  const [d, m, y] = s.split('.').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d && dt <= new Date();
}

// Рядки таблиці 2 та регулярні вирази (Т — текст, Ч — число)
const FIELDS = {
  1: { label: 'ПІБ', placeholder: 'Іваненко І.І.',
       hint: 'ТТТТТТ Т.Т. (напр. Іваненко І.І.)',
       regex: /^[А-ЯІЇЄҐ][А-ЯІЇЄҐа-яіїєґ'’ʼ-]+\s[А-ЯІЇЄҐ]\.[А-ЯІЇЄҐ]\.$/ },
  5: { label: 'ID-card', placeholder: 'АВ №123456',
       hint: 'ТТ №ЧЧЧЧЧЧ (напр. АВ №123456)',
       regex: /^[A-Za-zА-ЯІЇЄҐа-яіїєґ]{2}\s№\d{6}$/ },
  6: { label: 'Факультет', placeholder: 'ФІОТ',
       hint: 'ТТТТ (рівно 4 літери)',
       regex: /^[A-Za-zА-ЯІЇЄҐа-яіїєґ]{4}$/ },
  7: { label: 'Дата народж.', placeholder: '25.03.2005',
       hint: 'ЧЧ.ЧЧ.ЧЧЧЧ (існуюча дата, напр. 25.03.2005)',
       regex: /^(0[1-9]|[12]\d|3[01])\.(0[1-9]|1[0-2])\.(19|20)\d{2}$/,
       check: isRealDate },
  8: { label: 'Адреса', placeholder: 'м. Київ',
       hint: 'м. Назва міста (напр. м. Київ)',
       regex: /^м\.\s[А-ЯІЇЄҐ][А-ЯІЇЄҐа-яіїєґ'’ʼ-]*(?:\s[А-ЯІЇЄҐа-яіїєґ'’ʼ-]+)*$/ }
};

const formBody = document.getElementById('formBody');
const regForm = document.getElementById('regForm');
const formStatus = document.getElementById('formStatus');
const dialog = document.getElementById('resultDialog');

function esc(s) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function buildForm() {
  FORM_ROWS.forEach(id => {
    const f = FIELDS[id];
    const tr = document.createElement('tr');
    tr.dataset.id = id;
    tr.innerHTML =
      `<td class="num">${id}<\/td>` +
      `<td class="label"><label for="f${id}">${f.label}<\/label><\/td>` +
      `<td><input type="text" id="f${id}" placeholder="${f.placeholder}" autocomplete="off">` +
      `<div class="msg"><\/div><\/td>`;
    formBody.appendChild(tr);
  });
}

function clearErrors() {
  formBody.querySelectorAll('tr').forEach(tr => {
    tr.classList.remove('error');
    tr.querySelector('.msg').textContent = '';
  });
}

function tableRows(items) {
  return items.map(i =>
    `<tr><td>${i.id}<\/td><td><b>${esc(i.label)}<\/b><\/td><td>${esc(i.value)}<\/td><\/tr>`
  ).join('');
}

// Окреме вікно з результатом; якщо браузер заблокував popup — показуємо діалог на сторінці
function showResult(items) {
  const w = window.open('', 'resultWindow', 'width=520,height=420,resizable=yes,scrollbars=yes');
  if (w) {
    w.document.open();
    w.document.write(
      '<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><title>Введена інформація<\/title>' +
      '<style>body{font-family:system-ui,sans-serif;margin:20px;color:#1f2430}h2{margin-top:0}' +
      'table{border-collapse:collapse;width:100%}td{border:1px solid #c9cfdc;padding:8px 10px}' +
      'td:first-child{width:40px;text-align:center;color:#6b7280}td:nth-child(2){width:140px}<\/style><\/head>' +
      '<body><h2>Введена інформація<\/h2><table>' + tableRows(items) + '<\/table><\/body><\/html>'
    );
    w.document.close();
    w.focus();
  } else {
    document.getElementById('dialogContent').innerHTML = '<table>' + tableRows(items) + '<\/table>';
    dialog.showModal();
  }
}

regForm.addEventListener('submit', e => {
  e.preventDefault();
  const items = [];
  let errors = 0;
  let firstBad = null;

  formBody.querySelectorAll('tr').forEach(tr => {
    const id = tr.dataset.id;
    const f = FIELDS[id];
    const input = tr.querySelector('input');
    const value = input.value.trim();
    const valid = f.regex.test(value) && (!f.check || f.check(value));

    tr.classList.toggle('error', !valid);
    tr.querySelector('.msg').textContent = valid ? '' : 'Невірний формат. Очікується: ' + f.hint;
    if (!valid) { errors++; if (!firstBad) firstBad = input; }
    items.push({ id, label: f.label, value });
  });

  if (errors) {
    formStatus.textContent = `Помилок: ${errors}. Виправте виділені рядки.`;
    formStatus.className = 'bad';
    firstBad.focus();
  } else {
    formStatus.textContent = 'Усі дані введено правильно.';
    formStatus.className = 'good';
    showResult(items);
  }
});

// Прибираємо підсвітку помилки, щойно користувач редагує поле
formBody.addEventListener('input', e => {
  const tr = e.target.closest('tr');
  if (tr) { tr.classList.remove('error'); tr.querySelector('.msg').textContent = ''; }
});

regForm.addEventListener('reset', () => {
  clearErrors();
  formStatus.textContent = '';
  formStatus.className = '';
});

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());

buildForm();

/* ============================================================
   ЗАВДАННЯ 2, варіант 9
   Активна клітинка №9. dblClick: колір клітинок у її стовпці,
   починаючи з обраної, через одну.
   ============================================================ */
const N = 6;
const VARIANT = 9;
const TARGET_R = Math.floor((VARIANT - 1) / N);   // рядок обраної клітинки (з 0)
const TARGET_C = (VARIANT - 1) % N;               // стовпець обраної клітинки (з 0)

const grid = document.getElementById('grid');
const gridInfo = document.getElementById('gridInfo');
const colorPicker = document.getElementById('colorPicker');
const cells = [];   // cells[рядок][стовпець]

// Швидкі кольори поруч із палітрою
['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#34495e']
  .forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.style.background = c;
    b.title = c;
    b.addEventListener('click', () => { colorPicker.value = c; });
    document.getElementById('swatches').appendChild(b);
  });

function textColor(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#111' : '#fff';
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0');
}

function paint(list, color) {
  list.forEach(td => {
    td.style.backgroundColor = color;
    td.style.color = textColor(color);
  });
}

// Клітинки обраного стовпця, починаючи з обраної, через одну
function columnEveryOther() {
  const out = [];
  for (let i = TARGET_R; i < N; i += 2) out.push(cells[i][TARGET_C]);
  return out;
}

function buildGrid() {
  for (let i = 0; i < N; i++) {
    const tr = grid.insertRow();
    cells[i] = [];
    for (let j = 0; j < N; j++) {
      const td = tr.insertCell();
      td.textContent = i * N + j + 1;
      cells[i][j] = td;
    }
  }

  const target = cells[TARGET_R][TARGET_C];
  target.classList.add('target');

  target.addEventListener('mouseenter', () => paint([target], randomColor()));
  target.addEventListener('click', () => paint([target], colorPicker.value));
  target.addEventListener('dblclick', () => paint(columnEveryOther(), colorPicker.value));
}

document.getElementById('resetGrid').addEventListener('click', () => {
  cells.flat().forEach(td => { td.style.backgroundColor = ''; td.style.color = ''; });
});

buildGrid();
