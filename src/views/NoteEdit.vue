<template>
  <div v-if= "note" class="edit-container">
    <h2 class="edit-title">Edit Note</h2>
    
    <form @submit.prevent="saveNote" class="edit-form">
      <label for="note-title" class="edit-label">Title:</label>
      <input id="note-title" v-model="note.title" type="text" class="edit-input" placeholder="Note Title" />
      
      <label for="note-description" class="edit-label">Description:</label>
      <textarea id="note-description" v-model="note.description" class="edit-textarea" placeholder="Note Description"></textarea>
      
      <div v-if="note.type === 1" class="image-upload-container">
        <input type="file" @change="handleImageUpload" accept="image/*" class="image-upload-input" />
        <img :src="note.imageUrl" alt="Note Image" class="note-image-preview" v-if="note.imageUrl">

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      </div>

      <div v-if="note.type === 2" class="checklist-container">
        <label class="checklist-label">Checklist:</label>
        <div v-for="(item, index) in note.checklist" :key="index" class="checklist-item">
          <input type="checkbox" v-model="item.checked" class="checklist-checkbox" />
          <input v-model="item.text" class="checklist-input" />
          <button type="button" @click="removeChecklistItem(index)" class="remove-item">Remove</button>
        </div>
        <button type="button" @click="addChecklistItem" class="add-item">Add Item</button>
      </div>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button type="submit" @click="saveNote" class="save-changes-button">Save Changes</button>
    </form>
  </div>
</template>

<script>
import router from '@/router';
import { ref, onMounted } from 'vue';

export default {
  name: 'NoteEdit',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const note = ref(null);
    const errorMessage = ref('');

    const fetchNote = () => {
      const savedNotes = JSON.parse(localStorage.getItem('notes'));
      if (savedNotes) {
        const noteToEdit = savedNotes.find(n => n.id.toString() === props.id);
        if (noteToEdit) {
          note.value = noteToEdit;
        }
      }
    };

    const handleImageUpload = event => {
      const file = event.target.files[0];
      if (!file.type.startsWith('image/')) {
        errorMessage.value = 'Please upload an image file.';
        return;
      } else {
        errorMessage.value = '';
        const reader = new FileReader();
        reader.onload = e => {
          note.value.imageUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };

    const addChecklistItem = () => {
      if (!note.value.checklist) {
        note.value.checklist = [];
      }
      note.value.checklist.push({ text: '', checked: false });
    };

    const removeChecklistItem = index => {
      note.value.checklist.splice(index, 1);
    };

    const saveNote = () => {

      if (!note.value.title || !note.value.description) {
        errorMessage.value = 'Title and description are required.';
        return;
      }

      const notes = JSON.parse(localStorage.getItem('notes')) || [];
      const noteIndex = notes.findIndex(n => n.id === note.value.id);
      if (noteIndex !== -1) {
        notes.splice(noteIndex, 1, note.value);
      }

      localStorage.setItem('notes', JSON.stringify(notes));

      router.push('/'); 
    };

    onMounted(() => {
      fetchNote();
    });

    return {
      note,
      errorMessage,
      handleImageUpload,
      addChecklistItem,
      removeChecklistItem,
      saveNote
    };
  }
};
</script>


<style scoped>




.edit-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background: #f7f7f7;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.checklist-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}


.checklist-item input[type="checkbox"] {
  margin-right: 0.5rem; 
}

.checklist-item input[type="text"] {
  flex-grow: 1; 
  margin-left: 10px;
  
}

button {
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 4px;
  color: white;
  background-color: #3498db;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

button[type="submit"] {
  margin-top: 20px;
  background-color: #2ecc71;
}

button[type="submit"]:hover {
  background-color: #27ae60;
}

button.remove-item {
  background-color: #e74c3c;
  margin-left: 10px;
}

button.remove-item:hover {
  background-color: #c0392b;
}

.error-message {
  color: #e53935; 
  margin-top: 10px;
}

</style>
