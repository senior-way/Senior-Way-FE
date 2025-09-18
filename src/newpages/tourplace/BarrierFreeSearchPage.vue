<template>
  <div>
    <SimpleHeader title="무장애 관광지" />
    <div class="page">
      <section class="panel">
        <BarrierFreeSearchPanel
          v-model="query"
          :items="items"
          :useWebSpeech="true"
          @filter="onFilter"
          @voice="onVoice"
        />
      </section>

      <div class="divider" aria-hidden="true"></div>

      <ul class="card-list">
        <li v-for="p in pagedList" :key="p.id" class="card-item">
          <TourplaceCard
            :id="p.id"
            :name="p.name"
            :image="p.image"
            @detail="goDetail"
          />
        </li>
      </ul>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button
          type="button"
          class="page-btn bodyMedium16px"
          :disabled="page === 1"
          @click="page = 1"
        >
          처음
        </button>
        <button
          type="button"
          class="page-btn bodyMedium16px"
          :disabled="page === 1"
          @click="page--"
        >
          이전
        </button>
        <span class="page-info bodyMedium16px">{{ page }} / {{ totalPages }}</span>
        <button
          type="button"
          class="page-btn bodyMedium16px"
          :disabled="page === totalPages"
          @click="page++"
        >
          다음
        </button>
        <button
          type="button"
          class="page-btn bodyMedium16px"
          :disabled="page === totalPages"
          @click="page = totalPages"
        >
          마지막
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import BarrierFreeSearchPanel from '@/newpages/tourplace/components/SearchBar.vue'
import TourplaceCard from '@/newpages/tourplace/components/SearchCard.vue'

const router = useRouter()

const query = ref('')
const items = ref([]) // 초기엔 빈 배열
const list = ref([])

async function loadItems() {
  try {
    const { data } = await axios.get('http://localhost:8080/api/tourist-spot/barrier-free', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    // 필드명 변환 (API → 컴포넌트 props 맞추기)
    const mapped = data.map(item => ({
      id: item.contentId,
      name: item.title,
      image: item.firstImage || 'https://via.placeholder.com/400x250?text=No+Image',
      content_type_id: item.contentTypeId,
    }))
    items.value = mapped
    list.value = mapped.slice()
  } catch (err) {
    console.error('무장애 관광지 목록 불러오기 실패:', err)
    items.value = []
    list.value = []
  }
}

function onFilter(result) {
  list.value = result
  page.value = 1
}

function goDetail(id) {
  router.push({ name: 'TourplaceDetailV2', params: { id } })
}

function onVoice() {
  console.log('Voice button clicked (fallback)')
}

/* 페이지네이션 */
const page = ref(1)
const pageSize = 5
const totalPages = computed(() => Math.ceil(list.value.length / pageSize))
const pagedList = computed(() => {
  const start = (page.value - 1) * pageSize
  return list.value.slice(start, start + pageSize)
})

onMounted(() => {
  loadItems()
})

</script>

<style scoped>
.page {
  margin: 0 1rem;
}

.card-list {
  list-style: none;
  padding: 0.75rem 0;
  margin: 0;
  display: grid;
  gap: 12px;
}
.card-item { min-width: 0; }

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
  margin: 8px 0 16px;
}

.page-btn {
  padding: 6px 10px;
  border: 1px solid var(--color-mediumgray);
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  min-width: 40px;
  text-align: center;
}
</style>
