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
    $("#pageIndicator").html(`<span class="badge bg-success rounded-pill">Note ${currentIndex + 1} / ${totalNotes}</span>`);
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
        const notes = raw.split(/\n\s*\n/).filter(n => n.trim().startsWith("🌿"));

        totalNotes = notes.length;
        currentIndex = 0;

        const html = notes.map((note, i) => {
          const lines = note.trim().split("\n").filter(Boolean);

          const theme = escapeHtml(lines[0] || "🌿 Méditation du jour");
          const verseLabel = escapeHtml(lines[1] || "📖 Verset du jour");
          const verse = escapeHtml((lines[2] || "").replace(/^>\s*/, ""));

          const prayerIndex = lines.findIndex(l => l.trim().startsWith("🙏"));
          const citationIndex = lines.findIndex(l => l.trim().startsWith("💬"));

          const meditationLines =
            prayerIndex > 3 ? lines.slice(3, prayerIndex) : [];

          const meditation = escapeHtml(meditationLines.join(" ").trim());

          const prayerLines = (prayerIndex >= 0 && citationIndex > prayerIndex)
            ? lines.slice(prayerIndex, citationIndex)
            : (prayerIndex >= 0 ? lines.slice(prayerIndex) : []);
          const prayer = escapeHtml(
            prayerLines.join(" ").replace(/^🙏\s*Prière\s*:\s*/i, "").trim()
          );

          const citationLines = citationIndex >= 0 ? lines.slice(citationIndex) : [];
          const citation = escapeHtml(
            citationLines.join(" ").replace(/^💬\s*Citation\s*:\s*/i, "").trim()
          );

          return `
            <section class="${i === 0 ? "active animate__fadeIn" : ""}">
              <div class="card shadow border-0 mb-4 animate__animated animate__fadeInUp" style="border-radius: 1rem;">
                <div class="card-body px-4 py-4">

                  <h5 class="text-success fw-bold mb-3">
                    ${theme}
                  </h5>

                  <div class="mb-3">
                    <div class="text-muted small fw-semibold mb-1">${verseLabel}</div>
                    <blockquote class="blockquote ps-3 border-start border-3 border-success">
                      <p class="mb-0 fst-italic">"${verse}"</p>
                    </blockquote>
                  </div>

                  ${meditation ? `
                    <div class="mb-3">
                      <h6 class="text-dark fw-semibold mb-2">🕊️ Méditation</h6>
                      <p class="lh-lg text-dark">${meditation}</p>
                    </div>
                  ` : ""}

                  ${prayer ? `
                    <div class="mb-3">
                      <h6 class="text-success fw-semibold mb-2">🙏 Prière</h6>
                      <p class="text-secondary lh-lg">${prayer}</p>
                    </div>
                  ` : ""}

                  ${citation ? `
                    <div class="mt-3 text-primary text-center">
                      <em>💬 "${citation}"</em>
                    </div>
                  ` : ""}

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
