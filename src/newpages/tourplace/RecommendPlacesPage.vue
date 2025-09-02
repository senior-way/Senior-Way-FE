<!-- src/newpages/recommend/RecommendMockPage.vue -->
<template>
  <div class="page">
    <SimpleHeader title="추천 관광지 목록" :withBorder="false" />

    <div class="content">
      <p class="subtitle bodyMedium18px">
        가고 싶은 관광지를 모두 선택하세요.
      </p>

      <div class="list">
        <RecommendCard
          v-for="spot in spots"
          :key="spot.id"
          :id="spot.id"
          :name="spot.name"
          :image="spot.image"
          :tags="spot.tags"
          :selected="selected.includes(spot.id)"
          @toggle="toggle"
          @detail="goDetail"
        />
      </div>
    </div>

    <div class="bottom-bar">
      <div class="bottom-inner">
        <button
          class="btn-confirm bodyMedium20px"
          :disabled="selected.length===0"
          @click="confirm"
        >
          선택 완료<span v-if="selected.length"> ({{ selected.length }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import RecommendCard from '@/newpages/tourplace/components/RecommendCard.vue'

const router = useRouter()

const spots = ref([
  { id: 4, name: '성산일출봉', image: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=1200&auto=format&fit=crop', tags: ['일출','트레킹','유네스코','오름'] },
  { id: 3, name: '해운대 해수욕장', image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop', tags: ['해변','산책','일몰','맛집'] },
  { id: 1, name: '경복궁', image: 'https://images.unsplash.com/photo-1535189043414-47a3c49a0bed?q=80&w=1200&auto=format&fit=crop', tags: ['궁궐','한옥','역사','도심'] },
  { id: 2, name: '송도 해상 케이블카', image: 'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop', tags: ['케이블카','바다뷰','스릴','야경'] }
])

const selected = ref([])

function toggle(id) {
  const i = selected.value.indexOf(id)
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(id)
}
function goDetail(id) {
  router.push({ name: 'TourplaceDetailV2', params: { id } })
}
function confirm() {
  if (!selected.value.length) return
  console.log('[선택된 장소 ID]', selected.value)
  alert(`선택된 장소: ${selected.value.join(', ')}`)
}
</script>

<style scoped>
.content {
  padding: 0 1.25rem;
}

.page {
  width: 100%;
  max-width: var(--app-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
  /* 하단바(버튼 48px + 상하 패딩 12px) + 안전영역 만큼만 여유 */
 padding-bottom: calc(
    48px + max(16px, env(safe-area-inset-bottom, 0px))
  );
}

.subtitle {
  background: var(--color-primary-10);
  color: var(--color-primary);
  text-align: center;
  letter-spacing: -0.03em;
  padding: 8px 0;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0; /* 화면 하단 밀착 */
  background: #f5f5f5;
  padding:
    12px
    0
    max(6px, env(safe-area-inset-bottom, 0px)); /* 상/좌우/하 패딩 */
}

.bottom-inner {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 0 1.25rem; /* 내용은 본문과 동일 여백 유지 */
}

.btn-confirm {
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  transition: var(--transition);
}
.btn-confirm:disabled {
  opacity: 0.4;
}
</style>
