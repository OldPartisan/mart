# Мобильное приложение «Ирбис Март»

## 1. Варианты реализации

| Вариант | Срок до теста | Плюсы | Минусы | Когда выбирать |
|---|---|---|---|---|
| **Capacitor + WebView** (реализовано) | 1–2 дня | Весь сайт сразу, один код, быстрые релизы, нативные splash/icon/status bar | WebView-ощущение, нужен интернет, push/offline требуют плагинов | Быстрый тестовый APK, MVP, внутренние тесты |
| **TWA / Bubblewrap** | 1 день | Маленький APK, Chrome, автоматические обновления | Зависит от Chrome, нужен `assetlinks.json`, нет нативной оболочки | Если нужен «почти PWA» в RuStore |
| **React Native / Expo** | 2–4 недели | Нативный UX, push, offline, камера, биометрия | Нужно переписать экраны и интеграции, два кода | Долгосрочный продукт |
| **Flutter** | 2–4 недели | Быстрый нативный UI, один код iOS/Android | Другая команда/стек, интеграции заново | Если команда знает Dart |
| **PWA** | 2–3 дня | Без магазинов, установка с сайта, SEO | iOS-ограничения, нет APK | Быстрый вход без сторов |

**Рекомендация:** тестовый APK — Capacitor (уже собран); production-приложение — React Native/Expo либо Capacitor с нативными модулями (push, offline-каталог, биометрия, оплата через браузер).

## 2. Реализованный тестовый APK

- Package: `ru.irbis.mart`
- Версия: `1.0.0` (versionCode 1)
- minSdk 23 (Android 6.0), targetSdk 35
- WebView открывает `https://irbis-mart.vercel.app`
- Иконка и splash сгенерированы из брендбука
- Debug-подпись, 4,5 МБ
- SHA-256: `60b35b7deada704f6bcff80b7fdd5b106841c3c78f6f31d11c12d34893252bae`
- Файл: `public/downloads/irbis-mart-1.0.0-debug.apk`
- Скачать: `https://irbis-mart.vercel.app/downloads/irbis-mart-1.0.0-debug.apk`

### Ограничения тестовой сборки

- нужен интернет;
- push-уведомления, offline-каталог, биометрия и нативная оплата не подключены;
- debug-подпись и предупреждение Play Protect;
- не для публикации в сторах.

## 3. Сборка

```bash
cd mobile
pnpm install
pnpm exec cap sync android

# JDK 21 + Android SDK 35
export JAVA_HOME="$HOME/.irbis-mart/android/jdk/Contents/Home"
export ANDROID_HOME="$HOME/.irbis-mart/android/sdk"
cd android
./gradlew assembleDebug
# app/build/outputs/apk/debug/app-debug.apk
```

Release-сборка:

```bash
# создать keystore (хранить вне git!)
keytool -genkeypair -v -keystore irbis-release.keystore -alias irbis \
  -keyalg RSA -keysize 2048 -validity 10000

# android/key.properties
storeFile=../../irbis-release.keystore
storePassword=...
keyAlias=irbis
keyPassword=...

./gradlew assembleRelease
# app/build/outputs/apk/release/app-release.apk
```

## 4. Что добавить до production

1. **Push (FCM)** — статусы заказов, акции, брошенная корзина.
2. **Offline-каталог** — кэш товаров/категорий, очередь заказов.
3. **Deep links** — `/product/:slug`, `/promotions/:slug`, `/order/:id`.
4. **Нативная оплата** — открывать ЮKassa в Custom Tab/браузере, возврат по deep link.
5. **Биометрия** — вход по Face ID/Touch ID, хранение refresh-токена в Keychain/Keystore.
6. **Аналитика** — Firebase Analytics/AppMetrica, события те же, что на сайте.
7. **RuStore/Google Play** — подписанный AAB, политика конфиденциальности, скриншоты, возрастной рейтинг.
8. **Проверка на устройствах** — Android 6/10/13/15, iPhone (если React Native).

## 5. Безопасность

- WebView загружает только HTTPS, `allowMixedContent=false`, debugging выключен.
- `allowNavigation` ограничен доменом приложения и платёжными/картографическими доменами.
- Не логировать токены и персональные данные.
- Для production — certificate pinning и запрет произвольных URL.

## 6. Результат проверки

APK установлен и запущен на эмуляторе **Android 15 (API 35, arm64)**:

- установка через `adb install` — Success;
- приложение открывает главную Vercel-сайта, каталог и мобильное меню;
- splash и иконка отображаются;
- offline-страница настроена через `server.errorPath`.

Скриншот: [mobile-home.jpg](screenshots/mobile-home.jpg).
