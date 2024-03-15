<template>
  <div class="note-card" @click="navigateToEditPage()">
    <div class="note-content">
    <h3 class="note-title">{{ note.title }}</h3>
    <p class="note-description">{{ note.description }}</p>

    </div>
    <div v-if="note.type === 1" class="note-image">
      <img :src="note.imageUrl" alt="Note" v-if="note.imageUrl">
    </div>
    
    <div v-if="note.type === 2" class="note-checkboxes">
      <div v-for="item in note.checklist" :key="item.id" class="checkbox-item">
        <input type="checkbox" v-model="item.checked">
        <label>{{ item.text }}</label>
      </div>
    </div>
    
    <button @click.stop="openDeleteConfirmation($event)" class="delete-button">Delete</button>

    <div v-if="showConfirmationDialog" class="confirmation-dialog-overlay">
      <div class="confirmation-dialog">
      <p>Are you sure you want to delete this note?</p>
      <button @click="confirmDelete($event)">Confirm</button>
      <button @click="cancelDelete($event)" class="cancel-button">Cancel</button>
      </div>
    </div>

  </div>
</template>


<script>
import router from '@/router';
import { ref } from 'vue';

export default {
  name: 'NoteCard',
  props: {
    note: Object
  },
  setup(props, { emit }) {
    const showConfirmationDialog = ref(false);

    const openDeleteConfirmation = event => {
      event.stopPropagation();
      showConfirmationDialog.value = true;
    };

    const confirmDelete = event => {
      event.stopPropagation();
      emit('deleteNote', props.note.id);
      showConfirmationDialog.value = false;
    };

    const cancelDelete = event => {
      event.stopPropagation();
      showConfirmationDialog.value = false;
    };

    const navigateToEditPage = () => {
      router.push({ name: 'NoteEdit', params: { id: props.note.id } });
    };

    return {
      showConfirmationDialog,
      openDeleteConfirmation,
      confirmDelete,
      cancelDelete,
      navigateToEditPage
    };
  }
};
</script>



<style scoped>

.note-card {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    padding: 20px;
    transition: box-shadow 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    height: 100%;
  }
  
  .note-card:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  }
  
  .note-content { 
    flex-grow: 1; 
  }
  
  .note-content > h3,
  .note-content > p {
    margin: 0 0 10px;
  }

  .note-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .note-description {
    color: #7f8c8d;
    margin-bottom: 1rem;
    line-height: 1.6;
  }
  
  .note-image img {
    max-width: 100%;
    border-radius: 5px;
  }
  
  .note-checkboxes .checkbox-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .checkbox-item input[type="checkbox"] {
    margin-right: 0.5rem; 
  }

  .checkbox-item label {
    margin: 0; 
  }
  
 
.confirmation-dialog-overlay {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000; 
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.confirmation-dialog {
  background: #fff;
  padding: 30px;
  width: auto; 
  max-width: 90%; 
  border: 1px solid #ccc; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); 
  border-radius: 8px;
  width: 300px; 
  text-align: center;
  z-index: 1001; 
}

button {
  padding: 10px 20px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background-color: #e53935; 
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}

button:hover {
  background-color: #ef5350;  
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.delete-button {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px; 
    cursor: pointer;
    margin-top: 10px;
    margin-right: 0.5rem;
    font-weight: bold;
    width: 33%; 
  }
  
  .delete-button:hover {
    background-color: #c0392b;
  }

.cancel-button {
  background-color: #bdc3c7;
}

.cancel-button:hover {
  background-color: #818990;
}

</style>
