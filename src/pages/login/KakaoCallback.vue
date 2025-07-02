<template><p>카카오 로그인 중...</p></template>
<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code;

  // 코드를 받지 못했을 때
  if (!code) {
    alert('로그인 중 오류가 발생했습니다.');
    router.push('/loginhome');
    return;
  }

  // 코드를 정상적으로 받았을 때
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/kakao-login`,
      { code }
    );
    // 토큰 정상 발급
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
      router.push('/');
    } else {
      // 토큰 못받음
      alert('토큰을 받아오지 못했습니다.');
      router.push('/loginhome');
    }
  } catch (error) {
    //오류 종류
    if (!error.response) {
      alert('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
    } else if (error.response.status === 401) {
      alert('인증에 실패했습니다. 다시 시도해 주세요.');
    } else if (error.response.status === 500) {
      alert('서버 내부 오류가 발생했습니다. 관리자에게 문의하세요.');
    } else {
      alert('알 수 없는 오류가 발생했습니다. 다시 시도해 주세요.');
    }
    router.push('/loginhome');
  }
});
</script>
<style scoped></style>
