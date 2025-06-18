<template>
  <div class="wrap">
    <header><p>SENIORWAY</p></header>
    <div class="container">
      <div class="content">
        <div class="register_btn_wrap">
          <button class="large_btn" @click="goToRegister">
            <p class="main">회원가입 하기</p>
            <p class="sub">처음 방문했어요!</p>
          </button>
        </div>
        <div class="login_btn_wrap">
          <button class="large_btn" @click="goToLogin">
            <p class="main">로그인 하기</p>
            <p class="sub">일반 계정이 있어요!</p>
          </button>
        </div>
        <div class="kakao_login_btn_wrap">
          <button class="kakao_login_btn">
            <img :src="kakaoLoginBtn" alt="카카오 로그인" />
          </button>
          <p class="kakao_login_text">카카오 계정으로 가입했어요!</p>
        </div>
      </div>
    </div>
    <footer>
      <p>로그인/회원가입 방법 안내</p>
    </footer>
  </div>
</template>
<script setup>
import kakaoLoginBtn from '@/assets/kakao_login.png';
import { useRouter } from 'vue-router';

const router = useRouter();

const goToLogin = () => {
  router.push('/login');
};

const goToRegister = () => {
  router.push('/register');
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: -0.03rem;
  font-weight: 500;
}
/* header */
header {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: -1px -1px 0 #b71a86, 1px -1px 0 #b71a86, -1px 1px 0 #b71a86,
    1px 1px 0 #b71a86;
  letter-spacing: 2px;
  margin-top: 2.59375rem;
  margin-bottom: 4.28125rem;
}
/* footer */
footer {
  font-size: 1rem;
  color: #7d828d;
  text-decoration: underline;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5625rem;
}
/* class */
.wrap {
  width: 100%;
  max-width: 360px;
  height: 100dvh;
  max-height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  background-color: #f6f6f6;
}
.container {
  flex-grow: 1;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.large_btn {
  width: 250px;
  height: 150px;
  border: 0 solid #ffffff;
  border-radius: 0.75rem;
  background-color: #ffffff;
  margin-bottom: 1.125rem;
}
.main {
  font-size: 1.75rem;
  font-weight: 700;
  height: 1.75rem;
}
.sub {
  font-size: 1rem;
  color: #7d828d;
  margin-top: 1.8125rem;
}
.kakao_login_btn_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.kakao_login_btn {
  width: 244px;
  height: 60px;
  border: none;
  cursor: pointer;
}
.kakao_login_btn img {
  width: 100%;
  height: 100%;
  display: block;
}
.kakao_login_text {
  margin-top: 1.0625rem;
  font-size: 1rem;
  color: #7d828d;
}
</style>
