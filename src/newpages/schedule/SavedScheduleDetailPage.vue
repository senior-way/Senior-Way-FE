<!-- src/newpages/schedule/SavedScheduleDetail.vue -->
<template>
  <div class="page" v-if="loaded">
    <SimpleHeader :title="title || '저장된 일정'" />

    <main class="timeline" role="list" v-if="groups.length">
      <div class="rail" aria-hidden="true"></div>

      <section
        v-for="(group, idx) in groups"
        :key="group.date"
        class="day"
        role="listitem"
        :aria-label="`${idx + 1}일차`"
      >
        <h2 class="day-label bodyMedium24px">일정 {{ idx + 1 }}일차</h2>

        <div
          v-for="item in group.items"
          :key="`${group.date}-${item.id}-${item.time}`"
          class="entry"
        >
          <time
            class="time bodyMedium16px"
            :datetime="`${group.date}T${item.time}:00`"
          >{{ item.time }}</time>
          <span class="dot" aria-hidden="true"></span>
          <div class="card-col">
            <SpotCard
              :id="item.id"
              :name="item.name"
              :image="item.image"
              @detail="goDetail"
            />
          </div>
        </div>
      </section>
    </main>

    <div v-else class="empty bodyMedium16px">항목이 없습니다.</div>

    <div class="bottom">
      <button class="bar-btn ghost bodyMedium16px" @click="goList">목록으로</button>
      <button class="bar-btn danger bodyMedium16px" @click="askDelete">삭제하기</button>
    </div>

    <NoticeModal
      v-model="confirmOpen"
      title="삭제"
      message="이 일정을 삭제할까요?"
      confirmText="삭제하기"
      @confirm="doDelete"
    />
    <NoticeModal
      v-model="notFoundOpen"
      title="알림"
      message="존재하지 않는 일정입니다."
      confirmText="목록으로"
      @confirm="goList"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import SpotCard from '@/newpages/schedule/components/ScheduleCard.vue'
import NoticeModal from '@/newpages/home/components/NoticeModal.vue'

const route = useRoute()
const router = useRouter()

const title = ref('')
const items = ref([]) // [{id,name,image,date,time}]
const loaded = ref(false)
const confirmOpen = ref(false)
const notFoundOpen = ref(false)

onMounted(() => {
  const id = route.params.id
  const raw = localStorage.getItem(`savedSchedule:${id}`)
  if (!raw) {
    notFoundOpen.value = true
    loaded.value = true
    return
  }
  try {
    const obj = JSON.parse(raw)
    title.value = obj.title || '저장된 일정'
    items.value = Array.isArray(obj.items) ? obj.items : []
  } catch {
    notFoundOpen.value = true
  } finally {
    loaded.value = true
  }
})

const groups = computed(() => {
  const acc = {}
  for (const it of items.value) {
    const d = it.date || '0000-00-00'
    ;(acc[d] ||= []).push(it)
  }
  return Object.entries(acc)
    .sort(([a],[b]) => a.localeCompare(b))
    .map(([date, arr]) => ({
      date,
      items: arr.sort((x, y) => (x.time || '').localeCompare(y.time || ''))
    }))
})

function goDetail(id) {
  if (!id) return
  router.push({ name: 'TourplaceDetailV2', params: { id } })
}

function goList() { router.replace({ name: 'SavedScheduleListV2' }) }
function askDelete() { confirmOpen.value = true }
function doDelete() {
  const id = route.params.id
  localStorage.removeItem(`savedSchedule:${id}`)
  router.replace({ name: 'SavedScheduleListV2' })
}
</script>

<style scoped>
.page{
  width:100%;
  max-width:var(--app-max-width);
  margin:0 auto;
  min-height:100dvh;
  display:flex;
  flex-direction:column;
}

.timeline{
  position:relative;
  z-index:0;
  padding:0 1rem 100px;
  overflow-x:hidden;
}
.rail{
  position:absolute;
  top:0; bottom:0; left:98px;
  width:2px; background:var(--color-lightgray);
  z-index:0;
}

.day{ position:relative; padding-top:8px; }
.day-label{
  padding:6px 32px;
  color:var(--color-black);
  background:var(--color-white);
  margin:0 -1rem;
}

.entry{
  display:grid;
  grid-template-columns:76px 16px minmax(0,1fr);
  align-items:start;
  padding:10px 0;
}

.time{
  text-align:right; color:var(--color-mediumgray);
  padding-right:8px; line-height:1; align-self:start;
}

.dot{
  width:16px; height:16px; border-radius:50%;
  background: var(--color-primary);
  z-index:1;         
  align-self:start; justify-self:center;
}

.card-col{ min-width:0; margin-left:6px; }

.empty{
  padding:24px; text-align:center; color:var(--color-mediumgray);
}

.bottom{
  position:sticky;
  bottom:0;
  background:#f6f6f6;
  padding:12px 1rem calc(12px + env(safe-area-inset-bottom,0px));
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:8px;
  z-index:10;        
}

.bar-btn{
  height:48px;
  border-radius:12px;
  border:1px solid var(--color-mediumgray);
  background:#fff;
  color:var(--color-black);
}
.bar-btn.danger{
  border-color: var(--color-red);
  color: var(--color-red);
}
</style>
