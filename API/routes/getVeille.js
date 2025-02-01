const express = require("express");
const router = express.Router();
const db = require("../services/db");

// Route to fetch all titles
router.get("/titles", async function (req, res, next) {
    try {
        const rows = await db.query("SELECT DISTINCT titres FROM links");
        res.json(rows.map(row => row.titres));
    } catch (err) {
        console.error("❌ Error fetching titles:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Route to fetch links by title
router.get("/", async function (req, res, next) {
    try {
        const { title } = req.query;

        console.log(`🔍 Incoming API request for title: "${title}"`);

        if (!title) {
            return res.status(400).json({ message: "❌ Error: Title is required." });
        }

        const sql = "SELECT url, description FROM links WHERE titres = ?";
        const rows = await db.query(sql, [title]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "⚠️ No links found for this title." });
        }

        console.log(`✅ Found ${rows.length} links for title: "${title}"`);
        res.json(rows);
    } catch (err) {
        console.error(`❌ Database error: ${err.message}`);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Route pour ajouter un lien
// Route pour ajouter un lien
router.post("/", async function (req, res, next) {
    try {
        console.log("📥 Received data:", req.body); // Debugging incoming data

        const { url, description, titres } = req.body; // Extract fields

        if (!url || !titres) {
            console.log("❌ Missing fields:", { url, titres }); // Log missing values
            return res.status(400).json({ message: "Le lien et le titre sont obligatoires." });
        }

        const sql = "INSERT INTO links (titres, url, description) VALUES (?, ?, ?)";
        const result = await db.query(sql, [titres, url, description]);

        res.status(201).json({ message: "Lien ajouté avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de l'insertion :", err);
        res.status(500).json({ message: "Erreur lors de l'ajout du lien", error: err.message });
    }
});


module.exports = router;
