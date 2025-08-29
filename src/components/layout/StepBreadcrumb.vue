<template>
  <nav class="sw-steps" aria-label="회원가입 단계">
    <ol class="sw-list" :style="{ '--sw-count': steps.length }">
      <li v-for="(s, i) in steps" :key="s.key ?? i" class="sw-item">
        <button
          class="sw-cell"
          :class="{
            'is-active': currentIndex === i,
            'is-clickable': clickable && isStepEnabled(i)
          }"
          :disabled="!(clickable && isStepEnabled(i))"
          :aria-current="currentIndex === i ? 'step' : undefined"
          @click="onClick(i, s)"
        >
          <span
            class="sw-label"
            :class="currentIndex === i ? 'bodyBold16px' : 'bodyMedium14px'"
            :style="{
              color: currentIndex === i ? 'var(--color-black)' : 'var(--color-mediumgray)'
            }"
          >
            {{ s.label }}
          </span>
        </button>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  steps: { type: Array, required: true },              
  current: { type: [Number, String], required: true }, 
  clickable: { type: Boolean, default: true },
})
const emit = defineEmits(['update:current', 'step-click'])

const currentIndex = computed(() => {
  if (typeof props.current === 'number') return props.current
  const idx = props.steps.findIndex(s => s.key === props.current)
  return idx < 0 ? 0 : idx
})
function isStepEnabled(i) {
  return i <= currentIndex.value && !props.steps[i]?.locked
}
function onClick(i, step) {
  if (!(props.clickable && isStepEnabled(i))) return
  emit('update:current', step.key ?? i)
  emit('step-click', { index: i, step })
}
</script>

<style scoped>
.sw-list{
  width: 326px;                 
  height: 50px;               
  display: flex;
  padding: 0; margin: 0; list-style: none;
}

.sw-item + .sw-item { margin-left: -1px; }

.sw-cell{
  box-sizing: border-box;
  width: 66px;        
  min-width: 66px;            
  max-width: 66px;            
  height: 100%;
  display: grid; place-items: center;
  padding: 0;
  background: #fff;
  border: 1px solid var(--color-mediumgray);
  position: relative; z-index: 1;
  cursor: default;
}

.sw-cell.is-active{
  z-index: 3;
  border-color: var(--color-primary);
  background: var(--color-primary-10);
}

.sw-cell > .sw-label{
  letter-spacing: -0.03em; 
  text-align: center;
  line-height: 1.15;
  word-break: keep-all;
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  max-width: 64px;        
}

/* 인터랙션(선택 아님) */
.sw-cell.is-clickable { cursor: pointer; }
.sw-cell.is-clickable:hover:not(.is-active){
  filter: brightness(0.98);
  z-index: 2;
}

</style>
