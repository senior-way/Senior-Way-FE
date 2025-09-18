<!-- src/newpages/schedule/SavedSchedulesPage.vue -->
<template>
  <main class="page">
    <SimpleHeader title="저장된 일정" />

    <section class="container">
      <div v-if="list.length === 0" class="empty bodyMedium16px">
        저장된 일정이 없습니다.
      </div>

      <template v-else>
        <ul class="cards">
          <SavedScheduleCard
            v-for="it in pageItems"
            :key="it.id"
            :id="it.id"
            :title="it.title"
            :image="it.image"
            :savedAt="it.savedAt"
            :startDate="it.startDate"
            :endDate="it.endDate"
            @open="openDetail"
          />
        </ul>

        <!-- 3개부터 페이지네이션 (2개 이하일 땐 숨김) -->
        <nav
          v-if="showPagination"
          class="pagination"
          aria-label="Saved schedules pages"
        >
          <button
            class="page-btn nav"
            type="button"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ← 이전
          </button>

          <button
            v-for="n in totalPages"
            :key="n"
            class="page-btn"
            :class="{ active: currentPage === n }"
            type="button"
            @click="currentPage = n"
          >
            {{ n }}
          </button>

          <button
            class="page-btn nav"
            type="button"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            다음 →
          </button>
        </nav>
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import SavedScheduleCard from '@/newpages/schedule/components/SavedScheduleCard.vue';
import axios from 'axios';

const router = useRouter();

const list = ref([]);

// 2개 이하면 페이징 없음, 3개부터 페이징 (페이지당 2개)
const pageSize = 2;
const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(list.value.length / pageSize))
);
const showPagination = computed(() => list.value.length >= 3);

const pageItems = computed(() => {
  if (!showPagination.value) return list.value;
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return list.value.slice(start, end);
});

// 리스트 로드 (백엔드에서)
async function loadList() {
  const jwt =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('jwt') ||
    localStorage.getItem('token') ||
    '';
  try {
    const res = await axios.get('http://localhost:8080/api/schedules/list', {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : undefined,
      },
    });
    // 반환값의 각 객체에 id = scheduleId로 매핑
    list.value = Array.isArray(res.data)
      ? res.data.map((item) => ({
          ...item,
          id: item.scheduleId ?? item.id,
          image: item.image ?? ''
        }))
      : [];
    currentPage.value = 1;
  } catch (e) {
    list.value = [];
  }
}

onMounted(loadList);

// 총 페이지 수 변동 시 현재 페이지 보정
watch(totalPages, (n) => {
  if (currentPage.value > n) currentPage.value = n;
});

function openDetail(id) {
  // id는 scheduleId로 들어감
  router.push({ name: 'SavedScheduleDetail', params: { id } });
}
</script>

<style scoped>
.page {
  width: 100%;
  max-width: var(--app-max-width);
  margin: 0 auto;
}
.container {
  padding: 12px 16px 24px;
}
.empty {
  padding: 24px 0;
  text-align: center;
  color: var(--color-mediumgray);
}
.cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
}
.page-btn {
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-black);
  border-radius: 8px;
  cursor: pointer;
}
.page-btn.active {
  border-color: var(--color-primary);
  background: var(--color-primary-10);
  color: var(--color-primary);
}
.page-btn.nav {
  padding: 0 12px;
}
.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
