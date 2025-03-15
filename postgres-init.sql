
CREATE TABLE UserSessions (
    session_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    pages_visited TEXT, 
    device JSONB, 
    actions TEXT 
);


CREATE TABLE ProductPriceHistory (
    product_id TEXT PRIMARY KEY,
    price_changes JSONB, 
    current_price NUMERIC(10, 2) NOT NULL, 
    currency TEXT NOT NULL 
);


CREATE TABLE EventLogs (
    event_id TEXT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    event_type TEXT NOT NULL,
    details JSONB 
);


CREATE TABLE SupportTickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    status TEXT NOT NULL,
    issue_type TEXT NOT NULL,
    messages JSONB, 
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);


CREATE TABLE UserRecommendations (
    user_id TEXT PRIMARY KEY,
    recommended_products TEXT, 
    last_updated TIMESTAMP NOT NULL
);


CREATE TABLE ModerationQueue (
    review_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    review_text TEXT NOT NULL,
    rating INT NOT NULL,
    moderation_status TEXT NOT NULL,
    flags TEXT, 
    submitted_at TIMESTAMP NOT NULL
);


CREATE TABLE SearchQueries (
    query_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    query_text TEXT NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    filters JSONB, 
    results_count INT NOT NULL 
);

CREATE TABLE UserActivitySummary (
    user_id TEXT PRIMARY KEY,  
    total_sessions INT,        
    total_support_tickets INT, 
    total_search_queries INT,  
    last_session_start TIMESTAMP,  
    last_support_ticket_created TIMESTAMP  
);

CREATE TABLE ProductSummary (
    product_id TEXT PRIMARY KEY,
    price_changes_count INT,
    min_price NUMERIC(10, 2),
    max_price NUMERIC(10, 2),
    avg_price NUMERIC(10, 2)
);