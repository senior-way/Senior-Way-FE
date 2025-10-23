<template>
  <main class="accept-page">
    <div class="card">
      <h1 class="title">연동 초대 수락</h1>

      <p v-if="phase === 'checking'">로그인 상태 확인 중…</p>
      <p v-else-if="phase === 'redirectLogin'">로그인 페이지로 이동합니다…</p>
      <p v-else-if="phase === 'exchanging'">초대 토큰 확인 중…</p>
      <p v-else-if="phase === 'success'">
        연동이 완료되었습니다! 잠시 후 메인으로 이동합니다.
      </p>

      <div v-if="phase === 'error'" class="error">
        <p>{{ errorMessage }}</p>
        <button class="btn" @click="goHome">홈으로</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 화면 상태
const phase = ref('checking'); // checking | redirectLogin | exchanging | success | error
const errorMessage = ref('');

function currentFullPath() {
  const full = router.resolve(route.fullPath).href;
  return full.startsWith('#') ? full.slice(1) : full;
}

async function exchangeToken(token) {
  phase.value = 'exchanging';
  try {
    const accessToken = localStorage.getItem('accessToken') || '';
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/alarm/guardian/accept`,
      null,
      {
        params: { token },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    phase.value = 'success';
    setTimeout(() => router.replace({ name: 'Home' }), 1500);
  } catch (e) {
    const status = e?.response?.status;
    const msg = e?.response?.data?.message;
    if (status === 401) {
      phase.value = 'redirectLogin';
      sessionStorage.setItem('inviteToken', token);
      const next = encodeURIComponent(currentFullPath());
      router.replace(`/login?next=${next}`);
      return;
    }
    if (status === 400) {
      errorMessage.value = msg || '토큰이 유효하지 않거나 만료되었습니다.';
    } else {
      errorMessage.value =
        msg || '초대 수락 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    }
    phase.value = 'error';
  }
}

function goHome() {
  router.replace({ name: 'HomeV2' });
}

onMounted(async () => {
  let token =
    route.query.token?.toString() || localStorage.getItem('inviteToken') || '';

  if (!token) {
    phase.value = 'redirectLogin';
    const next = encodeURIComponent(currentFullPath());
    router.replace(`/login?next=${next}`);
    return;
  }

  await exchangeToken(token);

  sessionStorage.removeItem('inviteToken');
});
</script>

<style scoped>
.accept-page {
  min-height: 60vh;
  display: grid;
  place-items: center;
  padding: 2rem 1rem;
}
.card {
  max-width: 520px;
  width: 100%;
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.title {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 700;
}
.error {
  color: #c0392b;
}
.btn {
  margin-top: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  background: var(--color-primary, #4f46e5);
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
