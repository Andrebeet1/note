$(document).ready(function () {
  function loadNotes() {
    $("#generateBtn")
      .prop("disabled", true)
      .html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        const notes = data.split(/\n\s*\n/); // séparation des notes par double retour
        let html = "";

        // Générer les pages pour turn.js
        notes.forEach((note, index) => {
          html += `
            <div class="page">
              <h5 class="text-primary">Note ${index + 1}</h5>
              <p style="white-space: pre-wrap;">${note.trim()}</p>
            </div>
          `;
        });

        const $flipbook = $("#flipbook");

        // Détruire l'ancien flipbook s'il existe
        if ($flipbook.data("turn")) {
          $flipbook.turn("destroy").removeClass("turnjs");
        }

        // Insérer les nouvelles pages
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
        console.error("Erreur : ", err);
      })
      .always(function () {
        $("#generateBtn")
          .prop("disabled", false)
          .html("Régénérer les notes");
      });
  }

  // Premier chargement
  loadNotes();

  // Bouton de rechargement
  $("#generateBtn").click(function () {
    const $flipbook = $("#flipbook");
    if ($flipbook.data("turn")) {
      $flipbook.turn("destroy"); // Nettoyer avant régénération
    }
    loadNotes();
  });
});
