<template>
  <main class="page">
    <section class="container">
      <div class="list">
        <BigIconButton
          :label="linkBtnLabel"
          variant="primary"
          :disabled="linkBtnDisabled"
          @click="openLinkModal"
        />
        <BigIconButton
          label="현재 위치 확인"
          variant="blue"
          @click="goLocation"
        />
        <BigIconButton
          label="마이페이지"
          variant="mediumgray"
          @click="goMyPage"
        />
      </div>
    </section>

    <!-- 이메일 초대 모달 -->
    <div v-if="linkOpen" class="modal-backdrop" @click.self="closeLinkModal">
      <div class="modal-card">
        <h3 class="modal-title bodyBold20px">피보호자 연동</h3>

        <label class="field">
          <span class="field-label bodyMedium14px">피보호자 이메일</span>
          <input
            v-model.trim="wardEmail"
            class="modal-input bodyMedium16px"
            type="email"
            placeholder="예: seniorway@google.com"
            autocomplete="email"
            @keyup.enter="confirmLink"
          />
        </label>

        <label class="field">
          <span class="field-label bodyMedium14px">피보호자 이름</span>
          <input
            v-model.trim="wardName"
            class="modal-input bodyMedium16px"
            type="text"
            maxlength="20"
            placeholder="예: 홍길동"
            autocomplete="name"
            @keyup.enter="confirmLink"
          />
        </label>

        <div class="modal-actions">
          <button class="btn ghost bodyMedium16px" @click="closeLinkModal">
            취소
          </button>
          <button
            class="btn primary bodyMedium16px"
            :disabled="!canLink || linking"
            @click="confirmLink"
          >
            {{ linking ? '전송 중…' : '연동 메일 전송' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import BigIconButton from '@/components/button/BigIconButton.vue';

const router = useRouter();

function goLocation() {
  router.push({ name: 'LocationV2' });
}
function goMyPage() {
  router.push({ name: 'MyPageV2' });
}

const linkOpen = ref(false);
const wardEmail = ref('');
const wardName = ref('');
const linking = ref(false);

const linked = ref(false);
const linkedWard = ref(null);

const linkBtnLabel = computed(() =>
  linked.value ? '연동이 완료되었습니다.' : '피보호자 연동'
);
const linkBtnDisabled = computed(() => linked.value || linking.value);

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const canLink = computed(() => emailRe.test(wardEmail.value));

function openLinkModal() {
  if (linked.value) return;
  linkOpen.value = true;
  nextTick(() => document.querySelector('.modal-input')?.focus());
}

function closeLinkModal() {
  linkOpen.value = false;
  wardEmail.value = '';
  wardName.value = '';
}

// 초기 연동 상태 조회 (백엔드 연동 필요 부분 주석 처리)
// async function loadLinkedStatus() {
//   try {
//     const { data } = await axios.get('/api/guardian/links/status', { withCredentials: true })
//     linked.value = !!data?.linked
//     linkedWard.value = data?.ward || null
//   } catch {
//     linked.value = false
//     linkedWard.value = null
//   }
// }
// onMounted(loadLinkedStatus)

// 백엔드 연동 전: 전송 성공으로만 처리 (API 호출부 주석)
// 실제 연동 시 아래 주석 해제하고 API 연결
async function confirmLink() {
  if (!canLink.value || linking.value) return;
  linking.value = true;
  try {
    const payload = {
      wardEmail: wardEmail.value.trim(),
      wardName: wardName.value.trim() || undefined,
    };
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/alarm/guardian/invite`,
      null,
      {
        params: payload,
        withCredentials: true,
      }
    );

    // 데모 동작: 성공처럼 처리
    alert('연동 메일 전송이 완료되었습니다.');
    closeLinkModal();
  } catch (e) {
    alert('메일 전송에 실패했습니다. 다시 시도해주세요.');
  } finally {
    linking.value = false;
  }
}

// 백엔드 연동 전에는 기본 노출만 위해 onMounted 훅에서 별도 호출 없이 둠
onMounted(() => {
  linked.value = false;
  linkedWard.value = null;
});
</script>

<style scoped>
.page {
  padding: 4.5rem 1rem;
}

.container {
  flex: 1;
  display: grid;
  place-items: center;
}

.list {
  display: grid;
  gap: 16px;
  justify-items: center;
}

/* 모달 */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-card {
  width: calc(100% - 2rem);
  max-width: 440px;
  background: var(--color-white);
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 10px 0;
  color: var(--color-black);
}

.field {
  display: grid;
  gap: 6px;
  margin-top: 10px;
}

.field-label {
  color: var(--color-mediumgray);
}

.modal-input {
  width: 100%;
  height: 42px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 8px;
  padding: 0 12px;
  outline: none;
  box-sizing: border-box;
}

.modal-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.02);
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-top: 14px;
}

.btn {
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-mediumgray);
  background: var(--color-white);
  color: var(--color-black);
  transition: background-color 0.16s ease, border-color 0.16s ease;
}

.btn.primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.btn.ghost {
  background: var(--color-white);
  color: var(--color-black);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
