<template>
  <main class="login">
    <section class="panel">
      <div class="form">
        <!-- 이메일 입력 -->
        <div class="field email">
          <TextInput v-model="email" as="email">
            <template #label>이메일을 입력해주세요.</template>
          </TextInput>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="field password">
          <TextInput v-model="pw" as="password" type="password">
            <template #label>비밀번호를 입력해주세요.</template>
          </TextInput>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="cta">
        <SubmitButton :disabled="loading" label="로그인" @click="login" />
        <SubmitButton
          label="아이디/비밀번호 찾기"
          variant="mediumgray"
          @click="goFind"
        />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TextInput from '@/components/input/TextInput.vue';
import SubmitButton from '@/components/button/SubmitButton.vue';

const email = ref('');
const pw = ref('');
const loading = ref(false);
const router = useRouter();
const baseUrl = import.meta.env.VITE_API_BASE_URL;

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''));
    return String(payload.role || payload.userType || '').toLowerCase();
  } catch {
    return '';
  }
}

async function login() {
  if (!email.value || !pw.value) {
    alert('이메일과 비밀번호를 입력해주세요.');
    return;
  }
  // JWT payload에서 role 추출(백엔드가 user.role을 안 줄 때 대비)
  function getRoleFromToken(token) {
    try {
      const payload = JSON.parse(atob((token || '').split('.')[1] || ''));
      return String(payload.role || payload.userType || '').toLowerCase();
    } catch {
      return '';
    }
  }

  loading.value = true;
  try {
    const res = await axios.post(
      `${baseUrl}/auth/login`,
      {
        email: email.value,
        password: pw.value,
      },
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // refresh 쿠키 등 송수신
      }
    );

    // accessToken 저장
    const accessToken = res.data?.accessToken;
    if (accessToken) localStorage.setItem('accessToken', accessToken);

    // 역할 결정: API 응답 우선 → 토큰 페이로드 → 기본값 'user'
    const roleFromApi = (
      res.data?.user?.role ||
      res.data?.role ||
      ''
    ).toLowerCase();
    const role = roleFromApi || getRoleFromToken(accessToken) || 'user';
    localStorage.setItem('role', role);

    // 역할별 라우팅
    if (role === 'guardians') {
      router.replace({ name: 'GuardianHomeV2' });
    } else {
      router.replace({ name: 'HomeV2' });
    }
  } catch (err) {
    console.error('로그인 실패', err?.response?.data || err.message);
    alert('로그인 실패: 이메일/비밀번호를 확인해주세요.');
  } finally {
    loading.value = false;
  }

  // 그대로 유지
  function goFind() {
    console.log('go to find account/password');
  }
  console.log('go to find account/password');
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 24px;
}
.panel {
  width: 100%;
  max-width: 420px;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 24px;
}

.form {
  width: 100%;
  max-width: 420px;
  display: grid;
  justify-items: center;
}

.field.email {
  margin-top: 5rem;
}

.field.password {
  margin-top: 3rem;
}

:deep(.text-input) {
  width: 300px;
}

:deep(.text-input .label) {
  width: 300px;
}

.cta {
  width: 100%;
  max-width: 420px;
  margin-top: 2rem;
  display: grid;
  row-gap: 0.5rem;
  justify-items: center;
}
</style>
