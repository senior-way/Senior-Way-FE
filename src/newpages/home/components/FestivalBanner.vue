<!-- src/components/banner/FestivalBanner.vue -->
<template>
  <section
    class="fb-root"
    role="region"
    aria-label="다가오는 축제"
    tabindex="0"
    @keydown="onKey"
    @mouseenter="pauseOnHover && stop()"
    @mouseleave="pauseOnHover && start()"
    @focusin="stop"
    @focusout="start"
  >
    <div class="fb-stage">
      <div
        v-for="(s, i) in slides"
        :key="s.id || i"
        class="fb-slide"
        :class="{ on: i === cur }"
        :aria-hidden="i === cur ? 'false' : 'true'"
        @click="onClick"
      >
        <img class="fb-img" :src="s.img || bannerBack" :alt="s.title" />

        <div class="fb-overlay">
          <div class="fb-texts">
            <h3
              class="fb-title bodyMedium20px"
              v-fitline="{ max: 20, min: 12, step: 0.5 }"
              v-html="s.title"
            />
            <p v-if="s.place" class="fb-place bodyMedium12px" :title="s.place">
              {{ s.place }}
            </p>
            <p v-if="s.dateStr" class="fb-date bodyMedium14px">
              {{ s.dateStr }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="loading || !slides.length" class="fb-empty">
        <span class="bodyMedium14px">
          {{
            loading
              ? '축제 정보를 불러오는 중입니다.'
              : '표시할 축제가 없습니다.'
          }}
        </span>
      </div>
    </div>

    <div v-if="total" class="fb-pager bodyLight12px">{{ indexLabel }}</div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import fitline from '@/directives/fitline';
import bannerBack from '@/assets/images/banner-back.png';
const vFitline = fitline;

const props = defineProps({
  endpoint: { type: String, default: '/api/festivals/upcoming/detail' },
  interval: { type: Number, default: 4000 },
  pauseOnHover: { type: Boolean, default: true },
  linkToDetail: { type: Boolean, default: true },
  mockFallback: { type: Boolean, default: true },
});

const router = useRouter();
const loading = ref(false);
const items = ref([]);
const slides = ref([]);
const cur = ref(0);
let timer = null;

const MOCK = [
  {
    spot: {
      contentId: 'f101',
      title: '광안리 불꽃축제',
      firstimage: 'https://picsum.photos/seed/f101/800/300',
      addr1: '광안리해변',
    },
    detail: {
      contentId: 'f101',
      eventStartDate: '20251010',
      eventEndDate: '20251012',
      eventPlace: '광안리해변 및 수영사적공원',
    },
  },
  {
    spot: {
      contentId: 'f102',
      title: '부산 국제영화제 거리축제',
      firstimage: 'https://picsum.photos/seed/f102/800/300',
      addr1: '영화의전당 일원',
    },
    detail: {
      contentId: 'f102',
      eventStartDate: '20251005',
      eventEndDate: '20251014',
      eventPlace: '',
    },
  },
  {
    spot: {
      contentId: 'f103',
      title: '해운대 빛축제',
      firstimage: 'https://picsum.photos/seed/f103/800/300',
      addr1: '해운대광장',
    },
    detail: {
      contentId: 'f103',
      eventStartDate: '20251201',
      eventEndDate: '20260110',
      eventPlace: '해운대광장 및 구남로 일대',
    },
  },
  {
    spot: {
      contentId: 'f104',
      title: '자갈치 문화축제',
      firstimage: 'https://picsum.photos/seed/f104/800/300',
      addr1: '자갈치시장',
    },
    detail: {
      contentId: 'f104',
      eventStartDate: '20251020',
      eventEndDate: '20251023',
      eventPlace: '자갈치시장 일원',
    },
  },
  {
    spot: {
      contentId: 'f105',
      title: '부산 불빛 퍼레이드',
      firstimage: 'https://picsum.photos/seed/f105/800/300',
      addr1: '광복동',
    },
    detail: {
      contentId: 'f105',
      eventStartDate: '20251102',
      eventEndDate: '20251103',
      eventPlace: '광복로 일대',
    },
  },
];

function ymdToDot(ymd) {
  if (!ymd || ymd.length !== 8) return '';
  const m = ymd.slice(4, 6);
  const d = ymd.slice(6, 8);
  return `${m}.${d}`;
}

function buildSlides(data) {
  return (data || []).map((it) => {
    const spot = it.spot || {};
    const detail = it.detail || {};
    const title = spot.title || detail.title || '축제';
    const img = spot.firstimage || spot.firstImage || spot.firstimage2 || '';
    const s = detail.eventStartDate || '';
    const e = detail.eventEndDate || '';
    const dateStr = s && e ? `${ymdToDot(s)} - ${ymdToDot(e)}` : '';
    // 행사 장소 (detail.eventPlace 우선, 없으면 spot.addr1 폴백)
    const place = (
      detail.eventPlace ||
      detail.eventplace ||
      spot.addr1 ||
      ''
    ).trim();
    const id = spot.contentId || detail.contentId;
    return { id, title, img, dateStr, place };
  });
}

function applyData(data) {
  items.value = Array.isArray(data) ? data : [];
  slides.value = buildSlides(items.value);
  cur.value = 0;
  restart();
}
function applyMock(reason = '') {
  console.warn('[FestivalBanner] using mock fallback:', reason);
  applyData(MOCK);
}

async function load() {
  loading.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/tourist-spot/upcoming-festivals`,
      {
        withCredentials: true,
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    );
    applyData(data);
    if (!slides.value.length && props.mockFallback) applyMock('empty response');
  } catch (e) {
    console.error('[FestivalBanner] load error', e);
    if (props.mockFallback) applyMock('request error');
  } finally {
    loading.value = false;
  }
}

function next() {
  if (!slides.value.length) return;
  cur.value = (cur.value + 1) % slides.value.length;
}
function prev() {
  if (!slides.value.length) return;
  cur.value = (cur.value - 1 + slides.value.length) % slides.value.length;
}
function start() {
  stop();
  if (slides.value.length > 1) timer = setInterval(next, props.interval);
}
function stop() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
function restart() {
  stop();
  start();
}

const total = computed(() => slides.value.length);
const indexLabel = computed(() =>
  total.value ? `${cur.value + 1}/${total.value}` : ''
);

function onClick() {
  if (!props.linkToDetail) return;
  const s = slides.value[cur.value];
  if (s?.id)
    router.push({ name: 'TourplaceDetailV2', params: { id: String(s.id) } });
}
function onKey(e) {
  if (e.key === 'ArrowRight') {
    e.preventDefault();
    next();
  }
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    prev();
  }
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    onClick();
  }
}

onMounted(load);
onBeforeUnmount(stop);
watch(() => props.endpoint, load);
</script>

<style scoped>
.fb-root {
  position: relative;
  width: 100%;
  max-width: 330px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-primary-10);
  outline: none;
}

.fb-stage {
  position: relative;
  width: 100%;
  height: 100%;
}

.fb-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.5s ease;
  cursor: pointer;
}
.fb-slide.on {
  opacity: 1;
}

.fb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.fb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0) 65%);
  display: flex;
  align-items: flex-end;
  padding: 10px 12px;
}

.fb-texts {
  width: 100%;
  color: var(--color-white);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  padding-right: 42px;
}

.fb-title {
  margin: 0 0 2px 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.fb-place {
  margin: 0 0 2px 0;
  opacity: 0.95;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fb-date {
  margin: 0;
  opacity: 0.9;
}

.fb-pager {
  position: absolute;
  right: 8px;
  bottom: 6px;
  padding: 2px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: var(--color-white);
  line-height: 1;
}

.fb-empty {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--color-mediumgray);
}
</style>
