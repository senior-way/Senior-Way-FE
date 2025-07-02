<template>
  <div class="wrap">
    <header>
      <img
        src="@/assets/img/seniorway_logo.png"
        alt="SENIORWAY Logo"
        class="header_logo"
      />
    </header>
    <div class="container">
      <div class="content">
        <img :src="profileImg" alt="프로필 이미지" class="profile_img" />
        <div class="description_wrap">
          <div class="profile_wrap">
            <div class="border"><p>이름</p></div>
            <div class="user_detail">이다연</div>
          </div>
          <div class="profile_wrap">
            <div class="border"><p>이메일</p></div>
            <div class="user_detail">carrotday0429@gmail.com</div>
          </div>
          <div class="profile_wrap">
            <div class="border"><p>생년월일</p></div>
            <div class="user_detail">1999.10.11.</div>
          </div>
        </div>
        <div class="option_wrap">
          <div class="my_post"><button>내가 쓴 글 확인</button></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import profileImg from '@/assets/img/profile_img.jpg';
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: -0.03rem;
}

.header_logo {
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 15rem;
  display: block;
  margin: 0 auto;
}

button {
  width: 300px;
  height: 40px;
  border: 0 solid #d9d9d9;
  border-radius: 0.75rem;
  background-color: #d9d9d9;
  font-family: 'Font-Medium';
  font-size: 1rem;
}

/* class */
.wrap {
  position: relative;
  width: 360px;
  height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  background-color: #f6f6f6;
}

.container {
  width: 330px;
  height: 620px;
  border-radius: 0.625rem;
  background-color: #ffffff;
  padding-top: 1.375rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 80px;
}
.profile_img {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  margin-bottom: 2.46875rem;
}
.profile_wrap {
  display: flex;
  padding: 0 0.9375rem;
  width: 330px;
  min-height: 35px;
  height: auto;
  align-items: center;
  margin-bottom: 0.3125rem;
}

.border {
  display: flex;
  width: 70px;
  height: 20px;
  line-height: 20px;
  margin-right: 0.75rem;
  border-radius: 0.75rem;
  background-color: #d9d9d9;
  font-family: 'Font-medium';
  font-weight: 500;
  font-size: 1rem;
  justify-content: center;
  align-items: center;
}

.isBarrierImg {
  width: 290px;
  height: 35px;
}

.user_detail {
  flex: 1;
  font-family: 'Font-Medium';
  font-size: 1rem;
  word-break: break-all;
  white-space: normal;
}

.spot-image {
  width: 95%;
  max-width: 330px;
  object-fit: cover;
  display: block;
}

.btn_wrap {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  width: 330px;
  height: 50px;
  justify-content: space-between;
  background-color: #ffffff;
}
</style>
