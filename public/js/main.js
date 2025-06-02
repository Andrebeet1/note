$(document).ready(function () {
  // Fonction d’échappement HTML simple
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

  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        const notes = data.split(/\n\s*\n/); // séparation par double retour
        let html = "";

        // Générer les pages
        notes.forEach((note, index) => {
          html += `
            <div class="page">
              <h5 class="text-primary">Note ${index + 1}</h5>
              <p style="white-space: pre-wrap;">${escapeHtml(note.trim())}</p>
            </div>
          `;
        });

        const $flipbook = $("#flipbook");

        // Nettoyage si déjà existant
        if ($flipbook.data("turn")) {
          $flipbook.turn("destroy").removeClass("turnjs");
        }

        $flipbook.html(html);

        // Initialiser turn.js
        $flipbook.turn({
          width: 800,
          height: 600,
          autoCenter: true,
          elevation: 50,
          gradients: true,
          when: {
            turning: function (event, page, view) {
              console.log("Page tournante vers :", page);
            }
          }
        });
      })
      .fail(function (err) {
        $("#flipbook").html(`
          <div class="alert alert-danger">
            ⚠️ Une erreur est survenue lors du chargement des notes.
          </div>
        `);
        console.error("Erreur lors du chargement :", err);
      })
      .always(function () {
        $("#generateBtn")
          .prop("disabled", false)
          .html("Régénérer les notes");
      });
  }

  // Chargement initial
  loadNotes();

  // Rechargement
  $("#generateBtn").click(function () {
    const $flipbook = $("#flipbook");
    if ($flipbook.data("turn")) {
      $flipbook.turn("destroy").removeClass("turnjs");
    }
    loadNotes();
  });
});
