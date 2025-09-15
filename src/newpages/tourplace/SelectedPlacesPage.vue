<!-- src/newpages/plan/SelectedPlacesPage.vue -->
<template>
  <div class="page">
    <SimpleHeader title="선택한 관광지" :withBorder="false" />

    <div class="content">
      <p class="subtitle bodyMedium20px">선택한 관광지를 확인해주세요.</p>

      <ul class="list" v-if="items.length">
        <SelectedCard
          v-for="p in items"
          :key="p.id"
          :id="p.id"
          :name="p.name"
          :image="p.image"
          @remove="removeItem"           
        />
      </ul>

      <div v-else class="empty bodyMedium16px">아직 선택한 관광지가 없어요.</div>
    </div>

    <BottomDualButtons
      left-label="다시 선택"
      right-label="선택 완료 일정 생성"
      :right-disabled="!items.length || loading"
      @left="goBack"
      @right="createPlan"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import SelectedCard from '@/newpages/tourplace/components/SelectedCard.vue'
import BottomDualButtons from '@/newpages/tourplace/components/DualButton.vue'

const route = useRoute()
const router = useRouter()
const items = ref([])
const loading = ref(false)

function parseIds(q) {
  const raw = String(q ?? '')
  const arr = raw.split(',').map(s => Number(String(s).trim())).filter(Number.isFinite)
  return Array.from(new Set(arr))
}

async function fetchSelected(ids) {
  if (!ids.length) { items.value = []; return }
  try {
    const { data } = await axios.get('/api/tourplace', {
      params: { id: ids },
      paramsSerializer: (params) => {
        const usp = new URLSearchParams()
        ;(params.id || []).forEach(v => usp.append('id', String(v)))
        return usp.toString()
      }
    })
    const list =
      Array.isArray(data) ? data :
      Array.isArray(data?.items) ? data.items :
      Array.isArray(data?.data) ? data.data : []
    const want = new Set(ids.map(Number))
    items.value = list.map(p => ({ ...p, id: Number(p.id) })).filter(p => want.has(p.id))
  } catch (e) {
    console.error('선택 관광지 로딩 실패:', e)
    items.value = ids.map(id => ({ id, name: `선택한 장소 #${id}`, image: '' }))
  }
}

watch(() => route.query.ids, (val) => { fetchSelected(parseIds(val)) }, { immediate: true })

function removeItem(id) {
  const n = Number(id)
  items.value = items.value.filter(p => p.id !== n)

  const ids = items.value.map(p => p.id).join(',')
  const nextQuery = { ...route.query }
  if (ids) nextQuery.ids = ids
  else delete nextQuery.ids
  router.replace({ query: nextQuery })
}

async function createPlan () {
  loading.value = true
  try {
    const id = Date.now().toString()
    router.push({ name: 'PlanResultV2', params: { id } })
  } finally {
    loading.value = false
  }
}
function goBack () { router.back() }
</script>

<style scoped>
.page {
  width: 100%;
  max-width: var(--app-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1;
  padding: 0 1.25rem;
}
.subtitle {
  background: var(--color-primary-10);
  color: var(--color-primary);
  text-align: center;
  letter-spacing: -0.03em;
  padding: 8px 0;
  border-radius: 6px;
  margin-bottom: .625rem;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.list > * { width: 100%; }
.empty { margin-top: 12px; color: var(--color-mediumgray); text-align: center; }
</style>
