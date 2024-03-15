<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-center mb-6">Your Notes App</h1>
    
    <div class="flex justify-center mb-4">
      <select v-model="newNoteType" class="border border-gray-300 p-2 rounded-lg mr-2">
        <option value="0">Default</option>
        <option value="1">Image</option>
        <option value="2">Checkbox</option>
      </select>
      <button 
        class="add-note-button"
        @click="addNote">

        <span class="plus-sign">+</span>New Note
      </button>
    </div>
    
    <div class="notes-grid">
      <NoteCard 
        v-for="note in notes" 
        :key="note.id" 
        :note="note"
        @editNote="editNote"
        @deleteNote="deleteNote" />

        <NoteEdit
          v-if="editingNote" 
          :note = "editingNote"
          :id ="editingNote.id"
          @update-note = "handleUpdateNote"
          />
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import NoteCard from './NoteCard.vue';
import NoteEdit from './NoteEdit.vue';

export default {
  name: 'HomePage',
  components: {
    NoteCard,
    NoteEdit
  },
  setup(_, { emit }) {
    const notes = ref([
      {
        id: 1,
        title: 'Default Note',
        description: 'This is a default note.',
        type: 0
      },
      {
        id: 2,
        title: 'Image Note',
        description: 'This note has an image.',
        imageUrl: 'path_to_some_image', // Replace with an actual image path
        type: 1
      },
      {
        id: 3,
        title: 'Checkbox Note',
        description: 'This note has checkboxes.',
        checklist: [
          { id: 1, text: 'Item 1', checked: false },
          { id: 2, text: 'Item 2', checked: true }
        ],
        type: 2
      }
    ]);
    const nextId = ref(4);
    const newNoteType = ref('0');
    const editingNote = ref(null);

    const loadNotesAndSetNextId = () => {
      const savedNotes = JSON.parse(localStorage.getItem('notes'));
      if (savedNotes) {
        notes.value = savedNotes;
        const highestId = notes.value.reduce((maxId, note) => Math.max(maxId, note.id), 0);
        nextId.value = highestId + 1;
      }
    };

    onMounted(() => {
      loadNotesAndSetNextId();
    });

    const addNote = () => {
      let newNote = {
        id: nextId.value++,
        title: '',
        description: '',
        type: parseInt(newNoteType.value),
        imageUrl: '', // for image notes
        checklist: [] // for checkbox notes
      };
      // Customize note based on type
      if (newNote.type === 0) {
        newNote.title = 'Default Note';
        newNote.description = 'This is a default note';
      } else if (newNote.type === 1) {
        // Set up specific fields for an image note
        newNote.title = 'Image Note';
        newNote.description = 'This is an image note';
        newNote.imageUrl = 'default_image_url'; // Or collect this from user input
      } else if (newNote.type === 2) {
        // Set up specific fields for a checkbox note
        newNote.title = 'Checkbox Note';
        newNote.description = 'This is a checkbox note';
        newNote.checklist = [{ text: 'New Item', checked: false }];
      }

      notes.value.push(newNote);
      nextId.value++;
      saveNotesToLocalStorage();
    };

    const deleteNote = id => {
      notes.value = notes.value.filter(note => note.id !== id);
      saveNotesToLocalStorage();
    };

    const editNote = note => {
      editingNote.value = note;
    };

    const handleUpdateNote = updatedNote => {
      const index = notes.value.findIndex(note => note.id === updatedNote.id);
      if (index !== -1) {
        notes.value.splice(index, 1, updatedNote); // Update the note
        saveNotesToLocalStorage(); // Save changes
        emit('note-updated', true); // Can't emit event in setup
      }
      editingNote.value = null; // Reset the editing note
    };

    const saveNotesToLocalStorage = () => {
      localStorage.setItem('notes', JSON.stringify(notes.value));
    };

    return {
      notes,
      nextId,
      newNoteType,
      editingNote,
      addNote,
      deleteNote,
      editNote,
      handleUpdateNote
    };
  }
};
</script>


<style scoped>




  .add-note-button {
    background-color: #3498db;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .add-note-button:hover {
    background-color: #2980b9;
  }
  
  .notes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .plus-sign {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    background-color: #3498db; 
    color: white; 
    border-radius: 50%; 
    margin-right: 5px; 
    transition: background-color 0.3s;
  }

  

</style>
