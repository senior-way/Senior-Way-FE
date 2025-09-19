<!-- src/newpages/schedule/SavedScheduleListPage.vue -->
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

        <!-- 4개부터 페이지네이션 (3개 이하일 땐 숨김) -->
        <div v-if="showPagination" class="pagination">
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
          <span class="page-info bodyMedium16px"
            >{{ page }} / {{ totalPages }}</span
          >
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
      </template>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import SimpleHeader from '@/components/layout/SimpleHeader.vue';
import SavedScheduleCard from '@/newpages/schedule/components/SavedScheduleCard.vue';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const list = ref([]);

// 3개 이하면 페이징 없음, 4개부터 페이징 (페이지당 3개)
const pageSize = 3;
const page = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(list.value.length / pageSize))
);
const showPagination = computed(() => list.value.length >= 4);

const pageItems = computed(() => {
  if (!showPagination.value) return list.value;
  const start = (page.value - 1) * pageSize;
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
    const res = await axios.get(`${baseUrl}/schedules/list`, {
      headers: {
        Authorization: jwt ? `Bearer ${jwt}` : undefined,
      },
    });
    // 반환값의 각 객체에 id = scheduleId로 매핑, image는 photoUrl 사용
    list.value = Array.isArray(res.data)
      ? res.data.map((item) => ({
          ...item,
          id: item.scheduleId ?? item.id,
          image: item.photoUrl, // photoUrl을 image로 사용
        }))
      : [];
    page.value = 1;
  } catch (e) {
    list.value = [];
  }
}

async function loadListByEmail(wardEmail) {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.get(`${baseUrl}/schedules/list-by-email`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
      params: { protegeEmail: wardEmail },
    });

    list.value = Array.isArray(res.data)
      ? res.data.map((item) => ({
          ...item,
          id: item.scheduleId ?? item.id,
          image: item.photoUrl, // photoUrl을 image로 사용
        }))
      : [];
    page.value = 1;
  } catch {}
}

onMounted(async () => {
  try {
    const wardEmail = route.query.wardEmail;

    if (wardEmail) {
      await loadListByEmail(wardEmail);
    } else {
      await loadList();
    }
  } catch (e) {
    console.error(e);
    list.value = [];
  }
});

// 총 페이지 수 변동 시 현재 페이지 보정
watch(totalPages, (n) => {
  if (page.value > n) page.value = n;
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

/* 페이지네이션 스타일 - 통일 */
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
