<script setup>
import { onMounted, ref } from 'vue';
import BaseTableRow from './BaseTableRow.vue';
import BaseButton from './BaseButton.vue';

const baseURL = "https://dt193g-animelist.onrender.com";

const localName = ref("");
const localRating = ref(5);
const localIsDubbed = ref(false);

const addButtonText = ref("Add");

const rows = ref([]);

// Hämtar listan från NoSQL databasen genom API:et.
async function getList() {
    try {
        const res = await fetch(`${baseURL}/items`);
        if (!res.ok) {
            throw new Error(`Hämtningen av listan misslyckades: ${res.status}`);
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        alert("Kunde inte hämta listan, troligen för att Render sover: https://dt193g-animelist.onrender.com/ \nAv någon anledning händer detta även när listan är tom. Vet inte varför.");
    }
}

// Laddar in listan till komponenten.
async function loadList() {
    try {
        const list = await getList();
        rows.value = Array.isArray(list) ? list : [];
    } catch (error) {
        console.log(error);
        rows.value = [];
    }
}

// Raderar en titel från databasen.
async function deleteItem(id) {
    try {
        const res = await fetch(`${baseURL}/item/${id}`,
            {
                method: "DELETE"
            }
        );
        if (!res.ok) {
            throw new Error(`Radering misslyckades: ${res.status}`);
        }

    } catch (error) {
        console.log(error);
        alert("Kunde inte radera titeln.");
    }
}

// Filtrerar ut raden med id, istället för att kalla på API:et för att ladda om hela listan. ID kommer från object.id en props för underkomponenten BaseTableRow.
async function filter(id) {
    try {
        await deleteItem(id);
        rows.value = rows.value.filter(row => row.id !== id);
    } catch (error) {
        console.log(error);
    }
}

// Uppdaterar en titeln bereonde på id från data. Data kommer från BaseTableRow.
async function update(data) {
    try {
        const res = await fetch(`${baseURL}/item/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: data.name,
                rating: data.rating,
                isDubbed: data.isDubbed
            })
        });

        if (!res.ok) {
            throw new Error(`Ändring misslyckades: ${res.status}`);
        } else {
            await loadList();
            console.log("Ändring slutförd.");
        }
    } catch (error) {
        console.log(error);
    }
}

// Lägger till en ny post och laddar om listan.
async function postNewTitle() {
    try {
        const validated = validate();
        if (validated.success) {
            const res = await fetch(`${baseURL}/item`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: validated.payload.name,
                    rating: validated.payload.rating,
                    isDubbed: validated.payload.isDubbed
                })
            });

            if (!res.ok) {
                throw new Error(`Lägga till ny post misslyckades: ${res.status}`);
            } else {
                await loadList();
                localName.value = "";
                localRating.value = 5;
                localIsDubbed.value = false;
            }
        }

    } catch (error) {
        console.log(error);
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
                name: name,
                rating: rating,
                isDubbed: isDubbed
            }
        };
    }
}

// Laddar in listan när komponenten laddas in.
onMounted(async () => {
    await loadList();
});

</script>

<template>
    <div class="max-w-[95vw] w-fit overflow-x-auto mx-auto border-l border-r border-b my-10">
        <table class="table min-w-160 w-auto max-w-200 table-auto">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Rating</th>
                    <th>Dubbed</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>

                <BaseTableRow v-for="row in rows" :key="row.id" @request-update="update" @request-deletion="filter"
                    :id="row.id" :name="row.name" :rating="row.rating" :is-dubbed="row.isDubbed" />
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" class="text-2xl border-t">New favorite</td>
                </tr>
                <tr>
                    <td><label for="title_add">Title</label></td>
                    <td><label for="rating_add">Rating</label></td>
                    <td><label for="isDubbed_add">Dubbed</label></td>
                    <td></td>
                </tr>
                <tr>
                    <td>
                        <textarea name="title" id="title_add" placeholder="A title..." v-model="localName" class="p-1.5 border"></textarea>
                    </td>
                    <td>
                        <input type="number" name="rating" id="rating_add" min="1" max="10" v-model="localRating" />
                    </td>
                    <td>
                        <input type="checkbox" name="isDubbed" id="isDubbed_add" v-model="localIsDubbed" />
                    </td>
                    <td>
                        <BaseButton :text="addButtonText" @btn-click="postNewTitle" class="p-2 bg-green-300 rounded-2xl" />
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<style scoped>
@import "tailwindcss";

@layer base {
    td {
        @apply align-top p-2;
    }

    td>* {
        @apply w-full;
    }

    td:not(:first-child),
    input {
        @apply text-center;
    }
    input[type="number"] {
        @apply ps-3 border;
    }
}
</style>