$(document).ready(function () {
  let currentIndex = 0;
  let totalNotes = 0;

  // Fonction d'échappement HTML sécurisée (XSS safe)
  function sanitizeHtml(text) {
    return $('<div>').text(text).html();
  }

  // Mise à jour de la navigation et affichage de la note active
  function updateNavigation() {
    const sections = $("#supportNotes section");
    sections.removeClass("active animate__fadeIn");

    const currentSection = sections.eq(currentIndex);
    currentSection.addClass("active animate__fadeIn");

    $("#pageIndicator").html(
      `<span class="badge bg-success rounded-pill">Note ${currentIndex + 1} / ${totalNotes}</span>`
    );

    $("#prevBtn").prop("disabled", currentIndex === 0);
    $("#nextBtn").prop("disabled", currentIndex >= totalNotes - 1);
  }

  // Affiche un loader pendant le chargement des notes
  function showLoading(show) {
    if (show) {
      $("#supportNotes").html(`
        <div class="d-flex justify-content-center align-items-center py-5">
          <div class="spinner-border text-danger" role="status" aria-label="Chargement en cours">
            <span class="visually-hidden">Chargement...</span>
          </div>
        </div>
      `);
    }
  }

  // Chargement des notes depuis l'API et rendu HTML
  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    showLoading(true);

    $.get("/api/notes")
      .done(function (data) {
        const raw = data.content || data;
        const notes = raw.split(/\n\s*\n/).filter(n => n.trim().startsWith("🌿"));

        totalNotes = notes.length;
        currentIndex = 0;

        if (totalNotes === 0) {
          $("#supportNotes").html(`<div class="alert alert-warning">Aucune note trouvée.</div>`);
          $("#pageIndicator").empty();
          return;
        }

        const html = notes.map((note, i) => {
          const lines = note.trim().split("\n").filter(Boolean);

          // Extraction et nettoyage
          const titleLine = sanitizeHtml(lines[0] || "🌿 Note");

          const verseLineIndex = lines.findIndex(l => l.includes("📖"));
          const verseTextLine = lines[verseLineIndex + 1] || "";
          const [verseText, verseRef] = verseTextLine.split("—").map(part => sanitizeHtml(part?.trim() || ""));

          const prayerIndex = lines.findIndex(l => l.startsWith("🙏"));
          const citationIndex = lines.findIndex(l => l.startsWith("💬"));

          const prayerLines = (prayerIndex >= 0 && citationIndex > prayerIndex)
            ? lines.slice(prayerIndex, citationIndex)
            : lines.slice(prayerIndex);
          const prayerText = sanitizeHtml(
            prayerLines.join(" ").replace(/^🙏\s*Prière\s*:\s*/i, "").trim()
          );

          const citationLines = citationIndex >= 0 ? lines.slice(citationIndex) : [];
          const citationText = sanitizeHtml(
            citationLines.join(" ").replace(/^💬\s*Citation\s*:\s*/i, "").trim()
          );

          return `
            <section class="${i === 0 ? "active animate__fadeIn" : ""}" aria-hidden="${i !== 0}">
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
        $("#pageIndicator").empty();
      })
      .always(function () {
        $("#generateBtn").prop("disabled", false).html("🔄 Régénérer les notes");
      });
  }

  // Gestion des boutons de navigation
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

  // Bouton régénérer (rechargement des notes)
  $("#generateBtn").click(() => loadNotes());

  // Chargement initial
  loadNotes();
});