<template>
  <div class="wrap">
    <header><p>SENIORWAY</p></header>
    <div class="container">
      <div class="content">
        <div class="login_wrap">
          <form @submit.prevent="tryLogin" class="login_form">
            <ul class="panel">
              <li class="panel_item">
                <div class="login_panel">
                  <div class="input_id">
                    <p class="input_id_text" style="font-size: 1.375rem">
                      아이디를 입력해주세요.
                    </p>
                    <input type="text" class="id" id="id" v-model="id" />
                  </div>
                  <div class="input_pw">
                    <p class="input_pw_text" style="font-size: 1.375rem">
                      비밀번호를 입력해주세요.
                    </p>
                    <input type="password" class="pw" id="pw" v-model="pw" />
                  </div>
                </div>
                <div class="login_btn_wrap">
                  <button type="submit" class="login_btn">로그인</button>
                </div>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div class="find_idpw_btn_wrap">
        <button class="find_btn">아이디/비밀번호가<br />기억나지 않아요</button>
      </div>
    </div>
    <footer>
      <p>현재 <span class="highlight">로그인</span> 진행중입니다.</p>
    </footer>
  </div>
</template>
<script setup>
import { ref } from 'vue';
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
* {
  margin: 0;
  padding: 0;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0;
}
ol,
ul {
  list-style: none;
}
input {
  width: 250px;
  height: 45px;
  background-color: #ffffff;
  border: none;
  border-bottom: 0.3125rem solid #b71a86;
  outline: none;
  margin-top: 0.4375rem;
}
button {
  cursor: pointer;
}
/* header */
header {
  font-family: 'Impact', 'Anton', sans-serif;
  text-align: center;
  font-size: 2rem;
  text-shadow: -1px -1px 0 #b71a86, 1px -1px 0 #b71a86, -1px 1px 0 #b71a86,
    1px 1px 0 #b71a86;
  letter-spacing: 2px;
  margin-top: 2.59375rem;
}
/* footer */
footer {
  text-align: center;
  margin-bottom: 2.5625rem;
}

footer p {
  text-decoration: underline;
  color: #7d828d;
  font-size: 1rem;
}

.highlight {
  color: #b71a86;
}
/* class */
.wrap {
  width: 360px;
  height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  background-color: #f6f6f6;
}
.container {
  margin-top: 7.90625rem;
  flex-grow: 1;
}
.panel_item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.login_btn_wrap {
  flex-direction: column;
  display: flex;
  align-items: center;
}
.login_btn {
  width: 250px;
  height: 50px;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-size: 1.25rem;
}
.input_pw {
  margin-top: 3.125rem;
  margin-bottom: 2.5rem;
}
.find_idpw_btn_wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5625rem;
}
.find_btn {
  width: 250px;
  height: 70px;
  border: 0.0625rem solid #7d828d;
  border-radius: 0.75rem;
  font-size: 1.125rem;
  color: #7d828d;
  background-color: #ffffff;
}
</style>
