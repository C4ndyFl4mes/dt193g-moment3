<script setup>
const emit = defineEmits(["btnClick"]);
const { text } = defineProps(["text"]);

function btnClick() {
    emit("btnClick");
}
</script>

<template>
    <button type="button" class="cursor-pointer" @click="btnClick">{{ text }}</button>
</template>

<style scoped></style>