<!-- src/pages/guardian/GuardianSignup.vue -->
<template>
  <main class="signup">
    <section class="panel">
      <div class="panel-content">
        <div class="form-stack">
          <SignupEmailInput
            v-model="email"
            :checking="checking"
            :checkDisabled="!isEmailValid"
            :status="emailStatus"
            :statusText="emailStatusText"
            label="사용하실 이메일을 입력해주세요."
            placeholder="name@example.com"
            @check="checkEmail"
          />

          <!-- 비밀번호 -->
          <SignupInput
            v-model="pw"
            type="password"
            label="비밀번호를 입력해주세요."
            placeholder="8~20자, 영문/숫자/특수문자 2종 이상"
            :desc="'* 영문, 숫자, 특수문자 중 2종류 이상을 조합하여 8~20자'"
            :error="pwError"
          />
          <!-- 비밀번호 확인 -->
          <SignupInput
            v-model="pw2"
            type="password"
            label="비밀번호 확인을 입력해주세요."
            placeholder="비밀번호 재입력"
            :error="pw2Error"
          />

          <!-- 이름 -->
          <SignupInput
            v-model="name"
            type="text"
            label="이름을 입력해주세요."
            placeholder="이름 입력"
          />
        </div>
      </div>

      <div class="cta-gap">
        <SubmitButton
          label="회원가입 완료"
          :disabled="!canSubmit"
          @click="submit"
        />
      </div>
    </section>

    <SimpleModal
      v-model="modalOpen"
      message="회원가입이 완료되었습니다!"
      @confirm="onModalConfirm"
    />
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SignupInput from '@/newpages/guardian/components/SignupInput.vue';
import SignupEmailInput from '@/newpages/guardian/components/SignupEmail.vue';
import SubmitButton from '@/components/button/SubmitButton.vue';
import SimpleModal from '@/components/modal/SimpleModal.vue';

const router = useRouter();

const email = ref('');
const pw = ref('');
const pw2 = ref('');
const name = ref('');

const checking = ref(false);
const emailChecked = ref(null);
const modalOpen = ref(false);

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value));

// 비밀번호 8~20자 & (영문/숫자/특수문자) 2종 이상
function isPwValid2of3(v) {
  if (!v) return false;
  const lenOk = v.length >= 8 && v.length <= 20;
  const types =
    (/[A-Za-z]/.test(v) ? 1 : 0) +
    (/\d/.test(v) ? 1 : 0) +
    (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v) ? 1 : 0);
  return lenOk && types >= 2;
}
const isPwValid = computed(() => isPwValid2of3(pw.value));
const isPwSame = computed(() => pw.value && pw.value === pw2.value);

// 에러 문구
const pwError = computed(() => {
  if (!pw.value) return '';
  if (!isPwValid.value) return '비밀번호 조건에 맞지 않습니다.';
  return '';
});
const pw2Error = computed(() => {
  if (!pw2.value) return '';
  if (!isPwSame.value) return '비밀번호가 일치하지 않습니다.';
  return '';
});

const isNameValid = computed(() => !!name.value.trim());

const submitting = ref(false); // 버튼 클릭 잠금용 상태

const canSubmit = computed(
  () =>
    isEmailValid.value &&
    emailChecked.value === true &&
    isPwValid.value &&
    isPwSame.value &&
    isNameValid.value
);

// 이름 숫자 제거
watch(name, (v) => {
  const cleaned = (v || '').replace(/\d+/g, '');
  if (cleaned !== v) name.value = cleaned;
});

// 입력 변경 시 이메일 체크 상태 리셋
watch(email, () => {
  emailChecked.value = null;
});

const emailStatus = computed(() => {
  if (emailChecked.value === true) return 'success';
  if (emailChecked.value === false) return 'error';
  return '';
});
const emailStatusText = computed(() => {
  if (emailChecked.value === true) return '사용 가능한 이메일입니다.';
  if (emailChecked.value === false) return '이미 사용 중인 이메일입니다.';
  return '';
});

async function checkEmail() {
  checking.value = true;
  try {
    const ok = !['test@example.com', 'admin@example.com'].includes(
      email.value.trim().toLowerCase()
    );
    emailChecked.value = ok;
  } finally {
    checking.value = false;
  }
}

async function submit() {
  if (!canSubmit.value) return;

  submitting.value = true;
  try {
    await axios.post(
      `${baseUrl}/auth/guardian-signup`,
      {
        username: name.value,
        password: pw.value,
        email: email.value,
      },
      { withCredentials: true }
    );
    modalOpen.value = true;
  } catch (e) {
    console.error('회원가입 실패', e?.response?.data || e.message);
    alert('회원가입에 실패했습니다.');
  } finally {
    submitting.value = false;
  }
}

function onModalConfirm() {
  modalOpen.value = false;
  router.replace({ name: 'LoginV2' });
}
</script>

<style scoped>
.signup {
  margin: 0.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 24px;
}
.panel {
  width: 100%;
  max-width: 420px;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.panel-content {
  width: 100%;
  max-width: 420px;
  display: grid;
  justify-items: center;
  row-gap: 8px;
  flex: 1 1 auto;
}
.form-stack {
  width: 100%;
  display: grid;
  justify-items: center;
}
</style>
