# Telegram бот по прогнозу погоди - @SmaylukkWeatherBot
[SmaylukkWeatherBot](https://t.me/SmaylukkWeatherBot)

Проба створення телеграм-бота по даним сервісу https://openweathermap.org/ на node.js

## Можливості
* Отримувати тижневий прогноз погоди по місту або за вашою локацією
* Додавати та керувати списком міст для швидкого відстежування 

## Команди
* **Прогноз** - дозволяє отримати прогноз по будь-якому місту
* **Додати місто** - додає місто в БД за користувачем і повертає прогноз погоди
* **Мої міста** - виводить список міст, які збережені користувачем, і дає можливість по ним отримати прогноз
* **Відправити мою локацію** - у випадку, коли сервіс не може знайти місто, є можливість відправити свою локацію і прогноз буде виведено по геокоординатам

## Приклад прогнозу
```
Прогноз погоди  в Київ:
  📅 06.05.2022 - 🌞 14/11°C - чисте небо
  📅 07.05.2022 - ☁️ 16/13°C - хмарно
  📅 08.05.2022 - ☁️ 14/11°C - хмарно
  📅 09.05.2022 - 🌦 13/9°C - легкий дощ
  📅 10.05.2022 - 🌞 13/11°C - чисте небо
  📅 11.05.2022 - ☁️ 17/16°C - хмарно
  📅 12.05.2022 - 🌦 19/16°C - легкий дощ
  📅 13.05.2022 - 🌞 21/20°C - чисте небо 
```

## Стек
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
* ![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)
