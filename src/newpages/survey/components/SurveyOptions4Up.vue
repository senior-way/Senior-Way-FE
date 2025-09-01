<template>
  <div class="grid">
    <button
      v-for="it in items" :key="keyOf(it)"
      class="tile bodyMedium24px"
      :class="{ on: sel.has(keyOf(it)) }"
      @click="toggle(it)"
      :aria-pressed="sel.has(keyOf(it))"
    >
      <img v-if="iconOf(it)" :src="iconOf(it)" alt="" class="icon" />
      <span class="label">{{ labelOf(it) }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  items: { type: Array, default: () => ['A','B','C','D'] }, 
  modelValue: { type: Array, default: () => [] }
})
const emit = defineEmits(['update:modelValue','change'])
const sel = ref(new Set(props.modelValue))
watch(() => props.modelValue, v => sel.value = new Set(v))

const keyOf = it => typeof it === 'object' ? (it.value ?? it.label ?? it.key) : it
const labelOf = it => typeof it === 'object' ? (it.label ?? String(keyOf(it))) : String(it)
const iconOf  = it => typeof it === 'object' ? (it.icon ?? it.iconSrc ?? null) : null

function toggle(it){
  const k = keyOf(it)
  sel.value.has(k) ? sel.value.delete(k) : sel.value.add(k)
  const arr = [...sel.value]
  emit('update:modelValue', arr)
  emit('change', arr)
}
</script>

<style scoped>
.grid{
  display: grid;
  grid-template-columns: repeat(2, 145px);
  grid-auto-rows: 155px;
  gap: 10px;
  justify-content: center;
}

.tile{
  width: 145px;
  height: 155px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 12px;
  background: var(--color-white);
  display: flex;
  flex-direction: column;     
  align-items: center;
  justify-content: center;    
  gap: 10px;                    
  text-align: center;
  white-space: normal;
  cursor: pointer;
}
.tile .icon{
  width: 3.5rem;
  height: 3.5rem;
  margin-bottom: 4px;
  object-fit: contain;
  display: block;
}
.tile .label{
  line-height: 1.3;
}
.tile.on{
  border: 1.5px solid var(--color-primary);
  background: var(--color-primary-10);
}
</style>
