document.getElementById("linkForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const link = document.getElementById("linkInput").value.trim();
    const description = document.getElementById("descriptionInput").value.trim();
    const selectedTitle = document.getElementById("titleSelect").value.trim();
    const newTitle = document.getElementById("newTitleInput").value.trim();

    const titleToUse = newTitle || selectedTitle; // Use selected title or new title

    if (!link || !titleToUse) {
        alert("Veuillez saisir un lien et un titre.");
        console.error("❌ Submission failed: Missing data", { link, titleToUse });
        return;
    }

    const data = {
        url: link, // Make sure this matches the API expectation
        description,
        titres: titleToUse, // Ensure this is correctly named
    };

    console.log("📤 Sending data:", data); // Debugging

    try {
        const response = await fetch("http://localhost:3000/veille", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("✅ Server Response:", result); // Debugging

        if (response.ok) {
            alert("Lien enregistré avec succès !");
        } else {
            alert("Erreur lors de l'enregistrement: " + result.message);
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'envoi des données :", error);
        alert("Une erreur est survenue. Vérifiez la console.");
    }
});
