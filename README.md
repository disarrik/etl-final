# Про запуск
1. docker compose up airflow-init
2. docker compose up
3. Насроить подключение в postgres и mongo руками в админке
4. Запустить DAG

## Возможные проблемы
Может быть проблема в том что airflow-init перезатрет права на папках на рут, в таком случае в .env надо указать UID своего пользователя в системе