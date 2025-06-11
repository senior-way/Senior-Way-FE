<template>
  <div>
    <!-- 로그인 관련 기능인데 네비게이션바 생기면 그쪽으로 이동할 듯? -->
    <button v-if="isLoggedIn" @click="logout">로그아웃</button>
    <button v-else @click="login">로그인</button>
  </div>
  <TripSchedule />
  <BoardPreview />
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TripSchedule from './TripSchedule.vue';
import BoardPreview from './BoardPreview.vue';

const isLoggedIn = ref(false);
const router = useRouter();

const login = () => {
  router.push('/login');
};

const logout = () => {
  //로그아웃 처리 구현

  isLoggedIn.value = false;
};
</script>
<script scoped></script>
