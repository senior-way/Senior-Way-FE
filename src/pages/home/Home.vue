<template>
  <div class="wrap">
    <header>
      <img src="@/assets/img/seniorway_logo.png" alt="SENIORWAY Logo" class="header_logo" />
    </header>

    <div class="container">
      <div class="btn_group">
        <button class="sub_btn">이용방법</button>

        <div class="row_btn_wrap">
          <button class="sub_btn half" @click="goTo('loginhome')">로그인/회원가입</button>
          <button class="sub_btn half">내 정보 확인</button>
        </div>

        <button class="survey_btn" @click="goTo('profilesurvey')">관광지 추천받고 일정 만들기</button>
        <button class="home_btn" @click="goTo('tripschedule')">저장된 여행 일정 확인</button>
        <button class="home_btn" @click="goTo('searchplace')">무장애 관광지 검색</button>
        <button class="home_btn" @click="goTo('board')">여행자 커뮤니티</button>
      </div>
    </div>

    <footer>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goTo = (name) => {
  router.push({ name });
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  box-sizing: border-box;
}

.wrap {
  width: 100%;
  max-width: 360px;
  height: 100dvh;
  max-height: 740px;
  margin: 0 auto;
  background-color: #f6f6f6;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header_logo {
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 15rem;
  display: block;
  margin: 0 auto;
}

.container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn_group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.home_btn {
  width: 330px;
  height: 100px;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 0.0625rem solid #b71a86;
  font-family: 'Font-BOld';
  font-size: 1.25rem;
  cursor: pointer;
}

.survey_btn {
  width: 330px;
  height: 140px;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 0.0625rem solid #b71a86;
  font-family: 'Font-Bold';
  font-size: 1.25rem;
  cursor: pointer;
}

.sub_btn {
  width: 330px;
  height: 55px;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 0.0625rem solid #b71a86;
  font-family: 'Font-Bold';
  font-size: 1rem;
  cursor: pointer;
}

.row_btn_wrap {
  display: flex;
  justify-content: center;
  gap: 0.625rem;
}

.half {
  width: 160px;
}

</style>
