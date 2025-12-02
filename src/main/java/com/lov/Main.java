package com.lov;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonSyntaxException;

import static spark.Spark.before;
import static spark.Spark.get;
import static spark.Spark.options;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.staticFiles;

public class Main {

    private static final Logger LOGGER = LoggerFactory.getLogger(Main.class);
    private static final Gson gson = new Gson();

    // --- MOCK DATABASE ---
    private static final Map<String, Client> clientDatabase = new HashMap<>();

    static {
        // Client 1: Old School Boxing
        Client c1 = new Client("Old School Boxing", "client@oldschoolboxing.com", "boxer123");
        // Simulate some progress: Steps 1 and 2 are done
        c1.setProgress("1", true);
        c1.setProgress("2", true);
        clientDatabase.put(c1.email, c1);

        // Client 2: Demo
        Client c2 = new Client("Demo Client", "demo@lovoson.com", "lovoson2025");
        clientDatabase.put(c2.email, c2);
    }

    public static void main(String[] args) {

        port(getHerokuAssignedPort());
        staticFiles.location("/public");

        // --- CORS ---
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

        // --- ROUTING ---
        get("/", (req, res) -> {
            res.redirect("/index.html");
            return null;
        });

        // 1. LOGIN ENDPOINT
        post("/api/login", (req, res) -> {
            res.type("application/json");
            try {
                JsonObject body = gson.fromJson(req.body(), JsonObject.class);

                if (body == null || !body.has("email") || !body.has("password")) {
                    res.status(400);
                    return "{\"status\":\"error\", \"message\":\"Missing email or password\"}";
                }

                String email = body.get("email").getAsString();
                String password = body.get("password").getAsString();

                if (clientDatabase.containsKey(email)) {
                    Client client = clientDatabase.get(email);
                    if (client.password.equals(password)) {
                        LOGGER.info("Login successful: " + email);
                        return "{\"status\":\"success\", \"clientName\":\"" + client.businessName + "\"}";
                    }
                }

                LOGGER.warn("Login failed: " + email);
                res.status(401);
                return "{\"status\":\"error\", \"message\":\"Invalid credentials\"}";

            } catch (JsonSyntaxException e) {
                LOGGER.error("JSON Syntax Error", e);
                res.status(400);
                return "{\"status\":\"error\", \"message\":\"Invalid JSON format\"}";
            } catch (Exception e) {
                LOGGER.error("Server Error", e);
                res.status(500);
                return "{\"status\":\"error\", \"message\":\"Internal Server Error\"}";
            }
        });

        // 2. CLIENT PROGRESS ENDPOINT (New!)
        get("/api/client-progress", (req, res) -> {
            res.type("application/json");

            String clientName = req.queryParams("client"); // e.g., "Old School Boxing"

            if (clientName == null || clientName.isEmpty()) {
                res.status(400);
                return "{\"status\":\"error\", \"message\":\"Missing client parameter\"}";
            }

            // In a real app, we'd look up by ID/Email. Since we only have name passed from frontend for now,
            // we will iterate to find the matching business name.
            // (This is temporary logic for the prototype phase)
            Client foundClient = null;
            for (Client c : clientDatabase.values()) {
                if (c.businessName.equalsIgnoreCase(clientName)) {
                    foundClient = c;
                    break;
                }
            }

            if (foundClient != null) {
                // Return the progress map
                return gson.toJson(foundClient.progress);
            } else {
                // If not found, return empty object (no progress)
                return "{}";
            }
        });

        // 3. ENROLL FORM
        post("/enroll", (req, res) -> {
            res.type("application/json");
            LOGGER.info("Enrollment Request: {}", req.body());
            return "{\"status\":\"success\", \"message\":\"Enrollment received!\"}";
        });

        // 4. HEALTH CHECK
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

    // --- CLIENT DATA MODEL ---
    static class Client {

        String businessName;
        String email;
        String password;
        // Stores step ID ("1", "2") mapped to completion status (true/false)
        Map<String, Boolean> progress = new HashMap<>();

        public Client(String businessName, String email, String password) {
            this.businessName = businessName;
            this.email = email;
            this.password = password;
        }

        public void setProgress(String stepId, boolean isComplete) {
            this.progress.put(stepId, isComplete);
        }

        public String getEmail() {
            return email;
        }
    }
}
