# Про запуск
1. docker compose up airflow-init
2. docker compose up
3. Насроить подключение в postgres и mongo руками в админке, креды смотреть в docker-compose.yml на контейнерах mongo и data-postgres
4. Запустить DAG

## Возможные проблемы
Может быть проблема в том что airflow-init перезатрет права на папках на рут, в таком случае в .env надо указать UID своего пользователя в системе

## Замечения по формулироваке задания
1. В задаче сказано, что должен быть отдельный этап transform, но тогда был бы необходим механизм переноса данных между узлами, в роли которого обычно служит отдельная БД, но про отдельную БД в задании не сказано. А переносить в XCOM данные между фазами неправильно, так как у него есть ограничение по объему
2. Для удобства миграция и построения витрин сделаны в одном пайплайне, это ничем не отличается по реализации от двух пайплайнов, но удобнее