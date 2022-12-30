"use strict"

const defaultNotes = [{
  "id": 0,
  "title": "Creating Notes:",
  "text": "You can create notes by pressing the + button",
  "tags": ["tutorial", "starter", "default"]
}];

let notes = defaultNotes;
let data = {};

const fakeEvent = {};
fakeEvent.preventDefault = () => {};

function loadNotes() {
  let json = window.localStorage.data;
  data = JSON.parse(json);
  if (!(data.title)) {
    data.title = "Notes";
  }
  if (!(data.title.length > 0)) {
    data.notes = defaultNotes;
  }
}

function clearAllNotes() {
  if (confirm("Do you really want to delete all notes?")) {
    data.notes = defaultNotes;
  }
  drawNotes();
}

function createNote(text, tags, title = "Note") {
  let lastNoteId = 0;
  for(let note of data.notes) {
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

  for (const note of data.notes) {
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
    removeNoteButton.innerText = "✖";
    removeNoteButton.onclick = () => removeNote(note.id);
  
    let editNoteButton = document.createElement("button");
    editNoteButton.classList.add('edit-note');
    editNoteButton.innerText = "✏";
    editNoteButton.onclick = () => showEditNoteMenu(note.id);

    innerNote.appendChild(titleElement);
    innerNote.appendChild(textElement);
    innerNote.appendChild(tagsElement);
    innerNote.appendChild(removeNoteButton);
    innerNote.appendChild(editNoteButton);
    noteElement.appendChild(innerNote);

    sectionElement.appendChild(noteElement);
  }
  let addNotesNode = document.createElement("div");
  addNotesNode.classList.add("note");
  addNotesNode.id = "add-notes";
  addNotesNode.innerText = "+";
  addNotesNode.addEventListener("click", showAddNoteMenu);
  sectionElement.appendChild(addNotesNode);
  document.getElementById('title').value = data.title;

  // save notes to local storage
  window.localStorage.data = JSON.stringify(data, null, 2);;
}

function addNote(text, tags, title = "Note") {
  data.notes.push(createNote(text, tags, title));
  drawNotes();
}

function getNote(id) {
  for (let i = 0; i < data.notes.length; i++) {
    if (data.notes[i]["id"] === id) {
      return data.notes[i];
    }
  }
}

function removeNote(id) {
  for (let i = 0; i < data.notes.length; i++) {
    if (data.notes[i]["id"] === id) {
      data.notes.splice(i, 1);
      drawNotes();
      return;
    }
  }
}

function updateNote(id, title, text, tags) {
  for (let i = 0; i < data.notes.length; i++) {
    if (data.notes[i]["id"] === id) {
      data.notes[i]["title"] = title;
      data.notes[i]["text"] = text;
      data.notes[i]["tags"] = tags;
      drawNotes();
    }
  }
}

function noteInputMenu(callback, title="Note", text="", tags="", buttonText="Add Note") {
  let menu = document.createElement("div");
  menu.classList.add("add-notes-menu");
  let newNoteTitle = document.createElement("input");
  let newNoteText = document.createElement("input");
  let newNoteTags = document.createElement("input");
  let addNoteButton = document.createElement("button");

  newNoteTitle.value = title;
  newNoteText.value = text;
  newNoteTags.value = tags;
  newNoteText.placeholder = "text";
  newNoteTags.placeholder = "tags seperated by comma";
  addNoteButton.innerText = buttonText;
  addNoteButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (newNoteTitle.value.length > 0 && newNoteText.value.length > 0) {
      const text = newNoteText.value;
      const tags = newNoteTags.value.split(",");
      const title = newNoteTitle.value;
      try {
        callback(title, text, tags);
      } catch (error) {
        console.error(error);
      }   
      menu.parentNode.removeChild(menu);
    }
  });

  menu.appendChild(newNoteTitle);
  menu.appendChild(newNoteText);
  menu.appendChild(newNoteTags);
  menu.appendChild(addNoteButton);

  document.getElementById('main').appendChild(menu);
}
function showAddNoteMenu(e) {
  e.preventDefault();
  // show a menu to create a new note
  noteInputMenu((title, text, tags)=>{
    addNote(text, tags, title);
  });
}
function showEditNoteMenu(id) {
  const note = getNote(id);
  noteInputMenu((title, text, tags) => {
    updateNote(id, title, text, tags);
  }, note.title, note.text, note.tags.join(","), "edit Note");
}

function exportNotes() {
  // export notes as a JSON file
  let json = JSON.stringify(data, null, 2);
  let blob = new Blob([json], { type: "application/json" });
  saveAs(blob, `${data.title}.json`);
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
      data = JSON.parse(json);
      drawNotes();
    };

  }
  input.click();
}

function importOldNotes() {
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
      data = {}
      data.notes = JSON.parse(json);
      data.title = 'Notes';
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

function updateTitle() {
  data.title = document.getElementById('title').value;
  drawNotes();
}

loadNotes();
drawNotes();
