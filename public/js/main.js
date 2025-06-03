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

          const theme = escapeHtml(lines[0] || "🌿 Méditation du jour");
          const verseLabel = escapeHtml(lines[1] || "📖 Verset du jour");
          const verse = escapeHtml((lines[2] || "").replace(/^>\s*/, ""));

          const prayerIndex = lines.findIndex(l => l.trim().startsWith("🙏"));
          const citationIndex = lines.findIndex(l => l.trim().startsWith("💬"));

          const meditationLines = prayerIndex > 3 ? lines.slice(3, prayerIndex) : [];
          const meditation = escapeHtml(meditationLines.join(" ").trim());

          const prayerRaw = prayerIndex >= 0 ? lines[prayerIndex] : "";
          const prayer = escapeHtml(prayerRaw.replace(/^🙏\s*Prière\s*:\s*/i, ""));

          const citationRaw = citationIndex >= 0 ? lines[citationIndex] : "";
          const citation = escapeHtml(citationRaw.replace(/^💬\s*Citation\s*:\s*/i, ""));

          return `
            <section class="${i === 0 ? "active animate__fadeIn" : ""}">
              <div class="card shadow border-0 mb-4 animate__animated animate__fadeInUp" style="border-radius: 1rem;">
                <div class="card-body">
                  <h5 class="text-success fw-semibold mb-3">${theme}</h5>

                  <p class="fw-medium text-muted mb-1">${verseLabel}</p>
                  <blockquote class="blockquote ps-3 border-start border-success">
                    <p class="mb-0 fst-italic">"${verse}"</p>
                  </blockquote>

                  <hr class="my-3">

                  ${meditation ? `<p class="text-dark lh-lg">${meditation}</p><hr class="my-3">` : ""}

                  ${prayer ? `
                    <p class="text-secondary">
                      <strong class="text-success">🙏 Prière :</strong> ${prayer}
                    </p>
                    <hr class="my-3">
                  ` : ""}

                  ${citation ? `
                    <div class="mt-3 text-primary">
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