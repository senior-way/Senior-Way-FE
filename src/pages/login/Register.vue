<template>
  <div class="wrap">
    <div class="header"><h1>SENIORWAY</h1></div>
    <div class="container">
      <div class="content">
        <div class="breadcrumb">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="['step', 'step-label', { active: index === currentStep }]"
          >
            {{ step }}
          </div>
        </div>
        <div class="form_content">
          <!-- 아이디 입력 창 -->
          <div v-if="currentStep === 0" class="form_list">
            <div class="input_wrap">
              <p class="main_text">사용하실 아이디를<br />입력해주세요.</p>
              <input type="text" class="input_id" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="buttonClick">
                아이디 중복 확인
              </button>
              <p style="color: #7d828d">
                아이디 중복 확인이 완료되면<br />다음 페이지로 넘어갑니다.
              </p>
            </div>
          </div>
          <!-- 비밀번호 입력 창 -->
          <div v-if="currentStep === 1" class="form_list">
            <div class="input_wrap">
              <p class="main_text">사용하실 비밀번호를<br />입력해주세요.</p>
              <input type="password" class="input_id" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="buttonClick">
                다음 페이지
              </button>
              <p style="color: #7d828d">비밀번호 구성 요건 적기...</p>
            </div>
          </div>
          <!-- 비밀번호 확인 창 -->
          <div v-if="currentStep === 2" class="form_list">
            <div class="input_wrap">
              <p class="main_text">
                앞에서 입력한 비밀번호를<br />한 번 더 입력해주세요.
              </p>
              <input type="password" class="input_id" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="buttonClick">
                다음 페이지
              </button>
              <p style="color: #7d828d">비밀번호 구성 요건 적기...</p>
            </div>
          </div>
          <!-- 정보 입력 창 -->
          <div></div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <p>현재 <span class="highlight">회원가입</span> 진행중입니다.</p>
    </footer>
  </div>
</template>
<script setup>
import { ref } from 'vue';

const steps = ['아이디\n입력', '비밀번호\n입력', '비밀번호\n확인', '정보 입력'];
const currentStep = ref(0);

const buttonClick = () => {
  currentStep.value++;
};
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  font-weight: bold;
}
input {
  width: 250px;
  height: 45px;
  background-color: #ffffff;
  border: none;
  border-bottom: 0.3125rem solid #b71a86;
  outline: none;
}
/* class */
.wrap {
  width: 360px;
  height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #f6f6f6;
}
.header {
  font-family: 'Impact', 'Anton', sans-serif;
  text-align: center;
  font-size: 2rem;
  text-shadow: -1px -1px 0 #b71a86, 1px -1px 0 #b71a86, -1px 1px 0 #b71a86,
    1px 1px 0 #b71a86;
  letter-spacing: 2px;
  margin-top: 1.5625rem;
}
.container {
  flex-grow: 1;
}
.form_content {
  margin-top: 2.4375rem;
}
.form_content input {
  width: 300px;
  height: 45px;
  margin-top: 0.25rem;
  background-color: #ffffff;
  border: none;
  border-bottom: 0.3125rem solid #b71a86;
  outline: none;
}
.input_wrap {
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.btn {
  width: 250px;
  height: 50px;
  margin-top: 2.3125rem;
  margin-bottom: 1.25rem;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
}
.main_text {
  width: 100%;
  text-align: left;
  font-size: 1.375rem;
  font-weight: bold;
}
/* 브레드크럼 */
.breadcrumb {
  display: flex;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 1.21875rem;
  justify-content: center;
}
.step {
  position: relative;
  width: 5.625rem;
  height: 3.125rem;
  background-color: #ccc;
  color: white;
  clip-path: polygon(
    0% 0%,
    calc(100% - 10px) 0%,
    100% 50%,
    calc(100% - 10px) 100%,
    0% 100%,
    10px 50%
  );
  margin-right: -10px;
  z-index: 1;
  white-space: nowrap;
  text-align: center;
  align-content: center;
}
.step-label {
  white-space: pre-line;
}
.step:first-child {
  clip-path: polygon(
    0% 0%,
    calc(100% - 10px) 0%,
    100% 50%,
    calc(100% - 10px) 100%,
    0% 100%
  );
}

.step:last-child {
  margin-right: 0;
}

.step.active {
  background-color: #b71a86;
  z-index: 2;
}
/* footer */
.footer {
  text-align: center;
  margin-top: 5.8125rem;
  padding-bottom: 2.5625rem;
}

.footer p {
  text-decoration: underline;
  color: #7d828d;
  font-size: 1rem;
}

.highlight {
  color: #b71a86;
}
</style>
