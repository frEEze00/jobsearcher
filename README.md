# Jobsearcher (ФСП)

Цифровая платформа подбора ИТ-специалистов с обратной механикой: кандидат проходит опрос и тест, получает категорию; работодатель ищет по категориям и сам направляет приглашение.

## Запуск на Windows (PowerShell)

Нужны Docker Desktop и Node.js. Команды ниже запускают backend с PostgreSQL в Docker и два кабинета через Vite. Keycloak для локального запуска не нужен.

**Терминал 1 — backend и база**, из корня репозитория:

```powershell
if (!(Test-Path .env)) { Copy-Item .env.example .env }
docker compose up -d --build
Invoke-RestMethod http://localhost:8080/actuator/health
```

Дождитесь ответа `status: UP` перед открытием кабинетов. Если backend ещё запускается, интерфейс покажет предупреждение; после запуска нажмите «Проверить снова».

**Терминал 2 — кабинет работника**, из корня репозитория:

```powershell
cd frontend
if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
npm ci
npm run dev:candidate
```

**Терминал 3 — кабинет работодателя**, из корня репозитория:

```powershell
cd frontend
npm run dev:employer
```

Открыть: работник — http://localhost:5173/, работодатель — http://localhost:5174/, Swagger — http://localhost:8080/swagger-ui.html. Логин не требуется. Ключи `OLLAMA_API_KEY` и `INFERECO_API_KEY` в `.env` нужны только для функций LLM.

**Остановка:** нажмите `Ctrl+C` в терминалах 2 и 3, затем из корня репозитория выполните:

```powershell
docker compose down
```

Данные PostgreSQL остаются в Docker volume. Контейнерная база не занимает порт 5432 на Windows.

## Контракт для фронтенда

Фронтенд с двумя кабинетами находится в [`frontend/`](frontend/README.md).

Полный контракт: [docs/FRONTEND.md](docs/FRONTEND.md)  
OpenAPI: `/v3/api-docs`  
Базовый URL API: `/api/v1`

### Локальный вход

Локальный запуск не требует логина и Keycloak. Кабинеты автоматически используют демо-пользователей через заголовки `X-User-Email` и `X-User-Role`. Роль можно сменить в меню пользователя.

### Главный пользовательский сценарий

1. Кандидат: согласия 152-ФЗ → профиль → анкета `IT_CANDIDATE` → тест → категория → publish
2. Работодатель: профиль компании → потребность (salary from/to обязательны) → matching → invitation
3. Кандидат: accept/decline; контакты кандидата видны работодателю только после `ACCEPTED`

### Ошибки

```json
{ "code": "JS_00X", "message": "...", "timestamp": "..." }
```

## Документация (п. 3.4 ТЗ)

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- [docs/TESTING_MECHANICS.md](docs/TESTING_MECHANICS.md)
- [docs/MATCHING.md](docs/MATCHING.md)
- [docs/VALIDATION.md](docs/VALIDATION.md)
- [docs/FSP_INTEGRATION.md](docs/FSP_INTEGRATION.md)
- [docs/API.md](docs/API.md)
- [docs/DEPLOY.md](docs/DEPLOY.md)
- [docs/LIBRARIES.md](docs/LIBRARIES.md)
- [docs/FRONTEND.md](docs/FRONTEND.md)
- [docs/COMPETITOR_BACKLOG.md](docs/COMPETITOR_BACKLOG.md) - идеи с чужих решений (без копирования кода)

## Стек

Java 21, Spring Boot 3.4, PostgreSQL, Flyway, Keycloak, springdoc OpenAPI, Docker Compose, Ollama + Infereco LLM.
