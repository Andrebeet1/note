$(document).ready(function () {
  let currentIndex = 0;
  let totalNotes = 0;

  // Fonction d'échappement HTML (sécurité XSS)
  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, match => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[match]));
  }

  // Mise à jour de la navigation (affichage de la note active et boutons)
  function updateNavigation() {
    $("#supportNotes section").removeClass("active animate__fadeIn");
    const currentSection = $("#supportNotes section").eq(currentIndex);
    currentSection.addClass("active animate__fadeIn");

    $("#pageIndicator").html(
      `<span class="badge bg-success rounded-pill">Note ${currentIndex + 1} / ${totalNotes}</span>`
    );

    $("#prevBtn").prop("disabled", currentIndex === 0);
    $("#nextBtn").prop("disabled", currentIndex >= totalNotes - 1);
  }

  // Chargement et affichage des notes depuis l'API
  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        const raw = data.content || data;
        const notes = raw.split(/\n\s*\n/).filter(n => n.trim().startsWith("🌿"));

        totalNotes = notes.length;
        currentIndex = 0;

        const html = notes.map((note, i) => {
          const lines = note.trim().split("\n").filter(Boolean);

          // 🌿 Titre de la note
          const titleLine = escapeHtml(lines[0] || "🌿 Note");

          // 📖 Verset du jour
          const verseLineIndex = lines.findIndex(l => l.includes("📖"));
          const verseTextLine = lines[verseLineIndex + 1] || "";
          const [verseText, verseRef] = verseTextLine.split("—").map(part => escapeHtml(part?.trim() || ""));

          // 🙏 Prière
          const prayerIndex = lines.findIndex(l => l.startsWith("🙏"));
          const citationIndex = lines.findIndex(l => l.startsWith("💬"));

          const prayerLines = (prayerIndex >= 0 && citationIndex > prayerIndex)
            ? lines.slice(prayerIndex, citationIndex)
            : lines.slice(prayerIndex);
          const prayerText = escapeHtml(
            prayerLines.join(" ").replace(/^🙏\s*Prière\s*:\s*/i, "").trim()
          );

          // 💬 Citation
          const citationLines = citationIndex >= 0 ? lines.slice(citationIndex) : [];
          const citationText = escapeHtml(
            citationLines.join(" ").replace(/^💬\s*Citation\s*:\s*/i, "").trim()
          );

          return `
            <section class="${i === 0 ? "active animate__fadeIn" : ""}">
              <div class="container py-4">
                <div class="card shadow rounded-4">
                  <div class="card-body">
                    <h2 class="card-title text-center text-primary mb-4">🌿 Note Spirituelle du Jour</h2>

                    <h5 class="text-secondary">${titleLine.replace("🌿", "").trim()}</h5>
                    <hr>

                    <h6 class="text-muted">📖 Verset du jour :</h6>
                    <blockquote class="blockquote ps-3 border-start border-3 border-success">
                      <p class="mb-0 fst-italic">« ${verseText} »</p>
                      <footer class="blockquote-footer mt-1">${verseRef}</footer>
                    </blockquote>

                    ${prayerText ? `
                      <hr>
                      <h6 class="text-muted">🙏 Prière :</h6>
                      <p class="text-secondary lh-lg">${prayerText}</p>
                    ` : ""}

                    ${citationText ? `
                      <hr>
                      <h6 class="text-muted">💬 Citation Inspirante :</h6>
                      <blockquote class="blockquote text-center">
                        <p class="mb-0"><em>"${citationText}"</em></p>
                        <footer class="blockquote-footer mt-1">Inconnu</footer>
                      </blockquote>
                    ` : ""}
                  </div>
                </div>
              </div>
            </section>
          `;
        }).join("");

        $("#supportNotes").html(html);
        updateNavigation();
      })
      .fail(function () {
        $("#supportNotes").html(
          `<div class="alert alert-danger">⚠️ Impossible de charger les notes. Vérifiez votre connexion ou réessayez plus tard.</div>`
        );
      })
      .always(function () {
        $("#generateBtn").prop("disabled", false).html("🔄 Régénérer les notes");
      });
  }

  // Navigation entre les notes
  $("#prevBtn").click(() => {
    if (currentIndex > 0) {
      currentIndex--;
      updateNavigation();
    }
  });

  $("#nextBtn").click(() => {
    if (currentIndex < totalNotes - 1) {
      currentIndex++;
      updateNavigation();
    }
  });

  // Génération des notes
  $("#generateBtn").click(() => loadNotes());

  // Chargement initial des notes
  loadNotes();
});