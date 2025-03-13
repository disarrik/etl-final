db.createCollection("UserSessions", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["session_id", "user_id", "start_time"],
        properties: {
          session_id: { bsonType: "string" },
          user_id: { bsonType: "string" },
          start_time: { bsonType: "date" },
          end_time: { bsonType: "date" },
          pages_visited: { bsonType: "array", items: { bsonType: "string" } },
          device: { bsonType: "object" },
          actions: { bsonType: "array", items: { bsonType: "string" } },
        },
      },
    },
  });
  
  // 2. Коллекция ProductPriceHistory
  db.createCollection("ProductPriceHistory", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["product_id", "current_price", "currency"],
        properties: {
          product_id: { bsonType: "string" },
          price_changes: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                price: { bsonType: "decimal" }, // Используем decimal вместо double
                date: { bsonType: "date" },
              },
            },
          },
          current_price: { bsonType: "decimal" }, // Используем decimal вместо double
          currency: { bsonType: "string" },
        },
      },
    },
  });
  
  // 3. Коллекция EventLogs
  db.createCollection("EventLogs", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["event_id", "timestamp", "event_type"],
        properties: {
          event_id: { bsonType: "string" },
          timestamp: { bsonType: "date" },
          event_type: { bsonType: "string" },
          details: { bsonType: "object" },
        },
      },
    },
  });
  
  // 4. Коллекция SupportTickets
  db.createCollection("SupportTickets", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["ticket_id", "user_id", "status", "created_at"],
        properties: {
          ticket_id: { bsonType: "string" },
          user_id: { bsonType: "string" },
          status: { bsonType: "string" },
          issue_type: { bsonType: "string" },
          messages: {
            bsonType: "array",
            items: {
              bsonType: "object",
              properties: {
                message: { bsonType: "string" },
                timestamp: { bsonType: "date" },
              },
            },
          },
          created_at: { bsonType: "date" },
          updated_at: { bsonType: "date" },
        },
      },
    },
  });
  
  // 5. Коллекция UserRecommendations
  db.createCollection("UserRecommendations", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["user_id", "last_updated"],
        properties: {
          user_id: { bsonType: "string" },
          recommended_products: { bsonType: "array", items: { bsonType: "string" } },
          last_updated: { bsonType: "date" },
        },
      },
    },
  });
  
  // 6. Коллекция ModerationQueue
  db.createCollection("ModerationQueue", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["review_id", "user_id", "product_id", "submitted_at"],
        properties: {
          review_id: { bsonType: "string" },
          user_id: { bsonType: "string" },
          product_id: { bsonType: "string" },
          review_text: { bsonType: "string" },
          rating: { bsonType: "int" },
          moderation_status: { bsonType: "string" },
          flags: { bsonType: "array", items: { bsonType: "string" } },
          submitted_at: { bsonType: "date" },
        },
      },
    },
  });
  
  // 7. Коллекция SearchQueries
  db.createCollection("SearchQueries", {
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["query_id", "user_id", "query_text", "timestamp"],
        properties: {
          query_id: { bsonType: "string" },
          user_id: { bsonType: "string" },
          query_text: { bsonType: "string" },
          timestamp: { bsonType: "date" },
          filters: { bsonType: "object" },
          results_count: { bsonType: "int" },
        },
      },
    },
  });

  // 1. Коллекция UserSessions
