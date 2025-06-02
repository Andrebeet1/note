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
        "'": '&#039;'
      }[match];
    });
  }

  function updateNavigation() {
    $("#supportNotes section").removeClass("active");
    $("#supportNotes section").eq(currentIndex).addClass("active");

    $("#pageIndicator").text(`Note ${currentIndex + 1}`);
    $("#prevBtn").prop("disabled", currentIndex === 0);
    $("#nextBtn").prop("disabled", currentIndex >= totalNotes - 1);
  }

  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        let raw = data.content || data;
        const notes = raw.split(/\n\s*\n/); // Sépare les notes par paragraphes

        totalNotes = notes.length;
        currentIndex = 0;

        const html = notes.map((note, i) => {
          const lines = note.trim().split('\n');
          const verseLine = lines[0] || "";
          const prayerLine = lines.slice(1).join("<br>");

          return `
            <section class="${i === 0 ? 'active' : ''}">
              <div class="card shadow-sm border-0 mb-4">
                <div class="card-body">
                  <h5 class="text-primary mb-3">📖 Note ${i + 1}</h5>
                  <blockquote class="blockquote ps-3 border-start border-primary">
                    <p class="mb-1 text-dark" style="font-size: 1.1rem;"><em>${escapeHtml(verseLine)}</em></p>
                  </blockquote>
                  <hr>
                  <p class="text-secondary fst-italic">🕊️ ${escapeHtml(prayerLine)}</p>
                </div>
              </div>
            </section>
          `;
        }).join("");

        $("#supportNotes").html(html);
        updateNavigation();
      })
      .fail(function () {
        $("#supportNotes").html(`<div class="alert alert-danger">⚠️ Impossible de charger les notes.</div>`);
      })
      .always(function () {
        $("#generateBtn").prop("disabled", false).html("Régénérer les notes");
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

  loadNotes();
});
