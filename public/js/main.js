$(document).ready(function () {
  function loadNotes() {
    $("#generateBtn").prop("disabled", true).html('<span class="spinner-border spinner-border-sm me-2"></span>Chargement...');

    $.get("/api/notes")
      .done(function (data) {
        const notes = data.split(/\n\s*\n/);
        let html = "";
        notes.forEach((note, index) => {
          html += `
            <div class="col-md-6 col-lg-4">
              <div class="card shadow rounded-4 p-3 h-100 animate__animated animate__fadeInUp">
                <div class="card-body">
                  <h5 class="card-title text-primary">Note ${index + 1}</h5>
                  <p class="card-text" style="white-space: pre-wrap;">${note.trim()}</p>
                </div>
              </div>
            </div>
          `;
        });
        $("#notesContainer").html(html);
      })
      .fail(function (err) {
        $("#notesContainer").html(`
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
