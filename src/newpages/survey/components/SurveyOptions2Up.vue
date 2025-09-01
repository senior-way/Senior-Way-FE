<template>
  <div class="list">
    <button
      v-for="it in items"
      :key="it"
      class="row bodyMedium20px"
      :class="{ on: selected === it }"
      :aria-pressed="selected === it"
      @click="select(it)"
    >
      <span class="label" v-html="it"></span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: { type: Array, default: () => ['예', '아니오'] },
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue','change'])

const selected = ref(props.modelValue)
watch(() => props.modelValue, v => (selected.value = v))

function select(val) {
  if (selected.value === val) return 
  selected.value = val
  emit('update:modelValue', val)
  emit('change', val)
}
</script>

<style scoped>
.list{
  display:flex; 
  flex-direction:column; 
  gap:12px;
  align-items:center; 
  width:100%;
}

.row{
  width:min(328px, 100%);
  height:154px;
  border:1px solid var(--color-mediumgray);
  border-radius:12px;
  background: var(--color-white);
  display:flex; 
  align-items:center; 
  justify-content:center;
  text-align:center; 
  color: inherit;
}
.row.on{
  border: 1.5px solid var(--color-primary);
  background: var(--color-primary-10);
}

.label{ display:block; width:100%; }

/* 강조 색 */
:deep(.hl.pos){ color: var(--color-blue);}
:deep(.hl.neg){ color: var(--color-red);}
</style>
