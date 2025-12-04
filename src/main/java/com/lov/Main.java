package com.lov;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
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

    // --- MOCK DATABASE ---
    private static final Map<String, Client> clientDatabase = new HashMap<>();

    static {
        // Client 1: Old School Boxing (Pre-loaded for testing)
        Client c1 = new Client("Old School Boxing", "client@oldschoolboxing.com", "boxer123");
        // Simulate some progress: Step 1 (Welcome) is done by default
        c1.setProgress("1", true);
        clientDatabase.put(c1.email, c1);

        // Client 2: Demo
        Client c2 = new Client("Demo Client", "demo@lovoson.com", "lovoson2025");
        clientDatabase.put(c2.email, c2);
    }

    public static void main(String[] args) {

        // Use Render's PORT or default to 8080
        port(getHerokuAssignedPort());

        // Serve static files (HTML/CSS)
        staticFiles.location("/public");

        // --- CORS (Allow frontend access) ---
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
        // Root redirects to index
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

            } catch (Exception e) {
                LOGGER.error("Login Error", e);
                res.status(500);
                return "{\"status\":\"error\", \"message\":\"Server error\"}";
            }
        });

        // 2. CLIENT PROGRESS ENDPOINT
        get("/api/client-progress", (req, res) -> {
            res.type("application/json");
            String clientName = req.queryParams("client");

            if (clientName == null || clientName.isEmpty()) {
                res.status(400);
                return "{\"status\":\"error\", \"message\":\"Missing client parameter\"}";
            }

            // Find client by name (Mock logic - acceptable for MVP)
            Client foundClient = null;
            for (Client c : clientDatabase.values()) {
                if (c.businessName.equalsIgnoreCase(clientName)) {
                    foundClient = c;
                    break;
                }
            }

            if (foundClient != null) {
                return gson.toJson(foundClient.progress);
            } else {
                return "{}";
            }
        });

        // 3. TALLY WEBHOOK LISTENER (THE NEW LOGIC)
        post("/api/webhook/tally", (req, res) -> {
            res.type("application/json");
            String payload = req.body();
            LOGGER.info("Received Webhook: " + payload);

            try {
                JsonObject json = gson.fromJson(payload, JsonObject.class);

                // Parse Tally Structure: { data: { fields: [ {key:..., value:...} ] } }
                if (json.has("data")) {
                    JsonObject data = json.getAsJsonObject("data");
                    if (data.has("fields")) {
                        JsonArray fields = data.getAsJsonArray("fields");

                        String clientId = null;
                        String stepId = null;

                        // Iterate through fields to find our hidden 'client_id' and 'step'
                        for (JsonElement fieldElement : fields) {
                            JsonObject field = fieldElement.getAsJsonObject();
                            if (field.has("key") && field.has("value")) {
                                String key = field.get("key").getAsString();
                                JsonElement valueElem = field.get("value");

                                if (valueElem.isJsonNull()) {
                                    continue;
                                }
                                String value = valueElem.getAsString();

                                if ("client_id".equals(key)) {
                                    clientId = value;
                                }
                                if ("step".equals(key)) {
                                    stepId = value;
                                }
                            }
                        }

                        if (clientId != null && stepId != null) {
                            LOGGER.info("Processing Update -> Client: " + clientId + ", Step: " + stepId);

                            // Find client and update progress
                            for (Client c : clientDatabase.values()) {
                                if (c.businessName.equalsIgnoreCase(clientId)) {
                                    // Convert "contract" -> "2", "intake" -> "4"
                                    String numericStepId = mapStepToId(stepId);
                                    c.setProgress(numericStepId, true);
                                    LOGGER.info("Updated progress for " + c.businessName + " (Step " + numericStepId + ")");
                                    return "{\"status\":\"success\", \"message\":\"Progress updated\"}";
                                }
                            }
                            LOGGER.warn("Client not found: " + clientId);
                        }
                    }
                }

                return "{\"status\":\"ignored\", \"message\":\"No matching client or step found\"}";

            } catch (Exception e) {
                LOGGER.error("Webhook Error", e);
                res.status(500);
                return "{\"status\":\"error\", \"message\":\"Webhook processing failed\"}";
            }
        });

        // 4. GENERAL ENROLL FORM
        post("/enroll", (req, res) -> {
            res.type("application/json");
            LOGGER.info("Enrollment Request: {}", req.body());
            return "{\"status\":\"success\", \"message\":\"Enrollment received!\"}";
        });

        // 5. HEALTH CHECK (For Render)
        get("/health", (req, res) -> "Server is running!");

        LOGGER.info("Lovoson Backend started on port " + getHerokuAssignedPort());
    }

    // Helper: Maps Tally's string values to the numeric step IDs used in the UI
    private static String mapStepToId(String stepName) {
        if (stepName == null) {
            return "0";
        }
        switch (stepName.toLowerCase()) {
            case "contract":
                return "2";
            case "access":
                return "3";
            case "intake":
                return "4";
            case "kickoff":
                return "5";
            case "final":
                return "6";
            // Allow passing raw numbers if Tally is configured that way
            default:
                return stepName;
        }
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
