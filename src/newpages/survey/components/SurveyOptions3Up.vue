<template>
  <div class="list3" role="radiogroup" aria-label="전자기기 활용 능력">
    <button
      v-for="it in items" :key="it.key"
      class="row3"
      :class="['lv-' + it.level, { on: selected === it.key }]"
      role="radio"
      :aria-checked="selected === it.key"
      @click="select(it.key)"
    >
      <!-- 상단 배지(上/中/下 - 상/중/하) -->
      <div class="tag bodyBold16px">{{ badge[it.level] }} / {{ it.title }}</div>
      <p class="desc bodyMedium16px" v-html="it.desc"></p>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    default: () => ([
      {
        key: 'high', level: 'high', title: '상',
        desc: '스마트폰을 능숙하게 사용할 수 있습니다. 앱 설치 및 설정을 혼자 할 수 있습니다. 카카오톡, 유튜브, 인터넷 뱅킹 등 다양한 앱을 자주 활용하고 있습니다.'
      },
      {
        key: 'mid', level: 'mid', title: '중',
        desc: '전화/문자/사진 기능 사용이 가능합니다. 카카오톡, 유튜브 등은 익숙하지만 새로운 기능을 사용하는 것은 도움이 필요합니다.'
      },
      {
        key: 'low', level: 'low', title: '하',
        desc: '스마트폰 사용이 서툽니다. 전화/문자/사진 기능 사용이 어렵습니다. 대부분의 상황에서 도움이 필요합니다.'
      },
    ])
  },

  /* 라디오 방식 */
  modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue','change'])

const selected = ref(props.modelValue)
watch(() => props.modelValue, v => (selected.value = v))

function select(key) {
  if (selected.value === key) return
  selected.value = key
  emit('update:modelValue', key)
  emit('change', key)
}

const badge = { high: '上', mid: '中', low: '下' }
</script>

<style scoped>
.list3{
  display:flex; 
  flex-direction:column; 
  gap: 10px;
  align-items:center; 
  width:100%;
}

.row3{
  width: min(300px, 100%);
  height: 100px;
  background: var(--color-white);
  border: 1px solid var(--color-mediumgray);
  border-radius: 12px;
  padding: 6px 12px;
  display: flex; 
  flex-direction: column; 
  gap: 8px;
  text-align: left;
}

.row3.on{
  border: 1.5px solid var(--color-primary);    
  background: var(--color-primary-10);       
}

.tag{
  align-self: left;
  height: 24px; 
  padding: 0 12px;
  border-radius: 999px;
  background: var(--color-lightgray);
  display:flex; 
  align-items:center; 
  justify-content:center;
  padding-top: 4px;
}

.row3.on .tag{
  background: var(--color-primary);
  color: var(--color-white); 
}

.desc{ 
  color: var(--color-black); 
  line-height: 1.1; 
  margin-bottom: 8px;
  letter-spacing: -0.03em;
}
</style>
