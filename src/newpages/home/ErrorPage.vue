<!-- GPT로 대충 돌리며 진행하는 컴포 테스트용 임시 페이지 -->
 <!-- 추후 404에러 페이지로 수정 예정!! -->
<template>
  <div class="app-wrapper auth-test">
    <!-- 헤더 아래 단계 breadcrumb -->
    <StepBreadcrumb
      :steps="signupSteps"
      :current="currentStep"
      :clickable="true"
      @update:current="val => (currentStep = val)"
    />

    <!-- Auth 홈 버튼 테스트 (일부만 모달 트리거) -->
    <div class="btn-stack">
      <!-- 회원가입: 단일 확인 모달 -->
      <div @click.prevent="openConfirm('회원가입이 정상적으로 완료되었습니다!', '확인')">
        <AuthHomeBtn
          title="회원가입"
          subtitle="처음 방문했어요."
          :to="{ name: 'Signup' }"
        />
      </div>

      <!-- 로그인: 액션 모달(확인/어디서 확인?) -->
      <div
        @click.prevent="openAction(
          '저장된 일정을 ‘일정 확인페이지’에서 확인하실 수 있습니다.',
          '확인했습니다.',
          '어디서 확인할 수 있나요?'
        )"
      >
        <AuthHomeBtn
          title="로그인"
          subtitle="일반 계정이 있어요."
          :to="{ name: 'Login' }"
        />
      </div>
    </div>

    <!-- SubmitButton 테스트 섹션 -->
    <div class="submit-stack">
      <!-- 기본 제출: 액션 모달 -->
      <div @click="openAction('저장된 일정은 일정 확인 페이지에서 확인할 수 있습니다.', '좋아요', '도움이 필요해요')">
        <SubmitButton label="기본 제출" />
      </div>

      <!-- 레드: 확인 모달 -->
      <div @click="openConfirm('레드 버튼을 눌렀습니다.', '확인')">
        <SubmitButton label="레드" variant="red" />
      </div>

      <!-- 블루: 액션 모달 -->
      <div @click="openAction('블루 버튼 테스트!', '확인', '자세히 보기')">
        <SubmitButton label="블루" variant="blue" />
      </div>

      <!-- 임시저장: 확인 모달 -->
      <div @click="openConfirm('임시저장이 완료되었습니다.', '확인')">
        <SubmitButton label="임시저장" variant="mediumgray" />
      </div>

      <!-- 비활성: 그대로 -->
      <div>
        <SubmitButton label="비활성" :disabled="true" />
      </div>
    </div>

    <!-- TextInput 테스트 섹션 -->
    <div class="input-stack">
      <TextInput v-model="name" as="text">
        <template #label>
          <em>이름</em>을 입력해주세요.
        </template>
      </TextInput>

      <TextInput v-model="email" as="email" placeholder="name@example.com">
        <template #label>
          사용하실 <em>이메일</em>을 입력해주세요.
        </template>
      </TextInput>

      <TextInput
        v-model="gender"
        as="select"
        :options="['남성', '여성', '기타']"
        placeholder="성별 선택"
      >
        <template #label>
          <em>성별</em>을 선택해주세요.
        </template>
      </TextInput>
    </div>

    <!-- ✅ 단일 확인 모달 -->
    <ConfirmModal
      v-model="isConfirmOpen"
      :message="confirmMessage"
      :confirmText="confirmBtnText"
      @confirm="onConfirm"
      @close="onClose"
    />

    <!-- ✅ 액션 모달(확인/보조) -->
    <ActionModal
      v-model="isActionOpen"
      :message="actionMessage"
      :confirmText="actionConfirmText"
      :secondaryText="actionSecondaryText"
      :confirmColor="'var(--color-primary)'"
      :secondaryColor="'var(--color-orange, #F2994A)'"
      @confirm="onActionConfirm"
      @secondary="onActionSecondary"
      @close="onClose"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthHomeBtn from '@/newpages/auth/components/AuthHomeBtn.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'
import TextInput from '@/components/input/TextInput.vue'
import StepBreadcrumb from '@/components/layout/StepBreadcrumb.vue'

/* 방금 만든 모달들: 경로는 네 구조에 맞춰 조정해줘 */
import ConfirmModal from '@/components/modal/SimpleModal.vue'     // 단일 확인
import ActionModal from '@/components/modal/SelectModal.vue'          // 확인/보조 2버튼

// 단계 데이터
const signupSteps = [
  { key: 'terms',   label: '정보제공 동의' },
  { key: 'email',   label: '이메일' },
  { key: 'pw',      label: '비밀번호' },
  { key: 'pw2',     label: '비밀번호 확인' },
  { key: 'profile', label: '개인정보' }
]
const currentStep = ref('terms')

// 인풋
const name = ref('')
const email = ref('')
const gender = ref('')

// ----- ConfirmModal 상태 -----
const isConfirmOpen = ref(false)
const confirmMessage = ref('회원가입이 정상적으로 완료되었습니다!')
const confirmBtnText = ref('확인')

// ----- ActionModal 상태 -----
const isActionOpen = ref(false)
const actionMessage = ref('저장된 일정을 ‘일정 확인페이지’에서 확인하실 수 있습니다.')
const actionConfirmText = ref('확인했습니다.')
const actionSecondaryText = ref('어디서 확인할 수 있나요?')

// 트리거 함수들
function openConfirm(msg = '확인이 필요합니다.', btn = '확인') {
  confirmMessage.value = msg
  confirmBtnText.value = btn
  isConfirmOpen.value = true
}
function openAction(msg, confirm = '확인', secondary = '자세히 보기') {
  actionMessage.value = msg ?? actionMessage.value
  actionConfirmText.value = confirm
  actionSecondaryText.value = secondary
  isActionOpen.value = true
}

// 모달 액션 콜백
function onConfirm() {
  // 단일 확인 모달에서 확인 눌렀을 때
  // e.g., 라우팅/상태 초기화 등
}
function onActionConfirm() {
  // 액션 모달 '확인' 클릭
}
function onActionSecondary() {
  // 액션 모달 '보조' 클릭 (도움말 띄우기 등)
}
function onClose() {
  // 공통 닫힘 처리
}
</script>

<style scoped>
/* 포인트 컬러(= StepBreadcrumb의 --sw-accent) */
.auth-test { --color-accent: #B71A86; }

.auth-test {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 16px;
}

/* StepBreadcrumb 폭 제한 */
:deep(.sw-steps) { width: 100%; max-width: 420px; }
:deep(.sw-steps-list) { padding-top: 8px; padding-bottom: 2px; }

.btn-stack {
  display: flex; flex-direction: column; gap: 16px; align-items: center;
}
.submit-stack {
  display: grid; grid-template-columns: 1fr; gap: 12px; justify-items: center; width: 100%;
}
.input-stack {
  display: grid; grid-template-columns: 1fr; gap: 16px; justify-items: center; width: 100%;
}

/* 테스트용 래퍼 div가 누르는 영역을 정확히 감싸도록 */
.btn-stack > div,
.submit-stack > div { display: inline-block; }
</style>
