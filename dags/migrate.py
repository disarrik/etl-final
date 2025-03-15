from airflow import DAG
from airflow.providers.postgres.hooks.postgres import PostgresHook
from airflow.providers.mongo.hooks.mongo import MongoHook
from airflow.operators.python import PythonOperator
from pymongo import MongoClient
from datetime import datetime
import json
from bson import Decimal128

class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal128):
            return float(obj.to_decimal())
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def clear_all_data():
    postgres_hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = postgres_hook.get_conn()
    cursor = conn.cursor()

    tables = [
        "UserSessions",
        "ProductPriceHistory",
        "EventLogs",
        "SupportTickets",
        "UserRecommendations",
        "ModerationQueue",
        "SearchQueries",
        "UserActivitySummary"
    ]

    for table in tables:
        cursor.execute(f"TRUNCATE TABLE {table};")
        print(f"Table {table} truncated.")

    conn.commit()
    cursor.close()
    conn.close()

def transfer_mongo_to_postgres():
    
    mongo_client = MongoHook(conn = "mongo_default")
    mongo_db = mongo_client.get_conn()["db"] 

    
    postgres_hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = postgres_hook.get_conn()
    cursor = conn.cursor()

    
    mongo_collection = mongo_db["UserSessions"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO UserSessions (session_id, user_id, start_time, end_time, pages_visited, device, actions)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["session_id"],
            doc["user_id"],
            doc["start_time"],
            doc.get("end_time"),
            json.dumps(doc["pages_visited"]),
            json.dumps(doc["device"]),
            json.dumps(doc["actions"])
        ))

    
    mongo_collection = mongo_db["ProductPriceHistory"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO ProductPriceHistory (product_id, price_changes, current_price, currency)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["product_id"],
            json.dumps(doc["price_changes"], cls=MyEncoder),
            MyEncoder().default(doc["current_price"]),  
            doc["currency"]
        ))

    
    mongo_collection = mongo_db["EventLogs"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO EventLogs (event_id, timestamp, event_type, details)
        VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["event_id"],
            doc["timestamp"],
            doc["event_type"],
            json.dumps(doc["details"])
        ))

    
    mongo_collection = mongo_db["SupportTickets"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO SupportTickets (ticket_id, user_id, status, issue_type, messages, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["ticket_id"],
            doc["user_id"],
            doc["status"],
            doc["issue_type"],
            json.dumps(doc["messages"], cls=MyEncoder),
            doc["created_at"],
            doc["updated_at"]
        ))

    
    mongo_collection = mongo_db["UserRecommendations"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO UserRecommendations (user_id, recommended_products, last_updated)
        VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["user_id"],
            json.dumps(doc["recommended_products"]),
            doc["last_updated"]
        ))

    
    mongo_collection = mongo_db["ModerationQueue"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO ModerationQueue (review_id, user_id, product_id, review_text, rating, moderation_status, flags, submitted_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["review_id"],
            doc["user_id"],
            doc["product_id"],
            doc["review_text"],
            doc["rating"],
            doc["moderation_status"],
            json.dumps(doc["flags"]),
            doc["submitted_at"]
        ))

    
    mongo_collection = mongo_db["SearchQueries"]
    mongo_data = list(mongo_collection.find({}))
    for doc in mongo_data:
        insert_query = """
        INSERT INTO SearchQueries (query_id, user_id, query_text, timestamp, filters, results_count)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            doc["query_id"],
            doc["user_id"],
            doc["query_text"],
            doc["timestamp"],
            json.dumps(doc["filters"]),
            doc["results_count"]
        ))

    conn.commit()
    cursor.close()
    conn.close()

def populate_user_activity_summary():
    postgres_hook = PostgresHook(postgres_conn_id="postgres_default")
    conn = postgres_hook.get_conn()
    cursor = conn.cursor()

    insert_query = """
    INSERT INTO UserActivitySummary (user_id, total_sessions, total_support_tickets, total_search_queries, last_session_start, last_support_ticket_created)
    SELECT
        s.user_id,
        COUNT(DISTINCT s.session_id) AS total_sessions,
        COUNT(DISTINCT t.ticket_id) AS total_support_tickets,
        COUNT(DISTINCT q.query_id) AS total_search_queries,
        MAX(s.start_time) AS last_session_start,
        MAX(t.created_at) AS last_support_ticket_created
    FROM
        UserSessions s
    FULL JOIN
        SupportTickets t ON s.user_id = t.user_id
    FULL JOIN
        SearchQueries q ON s.user_id = q.user_id
    GROUP BY
        s.user_id;
    """
    cursor.execute(insert_query)

    conn.commit()
    cursor.close()
    conn.close()

default_args = {
    "owner": "airflow",
    "start_date": datetime(2025, 1, 1),
    "retries": 1,
}

with DAG(
    "mongo_to_postgres_transfer",
    default_args=default_args,
    schedule_interval="@daily",  
    catchup=False,  
) as dag:
    clear_all_data_task = PythonOperator(
        task_id="clear_all_data",
        python_callable=clear_all_data,
    )
    transfer_task = PythonOperator(
        task_id="transfer_mongo_to_postgres",
        python_callable=transfer_mongo_to_postgres,
    )
    build_view = PythonOperator(
        task_id="populate_user_activity_summary",
        python_callable=populate_user_activity_summary,
    )


    clear_all_data_task >> transfer_task >> build_view