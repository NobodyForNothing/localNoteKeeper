"use strict"

let notes = [{
  "id": 0,
  "title": "Creating Notes:",
  "text": "You can create notes by pressing the + button",
  "tags": ["tutorial", "starter", "default"]
}]

function loadNotes() {
  let json = window.localStorage.notes;
  let notesInStorage = JSON.parse(json);

  if (notesInStorage.length > 0) {
    notes = notesInStorage;
  }
}

function createNote(text, tags, title = "Note") {
  let lastNoteId = 0;
  for(let note of notes) {
    if(note.id > lastNoteId) {
      lastNoteId = note.id;
    }
  }
  let noteId = lastNoteId + 1;
  return {
    id: noteId,
    title: title,
    text: text,
    tags: tags
  };
}


function drawNotes() {
  let sectionElement = document.getElementById("notes-section");
  sectionElement.innerHTML = "";

  for (const note of notes) {
    // create note
    let noteElement = document.createElement("div");
    noteElement.classList.add("note");
    let innerNote = document.createElement("div");
    let titleElement = document.createElement("h2");
    titleElement.classList.add('title');
    titleElement.innerText = note.title;
    let textElement = document.createElement("p");
    textElement.classList.add('text');
    textElement.innerText = note.text;
    // create tags
    let tagsElement = document.createElement("ul");
    tagsElement.classList.add('tags');
    for (const tag of note.tags) {
      if (tag.length > 0) {
        let tagElement = document.createElement("li");
        tagElement.classList.add('tag');
        tagElement.innerText = tag;
        // todo: 
        // add click event with search
        tagsElement.appendChild(tagElement);
      }
    }
    // add removenote button to note
    let removeNoteButton = document.createElement("button");
    removeNoteButton.classList.add('remove-note');
    removeNoteButton.innerText = "X";
    removeNoteButton.onclick = function() {
      removeNote(note.id);
    }

    innerNote.appendChild(titleElement);
    innerNote.appendChild(textElement);
    innerNote.appendChild(tagsElement);
    innerNote.appendChild(removeNoteButton);
    noteElement.appendChild(innerNote);

    sectionElement.appendChild(noteElement);
  }
  let addNotesNode = document.createElement("div");
  addNotesNode.classList.add("note");
  addNotesNode.id = "add-notes";
  addNotesNode.innerText = "+";
  addNotesNode.addEventListener("click", showAddNoteMenu);
  sectionElement.appendChild(addNotesNode);

  // save notes to local storage
  window.localStorage.notes = JSON.stringify(notes, null, 2);;
}

function addNote(text, tags, title = "Note") {
  notes.push(createNote(text, tags, title));
  drawNotes();
}

function removeNote(id) {
  for (let i = 0; i < notes.length; i++) {
    if (notes[i]["id"] === id) {
      notes.splice(i, 1);
      drawNotes();
      return;
    }
  }
}

function updateNote(id, text, tags) {
  for (let i = 0; i < notes.length; i++) {
    if (notes[i]["id"] === id) {
      notes[i]["text"] = text;
      notes[i]["tags"] = tags;
      drawNotes();
    }
  }
}

function showAddNoteMenu(e) {
  // show a menu to create a new note
  e.preventDefault();
  let menu = document.createElement("div");
  menu.classList.add("add-notes-menu");
  let newNoteTitle = document.createElement("input");
  let newNoteText = document.createElement("input");
  let newNoteTags = document.createElement("input");
  let addNoteButton = document.createElement("button");

  newNoteTitle.value = "Note";
  newNoteText.placeholder = "text";
  newNoteTags.placeholder = "tags seperated by comma";
  addNoteButton.innerText = "Add Note";
  addNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (newNoteTitle.value.length > 0 && newNoteText.value.length > 0) {
      addNote(newNoteText.value, newNoteTags.value.split(","), newNoteTitle.value);
      menu.parentNode.removeChild(menu);
    }
  });

  menu.appendChild(newNoteTitle);
  menu.appendChild(newNoteText);
  menu.appendChild(newNoteTags);
  menu.appendChild(addNoteButton);

  document.getElementById('main').appendChild(menu);
}

function exportNotes() {
  // export notes as a JSON file
  let json = JSON.stringify(notes, null, 2);
  let blob = new Blob([json], { type: "application/json" });
  saveAs(blob, "notes.json");
}

function importNotes() {
  // import notes from a JSON file
  var input = document.createElement('input');
  input.type = 'file';
  input.onchange = e => {

    // getting a hold of the file reference
    var file = e.target.files[0];
    // setting up the reader
    var reader = new FileReader();
    reader.readAsText(file,'UTF-8');
    reader.onload = (e) => {
      let json = e.target.result;
      console.log(json);
      notes = JSON.parse(json);
      drawNotes();
    };

  }
  input.click();
}

function saveAs(blob, name) {
  let saveAsLink = document.createElement("a");
  saveAsLink.href = URL.createObjectURL(blob);
  saveAsLink.download = name;
  saveAsLink.click();
}

function exportNotesAsCSV() {
  // export notes as a CSV file
  let csv = notes.map(function(note) {
    return note.title + "~" + note.text + "~" + note.tags.join(",");
  }).join("\n");
  let blob = new Blob([csv], { type: "text/csv" });
  saveAs(blob, "notes.csv");
}

loadNotes();
drawNotes();