db.UserSessions.insertMany([
    {
      session_id: "session_1",
      user_id: "user_1",
      start_time: new Date("2023-10-01T10:00:00Z"),
      end_time: new Date("2023-10-01T12:00:00Z"),
      pages_visited: ["/home", "/products", "/cart"],
      device: { type: "desktop", os: "Windows", browser: "Chrome" },
      actions: ["login", "view_product", "add_to_cart"],
    },
    {
      session_id: "session_2",
      user_id: "user_2",
      start_time: new Date("2023-10-02T14:00:00Z"),
      end_time: new Date("2023-10-02T15:30:00Z"),
      pages_visited: ["/home", "/about", "/contact"],
      device: { type: "mobile", os: "iOS", browser: "Safari" },
      actions: ["login", "view_page", "submit_form"],
    },
  ]);
  
  // 2. Коллекция ProductPriceHistory
  db.ProductPriceHistory.insertMany([
    {
      product_id: "product_1",
      price_changes: [
        { price: NumberDecimal("100.0"), date: new Date("2023-09-01T00:00:00Z") },
        { price: NumberDecimal("95.0"), date: new Date("2023-09-15T00:00:00Z") },
      ],
      current_price: NumberDecimal("95.0"),
      currency: "USD",
    },
    {
      product_id: "product_2",
      price_changes: [
        { price: NumberDecimal("200.0"), date: new Date("2023-09-01T00:00:00Z") },
        { price: NumberDecimal("180.0"), date: new Date("2023-09-20T00:00:00Z") },
      ],
      current_price: NumberDecimal("180.0"),
      currency: "USD",
    },
  ]);
  
  // 3. Коллекция EventLogs
  db.EventLogs.insertMany([
    {
      event_id: "event_1",
      timestamp: new Date("2023-10-01T10:05:00Z"),
      event_type: "user_login",
      details: { user_id: "user_1", ip: "192.168.1.1" },
    },
    {
      event_id: "event_2",
      timestamp: new Date("2023-10-02T14:10:00Z"),
      event_type: "page_view",
      details: { user_id: "user_2", page: "/about" },
    },
  ]);
  
  // 4. Коллекция SupportTickets
  db.SupportTickets.insertMany([
    {
      ticket_id: "ticket_1",
      user_id: "user_1",
      status: "open",
      issue_type: "payment",
      messages: [
        { message: "I have a problem with my payment.", timestamp: new Date("2023-10-01T11:00:00Z") },
        { message: "We are looking into it.", timestamp: new Date("2023-10-01T11:30:00Z") },
      ],
      created_at: new Date("2023-10-01T11:00:00Z"),
      updated_at: new Date("2023-10-01T11:30:00Z"),
    },
    {
      ticket_id: "ticket_2",
      user_id: "user_2",
      status: "closed",
      issue_type: "technical",
      messages: [
        { message: "The website is not loading.", timestamp: new Date("2023-10-02T14:15:00Z") },
        { message: "Issue resolved.", timestamp: new Date("2023-10-02T14:45:00Z") },
      ],
      created_at: new Date("2023-10-02T14:15:00Z"),
      updated_at: new Date("2023-10-02T14:45:00Z"),
    },
  ]);
  
  // 5. Коллекция UserRecommendations
  db.UserRecommendations.insertMany([
    {
      user_id: "user_1",
      recommended_products: ["product_1", "product_2"],
      last_updated: new Date("2023-10-01T12:00:00Z"),
    },
    {
      user_id: "user_2",
      recommended_products: ["product_3", "product_4"],
      last_updated: new Date("2023-10-02T15:00:00Z"),
    },
  ]);
  
  // 6. Коллекция ModerationQueue
  db.ModerationQueue.insertMany([
    {
      review_id: "review_1",
      user_id: "user_1",
      product_id: "product_1",
      review_text: "Great product!",
      rating: 5,
      moderation_status: "pending",
      flags: [],
      submitted_at: new Date("2023-10-01T11:45:00Z"),
    },
    {
      review_id: "review_2",
      user_id: "user_2",
      product_id: "product_2",
      review_text: "Could be better.",
      rating: 3,
      moderation_status: "approved",
      flags: ["language"],
      submitted_at: new Date("2023-10-02T14:50:00Z"),
    },
  ]);
  
  // 7. Коллекция SearchQueries
  db.SearchQueries.insertMany([
    {
      query_id: "query_1",
      user_id: "user_1",
      query_text: "laptop",
      timestamp: new Date("2023-10-01T10:10:00Z"),
      filters: { category: "electronics", price_range: "100-500" },
      results_count: 25,
    },
    {
      query_id: "query_2",
      user_id: "user_2",
      query_text: "smartphone",
      timestamp: new Date("2023-10-02T14:20:00Z"),
      filters: { category: "electronics", brand: "Apple" },
      results_count: 10,
    },
  ]);