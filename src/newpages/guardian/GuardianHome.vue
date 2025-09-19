<!-- src/newpages/guardian/GuardianHomePage.vue -->
<template>
  <main class="page">
    <section class="container">
      <div class="list">
        <BigIconCardBtn
          :icon="icons.connect"
          :title="linkTitle"
          desc="연동하고자 하는 사용자의 이메일을 입력한 뒤, 승인 과정을 진행합니다."
          variant="primary"
          :disabled="linkBtnDisabled"
          :icon-opacity="0.8"
          @click="openLinkModal"
          :class="{ 'is-grayscale': linked }"
        />

        <BigIconCardBtn
          :icon="icons.schedule"
          title="사용자 일정 확인"
          desc="연동된 사용자가 저장한 모든 일정을 확인할 수 있습니다."
          variant="red"
          @click="goSchedule"
        />

        <BigIconCardBtn
          :icon="icons.location"
          title="사용자 위치 확인"
          desc="연동된 사용자의 실시간 위치를 확인할 수 있습니다."
          variant="blue"
          :icon-opacity="0.9"
          @click="goLocation"
        />
      </div>

      <div class="mini-actions">
        <SmallIconButton
          :icon="icons.manual"
          label="이용 안내"
          @click="showGuide"
        />
        <SmallIconButton
          :icon="icons.personal"
          label="마이페이지"
          @click="goMyPage"
        />
      </div>
    </section>

    <!-- 연동 없음 알림 모달 -->
    <div
      v-if="alertOpen"
      class="gd-modal-backdrop"
      @click.self="closeAlert"
      role="presentation"
    >
      <div
        class="gd-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="알림"
      >
        <h3 class="gd-modal-title bodyBold20px">알림</h3>
        <div class="gd-field">
          <p class="bodyMedium16px gd-alert-text">
            {{ alertMsg }}
          </p>
        </div>
        <div class="gd-modal-actions gd-modal-actions--single">
          <button
            class="gd-btn gd-btn--primary bodyMedium16px"
            @click="closeAlert"
          >
            확인
          </button>
        </div>
        <button
          class="gd-btn-close-x"
          type="button"
          aria-label="닫기"
          @click="closeAlert"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 연동 초대 입력 모달 -->
    <div
      v-if="linkOpen"
      class="gd-modal-backdrop"
      @click.self="closeLinkModal"
      role="presentation"
    >
      <div
        class="gd-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="피보호자 연동"
      >
        <h3 class="gd-modal-title bodyBold20px">피보호자 연동</h3>

        <label class="gd-field">
          <span class="gd-field-label bodyMedium14px">피보호자 이메일</span>
          <input
            v-model.trim="wardEmail"
            class="gd-modal-input bodyMedium16px modal-input"
            type="email"
            placeholder="예: seniorway@google.com"
            autocomplete="email"
            @keyup.enter="confirmLink"
          />
        </label>

        <label class="gd-field">
          <span class="gd-field-label bodyMedium14px">피보호자 이름</span>
          <input
            v-model.trim="wardName"
            class="gd-modal-input bodyMedium16px"
            type="text"
            maxlength="20"
            placeholder="예: 홍길동"
            autocomplete="name"
            @keyup.enter="confirmLink"
          />
        </label>

        <div class="gd-modal-actions">
          <button class="gd-btn bodyMedium16px" @click="closeLinkModal">
            취소
          </button>
          <button
            class="gd-btn gd-btn--primary bodyMedium16px"
            :disabled="!canLink || linking"
            @click="confirmLink"
          >
            {{ linking ? '전송 중…' : '연동 메일 전송' }}
          </button>
        </div>

        <button
          class="gd-btn-close-x"
          type="button"
          aria-label="닫기"
          @click="closeLinkModal"
        >
          ×
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import BigIconCardBtn from '@/newpages/guardian/components/BigIconButton.vue';
import SmallIconButton from '@/newpages/guardian/components/SmallIconButton.vue';

import iconConnect from '@/assets/icons/home/guardian-connect.png';
import iconSchedule from '@/assets/icons/home/guardian-schedule.png';
import iconLocation from '@/assets/icons/home/guardian-location.png';
import iconManual from '@/assets/icons/home/manual.png';
import iconPersonal from '@/assets/icons/home/personal.png';

const icons = {
  connect: iconConnect,
  schedule: iconSchedule,
  location: iconLocation,
  manual: iconManual,
  personal: iconPersonal,
};

const router = useRouter();

