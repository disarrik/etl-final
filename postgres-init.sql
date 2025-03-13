-- 1. Таблица UserSessions (сессии пользователей)
CREATE TABLE UserSessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    pages_visited TEXT, -- Массив посещённых страниц
    device JSONB, -- Информация об устройстве (JSON)
    actions TEXT -- Массив действий пользователя
);

-- 2. Таблица ProductPriceHistory (история изменения цен)
CREATE TABLE ProductPriceHistory (
    product_id TEXT PRIMARY KEY,
    price_changes JSONB, -- Массив изменений цен с датами
    current_price NUMERIC(10, 2) NOT NULL, -- Текущая цена
    currency TEXT NOT NULL -- Валюта
);

-- 3. Таблица EventLogs (логи событий)
CREATE TABLE EventLogs (
    event_id TEXT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    event_type TEXT NOT NULL,
    details JSONB -- Подробности (JSON)
);

-- 4. Таблица SupportTickets (обращения в поддержку)
CREATE TABLE SupportTickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    messages JSONB, -- Массив сообщений (JSON)
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- 5. Таблица UserRecommendations (рекомендации пользователям)
CREATE TABLE UserRecommendations (
    user_id TEXT PRIMARY KEY,
    recommended_products TEXT, -- Массив рекомендованных товаров
    last_updated TIMESTAMP NOT NULL
);

-- 6. Таблица ModerationQueue (очередь модерации отзывов)
CREATE TABLE ModerationQueue (
    review_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL,
    moderation_status TEXT NOT NULL,
    flags TEXT, -- Массив флагов
    submitted_at TIMESTAMP NOT NULL
);

-- 7. Таблица SearchQueries (поисковые запросы)
CREATE TABLE SearchQueries (
    query_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    filters JSONB, -- Применённые фильтры (JSON)
    results_count INT NOT NULL -- Количество найденных результатов
);