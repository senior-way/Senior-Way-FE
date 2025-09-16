<template>
  <div>
    <SimpleHeader title="무장애 관광지 목록" />
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
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import BarrierFreeSearchPanel from '@/newpages/tourplace/components/SearchBar.vue'
import TourplaceCard from '@/newpages/tourplace/components/SearchCard.vue'

const router = useRouter()

const query = ref('')
const items = ref([
  { id: 1,  name: '광안리 해수욕장',      image: 'https://picsum.photos/id/1011/400/250', content_type_id: 12 },
  { id: 2,  name: '송도 해상 케이블카',   image: 'https://picsum.photos/id/1012/400/250', content_type_id: 28 },
  { id: 3,  name: '일제강제동원 역사관',  image: 'https://picsum.photos/id/1013/400/250', content_type_id: 14 },
  { id: 4,  name: '부산시립미술관',       image: 'https://picsum.photos/id/1014/400/250', content_type_id: 14 },
  { id: 5,  name: '감천문화마을',         image: 'https://picsum.photos/id/1015/400/250', content_type_id: 12 },
  { id: 6,  name: '해운대 해수욕장',      image: 'https://picsum.photos/id/1016/400/250', content_type_id: 12 },
  { id: 7,  name: '태종대 유원지',        image: 'https://picsum.photos/id/1018/400/250', content_type_id: 28 },
  { id: 8,  name: '오륙도 스카이워크',    image: 'https://picsum.photos/id/1019/400/250', content_type_id: 28 },
  { id: 9,  name: '부산타워',             image: 'https://picsum.photos/id/1020/400/250', content_type_id: 12 },
  { id: 10, name: '동래읍성',             image: 'https://picsum.photos/id/1021/400/250', content_type_id: 12 },
  { id: 11, name: '광복동 패션거리',      image: 'https://picsum.photos/id/1025/400/250', content_type_id: 38 },
  { id: 12, name: '밀면 맛집',           image: 'https://picsum.photos/id/1035/400/250', content_type_id: 39 },
])

const list = ref(items.value.slice())

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