const linkOpen = ref(false);
const wardEmail = ref('');
const wardName = ref('');
const linking = ref(false);

const linked = ref(false);
const linkedWard = ref(null);

const linkBtnDisabled = computed(() => linked.value || linking.value);
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const canLink = computed(() => emailRe.test(wardEmail.value));

const linkTitle = computed(() =>
  linked.value ? '사용자 연동 완료' : '사용자 연동'
);

const alertOpen = ref(false);
const alertMsg = ref('');

function openAlert(msg) {
  alertMsg.value = msg;
  alertOpen.value = true;
  lockScroll(true);
}
function closeAlert() {
  alertOpen.value = false;
  lockScroll(false);
}

function lockScroll(lock) {
  document.body.style.overflow = lock ? 'hidden' : '';
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    if (alertOpen.value) return closeAlert();
    if (linkOpen.value) return closeLinkModal();
  }
}

function goSchedule() {
  if (!linked.value || !linkedWard.value) {
    openAlert('아직 연동된 사용자가 없습니다!');
    return;
  }
  const query = linkedWard.value?.id
    ? { wardId: linkedWard.value.id }
    : linkedWard.value?.email
    ? { wardEmail: linkedWard.value.email }
    : {};
  router.push({ name: 'SavedScheduleListV2', query });
}
function goLocation() {
  router.push({ name: 'LocationV2' });
}
function goMyPage() {
  router.push({ name: 'GuardianMyPageV2' });
}
function showGuide() {
  openAlert('준비 중입니다.');
}

function openLinkModal() {
  if (linked.value) return;
  linkOpen.value = true;
  lockScroll(true);
  nextTick(() => document.querySelector('.modal-input')?.focus());
}
function closeLinkModal() {
  linkOpen.value = false;
  lockScroll(false);
  wardEmail.value = '';
  wardName.value = '';
}

// 초기 연동 상태 조회
async function loadLinkedStatus() {
  try {
    const token = localStorage.getItem('accessToken');
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/user-guardians/status`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    linked.value = res.data;
  } catch {
    linked.value = false;
  }
}

async function confirmLink() {
  if (!canLink.value || linking.value) return;
  linking.value = true;
  try {
    const token = localStorage.getItem('accessToken');
    const payload = {
      wardEmail: wardEmail.value.trim(),
      wardName: wardName.value.trim() || undefined,
    };
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/alarm/guardian/invite`,
      null,
      {
        params: payload,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    openAlert('연동 메일 전송이 완료되었습니다.');
    closeLinkModal();
    await loadLinkedStatus();
  } catch {
    openAlert('메일 전송에 실패했습니다. 다시 시도해주세요.');
  } finally {
    linking.value = false;
  }
}

onMounted(() => {
  loadLinkedStatus();
  document.addEventListener('keydown', onKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown);
  lockScroll(false);
});
</script>

<style scoped>
.page {
  padding: 1rem;
}

.list {
  display: grid;
  gap: 16px;
  justify-items: center;
}

/* 미니 버튼 컨테이너 레이아웃 */
.mini-actions {
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  width: 100%;
  max-width: 360px;
  justify-items: center;
}

/* 모달 스타일 */
.gd-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.gd-modal-card {
  width: calc(100% - 2rem);
  max-width: 440px;
  background: var(--color-white);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}

.gd-modal-title {
  margin: 0 0 10px;
  color: var(--color-black);
}

.gd-field {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.gd-field-label {
  color: var(--color-mediumgray);
}

.gd-modal-input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 8px;
  outline: none;
}

.gd-modal-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.02);
}

.gd-modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 14px;
}

.gd-modal-actions--single {
  grid-template-columns: 1fr;
}

.gd-btn {
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-mediumgray);
  background: var(--color-white);
  color: var(--color-black);
  cursor: pointer;
}

.gd-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.gd-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.gd-btn-close-x {
  position: absolute;
  top: 6px;
  right: 10px;
  width: 28px;
  height: 28px;
  border: 0;
  background: transparent;
  color: var(--color-black);
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.gd-alert-text {
  text-align: center;
  color: var(--color-black);
  line-height: 1.4;
}

:deep(.big-icon-card.is-grayscale) {
  filter: grayscale(1); /* 전체를 흑백으로 */
  opacity: 0.65; /* 살짝 연하게 */
  pointer-events: none; /* 클릭/호버 차단 보조 */
  transition: filter 0.2s ease, opacity 0.2s ease; /* 자연스럽게 */
}
</style>
