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
        const notes = raw.split(/\n\s*\n/); // sépare les notes par paragraphes

        totalNotes = notes.length;
        currentIndex = 0;

        const html = notes.map((note, i) => `
          <section class="${i === 0 ? 'active' : ''}">
            <h5 class="text-primary">Note ${i + 1}</h5>
            <p style="white-space: pre-wrap;">${escapeHtml(note.trim())}</p>
          </section>
        `).join("");

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
