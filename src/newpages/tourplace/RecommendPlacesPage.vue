<!-- src/newpages/recommend/RecommendMockPage.vue -->
<template>
  <div class="page">
    <SimpleHeader title="추천 관광지 목록" :withBorder="false" />

    <div class="content">
      <p class="subtitle bodyMedium18px">가고 싶은 관광지를 모두 선택하세요.</p>

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

    <div class="page-footer">
      <div class="footer-inner">
        <button
          class="btn-confirm bodyMedium20px"
          :disabled="selected.length === 0"
          @click="confirm"
        >
          선택 완료<span v-if="selected.length"> ({{ selected.length }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import axios from "axios"
import SimpleHeader from "@/components/layout/SimpleHeader.vue"
import RecommendCard from "@/newpages/tourplace/components/RecommendCard.vue"

const router = useRouter()

const spots = ref([])
const selected = ref([])

function tagByType(tid) {
  const map = { 12: "관광지", 14: "문화시설", 28: "레포츠", 38: "쇼핑", 39: "음식점" }
  return map[tid] || "추천"
}
function buildTags(p) {
  const tags = [tagByType(p.type_id)]
  if (p.isBarrierFree) tags.push("배리어프리")
  return tags
}
function mapPlace(p) {
  return {
    id: p.id,
    name: p.name,
    image: p.image,
    tags: buildTags(p),
  }
}

async function loadSpots() {
  const { data } = await axios.get("/api/tourplace", {
    params: { _sort: "id", _order: "asc", _limit: 50 },
  })
  spots.value = (Array.isArray(data) ? data : []).map(mapPlace)
}

function toggle(id) {
  const i = selected.value.indexOf(id)
  i > -1 ? selected.value.splice(i, 1) : selected.value.push(id)
}

function goDetail(id) {
  router.push({ name: "TourplaceDetailV2", params: { id } })
}

function confirm() {
  if (!selected.value.length) return
  router.push({ name: "SelectedPlacesV2", query: { ids: selected.value.join(",") } })
}

onMounted(loadSpots)
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-footer {
  position: sticky;
  bottom: 0;
  z-index: 10;
  background: #f6f6f6;
}

.footer-inner {
  max-width: var(--app-max-width);
  margin: 0 auto;
  padding: 12px 1.25rem calc(12px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

.btn-confirm {
  display: block;
  width: 100%;
  height: 50px;
  border: 0;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-white);
  transition: var(--transition);
}

.btn-confirm:disabled { opacity: .4; }
</style>
