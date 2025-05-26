<template>
  <div class="wrap">
    <div class="header"></div>
    <div class="container">
      <div class="content">
        <div class="login_wrap">
          <form @submit.prevent="tryLogin" class="login_form">
            <ul class="panel">
              <li class="panel_item">
                <div class="login_panel">
                  <div class="input_id">
                    <input type="text" class="id" id="id" v-model="id" />
                  </div>
                  <div class="input_pw">
                    <input type="password" class="pw" id="pw" v-model="pw" />
                  </div>
                </div>
                <div class="login_btn_wrap">
                  <button type="submit" class="login_btn"></button>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <ul class="option_wrap">
        <li class="register">
          <router-link to="/register">회원가입</router-link>
        </li>
      </ul>
    </div>
    <div class="footer"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import Register from './Register.vue';
import axios from 'axios';

const id = ref('');
const pw = ref('');

// 로그인 시도
const tryLogin = async () => {
  if (!id.value || !pw.value) {
    alert('아이디와 비밀번호를 입력해 주세요.');
    return;
  }
  // 데이터 확인
  try {
    const res = await axios.post(`http://주소작성`, {
      id: id.value,
      pw: pw.value,
    });

    if (res.data.success) {
      alert('로그인 성공');
      // 토큰 저장, 홈으로 이동?
    } else {
      alert('로그인 실패: ' + res.data.message);
    }
  } catch (error) {
    console.error('로그인 에러:', error);
  }
};
</script>
<style scoped>
ol,
ul {
  list-style: none;
}
</style>
