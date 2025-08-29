<!-- src/components/input/TextInput.vue -->
<template>
  <div class="text-input" :class="{ select: isSelect }">
    <!-- 라벨: 슬롯로 주면 <em> 강조색 적용 -->
    <label class="label bodyBold24px" :for="inputId">
      <slot name="label">{{ label }}</slot>
    </label>

    <div class="input-wrap" :class="{ select: isSelect }">
      <!-- text / email -->
      <input
        v-if="as === 'text' || as === 'email'"
        class="input bodyMedium20px"
        :id="inputId"
        :type="as"
        :placeholder="placeholder"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
      />

      <!-- select -->
      <select
        v-else
        class="input bodyMedium20px"
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.value)"
      >
        <option v-if="placeholder" disabled value="">{{ placeholder }}</option>
        <option
          v-for="opt in normalizedOptions"
          :key="opt.value"
          :value="opt.value"
        >
          {{ opt.label }}
        </option>
      </select>

      <div class="underline" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  as: { type: String, default: 'text' }, // 'text' | 'email' | 'select'
  options: { type: Array, default: () => [] }, // select 전용: ['A','B'] 또는 [{label,value}]
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  accent: { type: String, default: 'var(--color-primary)' },
  id: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const inputId = computed(() => props.id || `ti-${Math.random().toString(36).slice(2, 8)}`)
const isSelect = computed(() => props.as === 'select')
const normalizedOptions = computed(() =>
  props.options.map(o => (typeof o === 'string' ? { label: o, value: o } : o))
)
</script>

<style scoped>
.text-input {
  --accent: v-bind(accent);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* 단어 기준 줄바꿈 + 2줄 클램프 */
.label {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  word-break: keep-all;
  overflow-wrap: anywhere;
}

/* 라벨 강조 단어(<em>) 컬러 */
.label :deep(em) {
  color: var(--accent);
  font-style: normal;
}

/* 인풋 + 언더라인 */
.input-wrap {
  position: relative;
  background: var(--color-white, #ffffff);
}

/* 공통 컨트롤 스타일(text/email/select) */
.input {
  width: 100%;
  height: 44px;
  padding: 8px 12px;
  border: none;
  outline: none;
  background: #ffffff;
  color: var(--color-black, #111111);
  appearance: none; /* select 기본 화살표 제거(브라우저별 다름) */
}

/* select 전용: 우측 화살표(간단 CSS 삼각형) */
.input-wrap.select::after {
  content: '';
  position: absolute;
  right: 10px;
  top: 50%;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 7px solid var(--color-mediumgray);
  transform: translateY(-10%);
  pointer-events: none;
}
.text-input.select .input {
  padding-right: 32px; /* 화살표 자리 확보 */
}

/* 하단 굵은 언더라인 (항상 표시) */
.underline {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px; 
  background: var(--accent);
  border-radius: 2px;
}

/* 비활성 표시(옵션) */
.input:disabled {
  color: var(--color-mediumgray);
}
</style>
