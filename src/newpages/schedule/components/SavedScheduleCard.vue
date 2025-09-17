<template>
  <li class="card">
    <button class="card-main" type="button" @click="$emit('open', id)">
      <div v-if="mainImage" class="cover">
        <img :src="mainImage" :alt="title || '대표 이미지'" />
      </div>

      <!-- 제목 + 우측 배지 한 줄 -->
      <div class="header-row">
        <h3 class="title bodyBold20px">
          {{ title || '제목 없음' }}
        </h3>
        <span
          v-if="nightsDaysText"
          class="badge badge-primary bodyMedium14px"
        >
          {{ nightsDaysText }}
        </span>
      </div>

      <!-- 저장일(아래 줄) -->
      <p v-if="savedAt" class="meta bodyMedium14px">
        저장: {{ savedAtText }}
      </p>
    </button>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, default: '' },
  items: { type: Array, default: () => [] },
  savedAt: { type: [Number, String, Date], default: null },
  startDate: { type: [String, Number, Date], default: null },
  endDate: { type: [String, Number, Date], default: null },
})
defineEmits(['open'])

const mainImage = computed(() => {
  const arr = Array.isArray(props.items) ? props.items : []
  const found = arr.find(it => it && it.image)
  return found ? found.image : ''
})

const nightsDaysText = computed(() => {
  let days = 0
  if (props.startDate && props.endDate) {
    const s = new Date(props.startDate)
    const e = new Date(props.endDate)
    if (!isNaN(s) && !isNaN(e)) {
      const sd = new Date(s.getFullYear(), s.getMonth(), s.getDate())
      const ed = new Date(e.getFullYear(), e.getMonth(), e.getDate())
      const diff = Math.round((ed - sd) / 86400000)
      days = diff + 1
    }
  }
  if (!days) {
    const dates = Array.from(new Set((props.items || []).map(it => it?.date).filter(Boolean)))
    days = dates.length
  }
  if (!days) return ''
  const nights = Math.max(0, days - 1)
  return nights === 0 ? '당일치기' : `${nights}박 ${days}일`
})

const savedAtText = computed(() => {
  if (!props.savedAt) return ''
  try {
    const d = new Date(props.savedAt)
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const hh = String(d.getHours()).padStart(2, '0')
    const mi = String(d.getMinutes()).padStart(2, '0')
    return `${d.getFullYear()}.${mm}.${dd} ${hh}:${mi}`
  } catch { return '' }
})
</script>

<style scoped>
.card{
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  background: #fff;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  padding: 12px;
}

.card-main{
  border: 0;
  background: transparent;
  text-align: left;
  padding: 0;
  cursor: pointer;
  display: grid;
  gap: 10px;
}

.cover{
  width: 100%;
  height: 144px;
  border-radius: 10px;
  overflow: hidden;
}
.cover img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 제목 + 배지 한 줄 정렬 */
.header-row{
  display: flex;
  align-items: center;
  gap: 8px;
}
.title{
  margin: 0;
  color: var(--color-black);
  letter-spacing: -0.03em;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta{
  margin: 0;
  color: var(--color-mediumgray);
}

.badge{
  flex: 0 0 auto;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-mediumgray);
  line-height: 1;
}
.badge-primary{
  border-color: var(--color-primary);
  background: var(--color-primary-10);
  color: var(--color-primary);
}
</style>
