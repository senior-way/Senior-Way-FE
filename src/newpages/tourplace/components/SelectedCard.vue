<template>
  <li class="item">
    <img :src="image" :alt="name" class="thumb" />
    <div class="meta">
      <div class="name bodyBold22px">{{ name }}</div>
    </div>
    <button type="button" class="remove-btn" aria-label="삭제" @click.stop="emit('remove', id)">
      <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
        <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
  </li>
</template>

<script setup>
const props = defineProps({
  id:    { type: [Number, String], required: true },
  name:  { type: String, required: true },
  image: { type: String, required: true }
})
const emit = defineEmits(['remove'])
</script>

<style scoped>
.item {
  width: 100%;
  display: grid;
  grid-template-columns: 88px 1fr auto;
  align-items: center;
  gap: 12px;
  background: var(--color-white);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,.06);
}

.thumb {
  width: 88px;
  height: 88px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.meta { display: flex; align-items: center; }
.name { color: var(--color-black); letter-spacing: -0.02em; }

.remove-btn {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 1px solid var(--color-lightgray);
  background: var(--color-white);
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.remove-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }

.icon { width: 16px; height: 16px; }
</style>
