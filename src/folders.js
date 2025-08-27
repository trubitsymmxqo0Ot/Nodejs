const path = require("path");
const fs = require("fs");
const count = 1;

if (count === 2) {
  /*
		Рекурсивно создаем вложенные папки, ограничений на создание нет.
		Но тут проблема в том, что мы делаем метод синхронным (из-за ключевого слова Sync),
		что значит, что код ниже просто заблокируется и не будет выполнен, пока этот
		код не отработает.
	*/
  fs.mkdirSync(path.resolve(__dirname, "root", "src"), { recursive: true });

  /*
		Теперь уже мы используем ассинхронный метод, который будет выполняться не в главном
		потоке. Этот метод принимает в себя 2 обязательных значения: путь и callback
	*/
  fs.mkdir(path.resolve(__dirname, "root2"), (error) => {
    if (error) {
      console.log("Произошла ошибка");
      return;
    }
    console.log("Папка успешно создана");
  });

  //Также, мы можем синхронно и асинхронно удалять папки:

  fs.rmdir(path.resolve(__dirname, "root2"), (error) => {
    if (error) {
      console.log("При удалении произошла ошибка");
      return;
    }
    console.log("Папка успешно удалена");
  });

  fs.rmdirSync(path.resolve(__dirname, "root", "src"), { recursive: true });

  //Можем создать и записать файл
  //Важно, что этот метод именно перезапишет файл на то содержимое, которое мы указали
  fs.writeFile(
    path.resolve(__dirname, "test.txt"),
    "5 empty 2 3 4",
    (error) => {
      if (error) {
        console.log("Создать файл не удалось");
        return;
      }
      console.log("Файл создан и записан успешно");
    }
  );

  //Но в конец файла можно и что-то дозаписать:
  fs.appendFile(path.resolve(__dirname, "test.txt"), "new string", (error) => {
    if (error) {
      console.log("Не удалось дозаписать файл");
      retrun;
    }
    console.log("Файл успешно дозаписан");
  });

  /*
	Однако, непонятно в какой последовательности выполнится код. Так как обе функции 
	ассинхронные, есть вероятность того, что в стек попадет сначала функция дозаписи файла,
	а потом уже создания этого файла, что естественно, сломает логику. В таком случае,
	мы можем внутрь callback функции создания файла закинуть всю запись дозаписи файла, но
	из-за этого произойдет ад коллбэков, т.к. вложеность функций может быть слишком 
	большой, в результате чего код станет нечитаемым. Однако, решить это можно. Нужно просто
	эти функции переписать на промисы и есть 2 вариации, более старая и более новая.

	Более новая:
*/

  const fsPromise = require("fs/promises");

  fsPromise
    .mkdir(path.resolve(__dirname, "root3"))
    .then((res) => {
      fsPromise
        .writeFile(path.resolve(__dirname, "root3/test.txt"), "123")
        .then((res) => {
          fsPromise
            .appendFile(path.resolve(__dirname, "root3/test.txt"), "hello")
            .catch((e) => console.log(e));
        })
        .catch((e) => console.log(e));
    })
    .catch((e) => console.log(e));

  //Более старая реализация:

  const writeFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (error) => {
        if (error) {
          return reject(error.message);
        }
        resolve();
      });
    });
  };

  const appendFileAsync = async (path, data) => {
    return new Promise((resolve, reject) => {
      fs.appendFile(path, data, (error) => {
        if (error) {
          return reject(error.message);
        }
        resolve();
      });
    });
  };

  writeFileAsync(path.resolve(__dirname, "writeTest.txt"), "Hello world")
    .then(() =>
      appendFileAsync(
        path.resolve(__dirname, "writeTest.txt"),
        "bye bye Russia"
      )
    )
    .then(() =>
      appendFileAsync(
        path.resolve(__dirname, "writeTest.txt"),
        "hhelo bye Russia"
      )
    )
    .then(() =>
      appendFileAsync(
        path.resolve(__dirname, "writeTest.txt"),
        "bye hello Russia"
      )
    )
    .catch((e) => console.log(e));

  //Мы также можем и считывать файл:

  const readFileAsync = async (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
        //Вторым аргументом указываем кодировку файла
        if (err) {
          return reject(err.message);
        }
        resolve(data); //Это данные, которые мы получим с файла
      });
    });
  };

  readFileAsync(path.resolve(__dirname, "writeTest.txt")).then((response) =>
    console.log(response)
  );

  //Можно удалять файлы

  const rmFileAsync = async (path) => {
    return new Promise((resolve, reject) => {
      fs.rm(path, (e) => {
        if (e) {
          return reject(e.message);
        }
        resolve();
      });
    });
  };
  rmFileAsync(path.resolve(__dirname, "test.tsx"))
    .then(() => console.log("Файл успешо удален"))
    .catch((e) => console.log(e));
}


/*
	Задание: получить из переменной окружения текст, записать его в файл, 
	затем считать этот файл, получить длинну строки и записать в новый файл,
	а старый удалить
*/
const text = process.env.MESSAGE || '';
const writeFileEnv = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (error) => {
      if (error) {
        return reject(error);
      }
      resolve(data);
    });
  });
};

const readAsyncEnv = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (e, data) => {
      if (e) {
        return reject(e);
      }
      resolve(data);
    });
  });
};

const writeNewFileEnv = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, String(data), (e) => {
      if (e) {
        return reject(e);
      }
      return resolve(data);
    });
  });
};

const deleteOldFileEnv = (path) => {
  return new Promise((resolve, reject) => {
    fs.rm(path, (e) => {
      if (e) {
        return reject(e);
      }
      resolve();
    });
  });
};
// writeFileEnv(path.resolve(__dirname, "file.txt"), text)
//   .then((resolve) => console.log(resolve))
//   .catch((e) => console.log(e));
// readAsyncEnv(path.resolve(__dirname, "file.txt"))
//   .then((response) =>
//     writeNewFileEnv(path.resolve(__dirname, "newFile.txt"), response.length)
//       .then(() => deleteOldFileEnv(path.resolve(__dirname, "file.txt")))
//       .catch((e) => console.log(e))
//   )
//   .catch((e) => console.log(e));
// Это и будет ад callback, перепишем правильно

writeFileEnv(path.resolve(__dirname, "file.txt"), text)
.then(() => readAsyncEnv(path.resolve(__dirname, "file.txt")))
.then(data => data.length)
.then((count) => writeFileEnv(path.resolve(__dirname, 'newFile.txt'), String(count)))
.then(() => deleteOldFileEnv(path.resolve(__dirname, "file.txt")))
.catch(e => console.log(e));