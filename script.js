'use strict';
// Лабораторна робота: об'єкти та масиви JavaScript, варіант №10.
const $ = id => document.getElementById(id);
const safe = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const bookMethods = {
  bookInfo() { return `Назва: ${this.title}, Автор: ${this.author}, Рік видання: ${this.year}, Прочитана: ${this.isRead ? 'Так' : 'Ні'}`; },
  markAsRead() { this.isRead = true; }
};
function createBook(title, author, year, isRead) { return Object.assign(Object.create(bookMethods), {title, author, year, isRead}); }
const book = createBook("Harry Potter and the Sorcerer's Stone", 'J.K. Rowling', 1997, true);
const library = [createBook("Harry Potter and the Sorcerer's Stone", 'J.K. Rowling', 1997, true),createBook('The Hobbit', 'J.R.R. Tolkien', 1937, false),createBook('1984', 'George Orwell', 1949, true)];
// Індивідуальні завдання: середній рік, сортування, пошук та фільтрація.
function displayLibrary() { const result = library.map(item => item.bookInfo()); result.forEach(line => console.log(line)); return result; }
function calculateAverageYear() { return library.length ? library.reduce((sum,item) => sum + item.year,0)/library.length : 0; }
function addBookToLibrary(title,author,year,isRead) { library.push(createBook(title,author,year,isRead)); displayLibrary(); renderBooks(); }
function log(message) { $('log').textContent += '\n' + message; console.log(message); }
function renderDemo() { $('bookDemo').textContent = book.bookInfo(); }
function renderBooks() {
 const query=$('bookSearch').value.toLocaleLowerCase('uk'); const filter=$('bookFilter').value;
 const filtered=library.filter(b => (filter==='all'||(filter==='read'?b.isRead:!b.isRead)) && (b.title.toLocaleLowerCase().includes(query)||b.author.toLocaleLowerCase().includes(query)));
 $('bookList').innerHTML=filtered.length?filtered.map(b=>`<article class="item"><h3>${safe(b.title)}</h3><p>${safe(b.author)} · ${b.year}</p><span class="pill ${b.isRead?'':'pending'}">${b.isRead?'Прочитана':'Не прочитана'}</span><div><button data-book="${library.indexOf(b)}" ${b.isRead?'disabled':''}>${b.isRead?'Прочитано ✓':'Позначити прочитаною'}</button></div></article>`).join(''):'<p>Книг за цим запитом не знайдено.</p>';
 $('bookCount').textContent=library.length; $('readCount').textContent=library.filter(b=>b.isRead).length; $('averageYear').textContent=calculateAverageYear().toFixed(1);
}
$('toggleRead').onclick=()=>{book.isRead=!book.isRead;renderDemo();log('Змінено isRead: '+book.bookInfo());};
$('markRead').onclick=()=>{book.markAsRead();renderDemo();log('markAsRead(): '+book.bookInfo());};
$('showInfo').onclick=()=>{renderDemo();log('bookInfo(): '+book.bookInfo());};
$('bookSearch').oninput=renderBooks;$('bookFilter').onchange=renderBooks;
$('sortBooks').onclick=()=>{library.sort((a,b)=>a.year-b.year);renderBooks();log('sort(): '+library.map(b=>`${b.title} (${b.year})`).join(', '));};
$('findTolkien').onclick=()=>{const b=library.find(b=>b.author==='J.R.R. Tolkien');$('bookNotice').textContent=b?'find(): '+b.bookInfo():'Книгу Толкіна не знайдено';log($('bookNotice').textContent);};
$('bookList').onclick=e=>{const btn=e.target.closest('[data-book]');if(!btn)return;library[Number(btn.dataset.book)].markAsRead();renderBooks();};
$('bookForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;const data=new FormData(f);addBookToLibrary(data.get('title').trim(),data.get('author').trim(),Number(data.get('year')),data.has('isRead'));f.reset();$('bookNotice').textContent='Книгу успішно додано через push()!';};
$('promptBook').onclick=()=>{const title=prompt('Введіть назву книги:');if(title===null)return;const author=prompt('Введіть автора книги:');if(author===null)return;const yearText=prompt('Введіть рік видання:');if(yearText===null)return;const year=Number(yearText);if(!title.trim()||!author.trim()||!Number.isInteger(year)||year<1000||year>2100){alert('Перевірте назву, автора та рік видання.');return;}const isRead=confirm('Чи прочитана книга?');addBookToLibrary(title.trim(),author.trim(),year,isRead);$('bookNotice').textContent='Книгу додано через prompt() і confirm()!';};
// Індивідуальний проєкт №10: колекція відеоігор.
const games=[{title:'Minecraft',platform:'PC',genre:'Пісочниця',year:2011,completed:true},{title:'The Witcher 3',platform:'PC',genre:'RPG',year:2015,completed:false},{title:'God of War',platform:'PlayStation',genre:'Пригоди',year:2018,completed:true},{title:'Hollow Knight',platform:'Nintendo Switch',genre:'Метроїдванія',year:2017,completed:false}];
function renderGames(){const q=$('gameSearch').value.toLocaleLowerCase('uk');const filter=$('gameFilter').value;const sort=$('gameSort').value;let view=games.filter(g=>(filter==='all'||(filter==='completed'?g.completed:!g.completed))&&[g.title,g.platform,g.genre].some(v=>v.toLocaleLowerCase('uk').includes(q)));if(sort==='year')view.sort((a,b)=>a.year-b.year);if(sort==='name')view.sort((a,b)=>a.title.localeCompare(b.title,'uk'));$('gameList').innerHTML=view.length?view.map(g=>`<article class="item"><h3>🎮 ${safe(g.title)}</h3><p>${safe(g.platform)} · ${safe(g.genre)} · ${g.year}</p><span class="pill ${g.completed?'':'pending'}">${g.completed?'Пройдено':'Не пройдено'}</span><div><button data-game="${games.indexOf(g)}">${g.completed?'Позначити не пройденою':'Позначити пройденою'}</button></div></article>`).join(''):'<p>Ігор не знайдено.</p>';$('gameCount').textContent=games.length;$('completedCount').textContent=games.filter(g=>g.completed).length;$('platformCount').textContent=new Set(games.map(g=>g.platform)).size;}
$('gameSearch').oninput=renderGames;$('gameFilter').onchange=renderGames;$('gameSort').onchange=renderGames;
$('gameList').onclick=e=>{const btn=e.target.closest('[data-game]');if(!btn)return;const g=games[Number(btn.dataset.game)];g.completed=!g.completed;renderGames();};
$('gameForm').onsubmit=e=>{e.preventDefault();const f=e.currentTarget;const d=new FormData(f);games.push({title:d.get('title').trim(),platform:d.get('platform').trim(),genre:d.get('genre').trim(),year:Number(d.get('year')),completed:d.has('completed')});f.reset();renderGames();};
$('runExamples').onclick=()=>{$('log').textContent='Демонстрація прикладів з лабораторної роботи:';log('bookInfo(): '+book.bookInfo());log('displayLibrary():\n'+displayLibrary().join('\n'));log('sort() за роком: '+[...library].sort((a,b)=>a.year-b.year).map(b=>b.year+' — '+b.title).join('; '));log('filter() непрочитаних: '+library.filter(b=>!b.isRead).map(b=>b.title).join(', '));const found=library.find(b=>b.author==='J.R.R. Tolkien');log('find() Толкін: '+(found?found.bookInfo():'Не знайдено'));log('calculateAverageYear(): '+calculateAverageYear().toFixed(2));log('markAsRead(): доступний для кожної книги');log('push(): додайте книгу через форму або prompt()');};
$('clearLog').onclick=()=>{$('log').textContent='Журнал очищено.';};
renderDemo();renderBooks();renderGames();
