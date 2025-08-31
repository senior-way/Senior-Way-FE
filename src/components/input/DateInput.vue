<template>
  <div class="wheel-date">
    <label class="label bodyBold24px" :for="displayId">
      <slot name="label">{{ label }}</slot>
    </label>

    <button
      :id="displayId"
      type="button"
      class="display bodyMedium20px"
      :disabled="disabled"
      @click="open"
    >
      {{ displayText || placeholder }}
    </button>
    <div class="underline" />

    <van-popup v-model:show="show" position="bottom" round :safe-area-inset-bottom="true">
      <van-date-picker
        class="date-picker bodyMedium20px"
        v-model="inner"
        :title="title"
        :columns-type="['year','month','day']"
        :min-date="minDateObj"
        :max-date="maxDateObj"
        :option-height="64"
        :visible-option-num="5"
        :formatter="formatColumn"
        confirm-button-text="확인"
        cancel-button-text="취소"
        @confirm="onConfirm"
        @cancel="show = false"
      />
    </van-popup>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '1965-01-01' },
  min: { type: String, default: '1900-01-01' },
  max: { type: String, default: new Date().toISOString().slice(0,10) },
  title: { type: String, default: '생년월일 선택' },
  disabled: { type: Boolean, default: false },
  accent: { type: String, default: 'var(--color-primary)' },
  start: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const show = ref(false)
const displayId = `wdi-${Math.random().toString(36).slice(2,8)}`
const inner = ref(['2000','1','1'])
const displayText = computed(() => props.modelValue)

function toDate(str){
  const [y,m,d] = (str || '').split('-').map(Number)
  return new Date(y || 1900, (m || 1) - 1, d || 1)
}
const minDateObj = computed(() => toDate(props.min))
const maxDateObj = computed(() => toDate(props.max))

function clampToRange(date){
  const min = minDateObj.value
  const max = maxDateObj.value
  if (date < min) return min
  if (date > max) return max
  return date
}

function open(){
  if (props.disabled) return
  let base
  if (props.modelValue) base = toDate(props.modelValue)
  else if (props.start) base = toDate(props.start)
  else base = new Date()
  const c = clampToRange(base)
  inner.value = [String(c.getFullYear()), String(c.getMonth()+1), String(c.getDate())]
  show.value = true
}

function onConfirm(payload) {
  const values = Array.isArray(payload) ? payload : payload?.selectedValues
  if (!values) { show.value = false; return }
  let [y, m, d] = values.map(Number)
  const end = new Date(y, m, 0).getDate()
  if (d > end) d = end
  const c = clampToRange(new Date(y, m - 1, d))
  const next = `${c.getFullYear()}-${String(c.getMonth()+1).padStart(2,'0')}-${String(c.getDate()).padStart(2,'0')}`
  emit('update:modelValue', next)
  show.value = false
}

function formatColumn(type, option) {
  const v = option.value
  if (type === 'year')  option.text = `${v}년`
  if (type === 'month') option.text = `${v}월`
  if (type === 'day')   option.text = `${v}일`
  return option
}
</script>

<style scoped>
.wheel-date{
  --accent: v-bind(accent);
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label :deep(em){ color: var(--accent); font-style: normal; }

.display{
  width: 100%;
  height: 44px;
  padding: 8px 12px;
  text-align: left;
  background: #fff;
  color: var(--color-black, #111);
  border: none;
  outline: none;
  cursor: pointer;
}

.underline{
  height: 6px;
  background: var(--accent);
  border-radius: 2px;
}

.display:disabled{ color: var(--color-mediumgray); cursor: not-allowed; }

.date-picker :deep(.van-picker-column__item),
.date-picker :deep(.van-picker__title),
.date-picker :deep(.van-picker__confirm),
.date-picker :deep(.van-picker__cancel){
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  font-weight: inherit;
}

.date-picker :deep(.van-picker__toolbar){
  padding-top: 12px;
  padding-bottom: 12px;
}

.date-picker :deep(.van-picker__title){
  margin: 4px 0;
}
</style>
