$(document).ready(function () {
  let currentIndex = 0;
  let totalNotes = 0;

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      }[match];
    });
  }

  function updateNavigation() {
    $("#supportNotes section").removeClass("active animate__fadeIn");
    const currentSection = $("#supportNotes section").eq(currentIndex);
    currentSection.addClass("active animate__fadeIn");
    $("#pageIndicator").text(`Note ${currentIndex + 1} / ${totalNotes}`);
    $("#prevBtn").prop("disabled", currentIndex === 0);
    $("#nextBtn").prop("disabled", currentIndex >= totalNotes - 1);
  }

  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        const raw = data.content || data;
        const notes = raw.split(/\n\s*\n/).filter(n => n.trim() !== "");

        totalNotes = notes.length;
        currentIndex = 0;

        const html = notes.map((note, i) => {
          const lines = note.trim().split("\n").filter(Boolean);

          // Ligne 0 : thème (ex: 🌿 1. Verset + Prière : Thème)
          const themeLine = escapeHtml(lines[0] || "🌿 Verset + Prière");

          // Ligne 1 : label du verset (ex: 📖 Verset du jour)
          const verseLabel = escapeHtml(lines[1] || "📖 Verset du jour");

          // Ligne 2 : verset avec > en début
          const verseLine = escapeHtml((lines[2] || "").replace(/^>\s*/, ""));

          // Recherche ligne de prière (qui commence par "🙏")
          const prayerIndex = lines.findIndex(l => l.trim().startsWith("🙏"));
          const prayerLabelLine = prayerIndex >= 0 ? lines[prayerIndex] : "";
          const prayerLine = escapeHtml(prayerLabelLine.replace(/^🙏\s*Prière\s*:\s*/i, ""));

          // Méditation : toutes les lignes entre le verset et la prière (exclues)
          const meditationLines = prayerIndex > 3 ? lines.slice(3, prayerIndex) : [];
          const meditation = escapeHtml(meditationLines.join(" ").trim());

          return `
            <section class="${i === 0 ? "active animate__fadeIn" : ""}">
              <div class="card shadow-sm border-0 mb-4 animate__animated animate__fadeInUp">
                <div class="card-body">
                  <h5 class="text-success mb-2">${themeLine}</h5>

                  <p class="fw-semibold text-muted mb-1">${verseLabel}</p>
                  <blockquote class="blockquote ps-3 border-start border-success">
                    <p class="mb-0 fst-italic">"${verseLine}"</p>
                  </blockquote>

                  <hr>

                  <p class="mb-2 text-dark">${meditation}</p>

                  <p class="mt-3 text-secondary"><strong>🙏 Prière :</strong> ${prayerLine}</p>
                </div>
              </div>
            </section>
          `;
        }).join("");

        $("#supportNotes").html(html);
        updateNavigation();
      })
      .fail(function () {
        $("#supportNotes").html(`<div class="alert alert-danger">⚠️ Impossible de charger les notes. Vérifiez votre connexion ou réessayez plus tard.</div>`);
      })
      .always(function () {
        $("#generateBtn").prop("disabled", false).html("🔄 Régénérer les notes");
      });
  }

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

  $("#generateBtn").click(() => loadNotes());

  loadNotes(); // Chargement initial
});