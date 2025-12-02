package com.lov;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

public class Main {

    private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
    private static final Gson gson = new Gson();
    
    // MOCK DATABASE (In production, replace this with SQL or NoSQL DB)
    // Key: Email, Value: Access Code
    private static final Map<String, String> userDatabase = new HashMap<>();
    static {
        userDatabase.put("client@oldschoolboxing.com", "boxer123");
        userDatabase.put("demo@lovoson.com", "lovoson2025");
    }

    public static void main(String[] args) {

        // --- Server Config ---
        port(getHerokuAssignedPort());
        
        // IMPORTANT: Set static file location. 
        // You MUST move index.html, onboarding.html, css/, js/ etc. into 'src/main/resources/public'
        staticFiles.location("/public");

        // --- Enable CORS (Cross-Origin Resource Sharing) ---
        // This allows your frontend (e.g. running on local file or Live Server) to talk to this backend
        options("/*", (request, response) -> {
            String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
            if (accessControlRequestHeaders != null) {
                response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
            }

            String accessControlRequestMethod = request.headers("Access-Control-Request-Method");
            if (accessControlRequestMethod != null) {
                response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
            }

            return "OK";
        });

        before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

        // --- Root Route ---
        // Redirect root URL to index.html if serving static files from this server
        get("/", (req, res) -> {
            res.redirect("/index.html");
            return null;
        });

        // --- 1. LOGIN ENDPOINT ---
        post("/api/login", (req, res) -> {
            res.type("application/json");
            try {
                JsonObject body = gson.fromJson(req.body(), JsonObject.class);
                
                // Safety check for missing fields
                if (body == null || !body.has("email") || !body.has("password")) {
                    res.status(400);
                    return "{\"status\":\"error\", \"message\":\"Missing email or password\"}";
                }

                String email = body.get("email").getAsString();
                String pass = body.get("password").getAsString();

                if (userDatabase.containsKey(email) && userDatabase.get(email).equals(pass)) {
                    // Success
                    LOGGER.info("Login successful for: {}", email);
                    return "{\"status\":\"success\", \"clientName\":\"" + email.split("@")[0] + "\"}";
                } else {
                    LOGGER.warn("Login failed for: {}", email);
                    res.status(401);
                    return "{\"status\":\"error\", \"message\":\"Invalid credentials\"}";
                }
            } catch (Exception e) {
                LOGGER.error("Server Error in /api/login", e);
                res.status(500);
                return "{\"status\":\"error\", \"message\":\"Server error\"}";
            }
        });

        // --- 2. ENROLL FORM (Existing) ---
        post("/enroll", (request, response) -> {
            response.type("application/json");
            LOGGER.info("Enrollment Request: {}", request.body());
            return "{\"status\":\"success\", \"message\":\"Enrollment received!\"}";
        });

        // --- 3. WEBHOOK LISTENER (Connects to Tally/Make.com) ---
        // When a Tally form is submitted, Tally calls this URL
        post("/api/webhook/tally", (req, res) -> {
            res.type("application/json");
            
            String payload = req.body();
            LOGGER.info("Received Webhook from Tally: {}", payload);
            
            // Logic: Parse the JSON, find the 'client_id' and 'step' fields
            // Update the database status for that client.
            // ... (Add your DB update logic here) ...

            return "{\"status\":\"received\"}";
        });
        
        // --- 4. HEALTH CHECK ---
        get("/health", (req, res) -> "Server is running!");

        LOGGER.info("Lovoson Backend started on port " + getHerokuAssignedPort());
    }

    static int getHerokuAssignedPort() {
        ProcessBuilder processBuilder = new ProcessBuilder();
        String port = processBuilder.environment().get("PORT");
        if (port != null) {
            return Integer.parseInt(port);
        }
        return 8080;
    }
}