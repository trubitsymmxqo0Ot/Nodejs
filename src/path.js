const path = require('path');

//Склеивает строки, будет first/second/thid, можем использовать для путей к файлам или путей сайта браузера
console.log(path.join('first', 'second', 'third')); 
/*
	Конечно, мы можем скледить строку и самостоятельно, даже если пути будут динамичными,
	то можем прокинуть какую-либо переменную, которая динамически изменяет свое содержимое,
	но проблема в том, что на разных операционных системах пути могут быть разными. 
	Условно на windows это /, на linux это \, path.join гарантирует нам, что даже
	если на OC пути пишутся по-разному, файл все равно исполнится и все будет работать
	корректно.
*/

//Строка, которая содержит путь к текущему файлу: C:\Users\****\****\****\Nodejs\src\
console.log(path.join(__dirname)); 

//Если надо вернуться на 1 уровень вложенности назад, то можно сделать так:
console.log(path.join("Отошли чуть назад ", __dirname, '..', '..'));

/*
	Также, есть возможность получить абсолютные пути. Однако, нужно точно знать как это
	работает, т.к. можно получить совершенно неожиданное поведение. Например:
*/
//Получили путь: C:\Users\***\***\***\Nodejs\first\second
console.log(path.resolve('first', 'second'));

//Получили путь: C:\first\second
console.log('новый путь ', path.resolve('/first', 'second'));

//Получили путь: C:\second
console.log('новый новый путь ', path.resolve('first', '/second'));

//Также, мы можем и парсить пути:
const fullName = path.resolve(__dirname, 'first', 'second')
console.log('парсинг ', path.parse(fullName)); //Получим объект, где все записи разбились на пары

console.log('разделитель ', path.sep); //Получили разделитель, который применяется в OC (/)

console.log('Проверка на абсолютный путь ', path.isAbsolute('first/second')); //Получили булевое значение

console.log('Название файла', path.basename(fullName)); //В нашем случае получили second

console.log('Расширение файла', path.extname(fullName)); //В нашем случае не получили ничего, т.к. расширение не указывалось

const siteUrl = 'http://localhost:8080/users?id=5123';

const url = new URL(siteUrl);
console.log(url); //Точно также распарсили строку как и при path.parse(siteUrl)