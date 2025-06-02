$(document).ready(function () {
function loadNotes() {
$("#generateBtn")
.prop("disabled", true)
.html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

javascript
Copy
Edit
$.get("/api/notes")
  .done(function (data) {
    const notes = data.split(/\n\s*\n/);
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

    // Insérer dans le DOM
    const $flipbook = $("#flipbook");
    $flipbook.html(html);

    // Détruire un flipbook existant avant de le recréer
    if ($flipbook.data("turn")) {
      $flipbook.turn("destroy").removeClass("turnjs");
    }

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
    $("#generateBtn").prop("disabled", false).html("Régénérer les notes");
  });
}

// Premier chargement
loadNotes();

// Clic sur le bouton
$("#generateBtn").click(loadNotes);
});
