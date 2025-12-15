<script setup>
import { ref } from 'vue';
import BaseButton from './BaseButton.vue';

// Vet inte varför jag kallar det för object istället för props.
const object = defineProps(["id", "name", "rating", "isDubbed"]);
const emit = defineEmits(["requestDeletion", "requestUpdate"]);

// Inmatningsfällt samt de värden som ska visas i tabellen.
const localName = ref(object.name);
const localRating = ref(object.rating);
const localIsDubbed = ref(object.isDubbed);

// Olika texter för knapparna som byts ut automatiskt.
const btnText = ref({
    edit: "Edit",
    delete: "Delete",
    accept: "Accept",
    cancel: "Cancel"
});

// Olika lägen, enbart för att ha accept/cancel när en ändring eller radering ska ske.
const editMode = ref(false);
const deletionMode = ref(false);
const confirmationMode = ref(false);

// Skickar id för radering till moderkomponenten.
function request_deletion() {
    emit("requestDeletion", object.id);
}

// Skickar uppdateringsvärden till moderkomponenten vid lyckad validering. "local"-värdena fås nya värden av det som blivit inmatad för att automatiskt uppdatera komponenten.
function request_update() {
    const validated = validate();

    if (validated.success) {
        emit("requestUpdate", validated.payload);
        localName.value = validated.payload.name;
        localRating.value = validated.payload.rating;
        localIsDubbed.value = validated.payload.isDubbed;
        confirmationMode.value = false; // Lämnar läget.
        editMode.value = false; // Lämnar läget.
    } else {
        const error_message = validated.errors.join("\n"); // Simpelt error meddelande.
        alert(error_message);
    }
}

// Validerar inmatningsfälten.
function validate() {
    const errors = [];

    const name = localName.value.trim();
    const rating = localRating.value;
    const isDubbed = localIsDubbed.value;

    if (name.length < 1 || name.length > 200) {
        errors.push(`A title cannot be shorter than one character, but no longer than 200. Your title is ${name.length}`);
    }

    if (typeof rating !== "number") {
        errors.push(`A rating must be of type number. Your is ${typeof rating}`);
    }

    if (typeof rating === "number" && (rating < 1 || rating > 10)) {
        errors.push(`A rating must be between one and ten. Your rating is ${rating}`);
    }

    if (typeof isDubbed !== "boolean") {
        errors.push(`Dubbed or not must be a boolean (true or false). Your's a ${typeof isDubbed}`);
    }

    if (errors.length > 0) {
        return {
            success: false,
            errors: errors
        };
    } else {
        return {
            success: true,
            payload: {
                id: object.id,
                name: name,
                rating: rating,
                isDubbed: isDubbed
            }
        };
    }
}

// Går in i ett läge där användaren kan avbryta eller utföra handlingen.
function enterConfirmationMode(type) {
    confirmationMode.value = true;
    if (type === "edit") {
        editMode.value = true;
    } else if (type === "delete") {
        deletionMode.value = true;
    } else {
        // Kommer förmodligen inte hända.
        editMode.value = false;
        deletionMode.value = false;
    }
}

// Abryter pågående handling.
function cancel() {
    confirmationMode.value = false;
    editMode.value = false;
    deletionMode.value = false;
    localName.value = object.name;
    localRating.value = object.rating;
    localIsDubbed.value = object.isDubbed;
}

// Vidarbefodrar handlingar.
function action() {
    if (deletionMode.value) {
        request_deletion();
        cancel(); // För att förhindra att man hamnar i det läget för en annan syskonkomponent efter radering.
    } else if (editMode.value) {
        request_update();
    } else {
        // Kommer förmodligen inte hända.
        console.log(`Error editMode(${editMode.value}) deletionMode(${deletionMode.value})`);
        cancel();
    }
}
</script>

<template>
    <tr :class="{ edit: editMode }">
        <td class="w-100">
            <span v-if="!editMode">{{ localName }}</span>
            <textarea v-else name="title" id="title" v-model="localName" class="p-1.5 border"></textarea>
        </td>
        <td class="w-20">
            <span v-if="!editMode">{{ localRating }}</span>
            <input v-else type="number" min="1" max="10" name="rating" id="rating" v-model="localRating" />
        </td>
        <td class="w-25">
            <span v-if="!editMode">{{ localIsDubbed }}</span>
            <select v-else name="isDubbed" id="isDubbed" v-model="localIsDubbed">
                <option :value="false">false</option>
                <option :value="true">true</option>
            </select>
        </td>
        <td class="w-44">
            <div class="flex gap-x-2">
                <BaseButton :text="confirmationMode ? btnText.accept : btnText.edit"
                    @btn-click="confirmationMode ? action() : enterConfirmationMode('edit')"
                    class="p-2 flex-1 bg-sky-200 rounded-2xl" />
                <BaseButton :text="confirmationMode ? btnText.cancel : btnText.delete"
                    @btn-click="confirmationMode ? cancel() : enterConfirmationMode('delete')"
                    class="p-2 flex-1 bg-red-200 rounded-2xl" />
            </div>
        </td>
    </tr>
</template>

<style scoped>
@import "tailwindcss";

.edit {
    background-color: #f8f8f8;
}

@layer base {
    td {
        @apply align-top p-2;
    }

    td>* {
        @apply w-full;
    }

    td:not(:first-child),
    select,
    input {
        @apply text-center;
    }

    input[type="number"],
    select {
        @apply ps-3 border;
    }
}
</style>