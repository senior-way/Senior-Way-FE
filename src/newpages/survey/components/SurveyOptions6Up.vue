<template>
  <div class="grid">
    <button
      v-for="it in items"
      :key="keyOf(it)"
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
import { ref, watch } from 'vue';
const props = defineProps({
  items: {
    type: Array,
    default: () => [
      '자연',
      '역사·문화·예술',
      '먹거리',
      '쇼핑',
      '체험\n액티비티',
      '상관 없음',
    ],
  },
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(['update:modelValue', 'change']);
const sel = ref(new Set(props.modelValue));
watch(
  () => props.modelValue,
  (v) => (sel.value = new Set(v))
);

const keyOf = (it) =>
  typeof it === 'object' ? it.value ?? it.label ?? it.key : it;
const labelOf = (it) =>
  typeof it === 'object' ? it.label ?? String(keyOf(it)) : String(it);
const iconOf = (it) =>
  typeof it === 'object' ? it.icon ?? it.iconSrc ?? null : null;

function toggle(k) {
  const key = keyOf(k);
  const anyKey = keyOf(props.items.find((it) => labelOf(it) === '상관 없음'));
  if (key === anyKey) {
    // '상관 없음' 선택 시 나머지 모두 해제, '상관 없음'만 선택
    if (!sel.value.has(anyKey)) {
      sel.value = new Set([anyKey]);
    } else {
      sel.value.delete(anyKey);
    }
  } else {
    // 다른 항목 선택 시 '상관 없음' 해제
    sel.value.delete(anyKey);
    sel.value.has(key) ? sel.value.delete(key) : sel.value.add(key);
  }
  const arr = [...sel.value];
  emit('update:modelValue', arr);
  emit('change', arr);
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(2, 145px);
  grid-auto-rows: 100px;
  gap: 10px;
  justify-content: center;
}

.tile {
  box-sizing: border-box;
  width: 145px;
  height: 100px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 12px;
  background: var(--color-white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-align: center;
  white-space: pre-line;
  cursor: pointer;
  user-select: none;
}
.tile.on {
  border: 1.5px solid var(--color-primary);
  background: var(--color-primary-10);
}

.icon {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  display: block;
}

.label {
  line-height: 1.3;
}
</style>
