$(document).ready(function () {
    function loadNotes() {
      $("#generateBtn").prop("disabled", true).text("Chargement...");
      $.get("/api/notes", function (data) {
        const notes = data.split(/\n\s*\n/);
        let html = "";
        notes.forEach((note, index) => {
          html += `
            <div class="col-md-6 col-lg-4">
              <div class="card shadow rounded-4 p-3 h-100">
                <div class="card-body">
                  <h5 class="card-title text-primary">Note ${index + 1}</h5>
                  <p class="card-text" style="white-space: pre-wrap;">${note.trim()}</p>
                </div>
              </div>
            </div>
          `;
        });
        $("#notesContainer").html(html);
        $("#generateBtn").prop("disabled", false).text("Régénérer les notes");
      });
    }
  
    loadNotes();
  
    $("#generateBtn").click(function () {
      loadNotes();
    });
  });
  