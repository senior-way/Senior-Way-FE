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
        <div class="breadcrumb" v-if="currentStep < 4">
          <div
            v-for="(step, index) in steps"
            :key="index"
            :class="['step', 'step-label', { active: index === currentStep }]"
          >
            {{ step }}
          </div>
        </div>

        <div class="form_content">
          <!-- 개인정보 동의창 -->
          <div v-if="currentStep === -1" class="form_list">
            <div class="input_wrap agree_wrap">
              <p class="main_text">
                개인정보 이용 동의 여부를 <br />체크해주세요.
              </p>

              <label class="checkbox_label">
                <input
                  type="checkbox"
                  v-model="isAgreed"
                  class="custom_checkbox"
                />
                <span class="check_text">
                  [필수] 개인정보 수집 및 이용 동의<br />
                  <span class="sub_text2"
                    >(수집 항목: 이메일, 이름, 성별, 생년월일)</span
                  >
                </span>
              </label>
            </div>

            <div class="input_wrap">
              <p class="agree_detail_box">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                aliquid ab, hic voluptate animi tenetur explicabo illo iste
                eius! Perferendis velit magni, odio sed enim corrupti esse
                doloribus ut ad? Lorem ipsum dolor, sit amet consectetur
                adipisicing elit. Molestias hic aut sed accusamus qui laborum,
                dolore velit dolorum non quasi quas? Voluptatibus non iusto
                deleniti suscipit nihil ad quia totam. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Sint aliquid ab, hic
                voluptate animi tenetur explicabo illo iste eius! Perferendis
                velit magni, odio sed enim corrupti esse doloribus ut ad? Lorem
                ipsum dolor, sit amet consectetur adipisicing elit. Molestias
                hic aut sed accusamus qui laborum, dolore velit dolorum non
                quasi quas? Voluptatibus non iusto deleniti suscipit nihil ad
                quia totam.
              </p>
            </div>

            <div class="input_wrap">
              <button
                type="submit"
                class="btn"
                :disabled="!isAgreed"
                :class="{ disabled: !isAgreed }"
                @click="goToNextPage"
              >
                회원가입 계속 진행하기
              </button>
            </div>
          </div>

          <!-- 아이디 입력 창 -->
          <div v-if="currentStep === 0" class="form_list">
            <div class="input_wrap">
              <p class="main_text">
                사용하실 <span class="highlight">아이디</span>를<br />
                입력해주세요.
              </p>
              <input type="text" class="input_id" v-model="userId" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="checkId">
                아이디 중복 확인
              </button>
              <p class="sub_text">
                아이디 중복 확인이 완료되면<br />다음 페이지로 넘어갑니다.
              </p>
            </div>
          </div>

          <!-- 비밀번호 입력 창 -->
          <div v-if="currentStep === 1" class="form_list">
            <div class="input_wrap">
              <p class="main_text">
                사용하실
                <span class="highlight">비밀번호</span>를<br />입력해주세요.
              </p>
              <input type="password" class="input_id" v-model="password" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="goToNextPage">
                다음 페이지
              </button>
              <p style="color: #7d828d">비밀번호 구성 요건 적기...</p>
            </div>
          </div>

          <!-- 비밀번호 확인 창 -->
          <div v-if="currentStep === 2" class="form_list">
            <div class="input_wrap">
              <p class="main_text">
                앞에서 입력한
                <span class="highlight">비밀번호</span>를<br /><span
                  class="highlight"
                  >한 번 더</span
                >
                입력해주세요.
              </p>
              <input type="password" class="input_id" v-model="checkPassword" />
            </div>
            <div class="input_wrap">
              <button type="submit" class="btn" @click="isPasswordConfirmed">
                다음 페이지
              </button>
              <p style="color: #7d828d">비밀번호 구성 요건 적기...</p>
            </div>
          </div>
          <!-- 정보 입력 창 -->
          <div v-if="currentStep === 3" class="form_list">
            <div class="input_wrap">
              <div class="input_name_wrap">
                <p class="main_text">
                  <span class="highlight">이름</span>을 입력해주세요.
                </p>
                <input type="text" class="input_name" v-model="userName" />
              </div>
              <div class="drop_wrap">
                <p class="main_text">
                  <span class="highlight">성별</span>을 선택해주세요.
                </p>
                <select v-model="userGender" class="drop_gender">
                  <option disabled value="">성별 선택하기</option>
                  <option>남성</option>
                  <option>여성</option>
                  <option>기타?</option>
                </select>
              </div>
              <div class="select_brith_wrap">
                <p class="main_text">
                  <span class="highlight">생년월일</span>을 선택해주세요.
                </p>
                <input type="date" v-model="userBirth" class="select_brith" />
              </div>
              <div class="input_wrap">
                <button
                  type="submit"
                  class="user_data_btn"
                  @click="goToNextPage"
                >
                  다음 페이지
                </button>
              </div>
            </div>
          </div>
          <!-- 정보 확인 창 -->
          <div v-if="currentStep === 4" class="form_list">
            <div class="check_wrap">
              <p class="main_text">
                내가 입력한 정보가 맞는지<br />다시 한 번 확인해주세요.
              </p>
              <div class="check_info_wrap">
                <div class="check_info_border">
                  <div class="info-row">
                    <span class="label">아이디 :</span>
                    <span class="value">{{ userId }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">비밀번호 :</span>
                    <span class="value">{{ password }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">이름 :</span>
                    <span class="value">{{ userName }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">성별 :</span>
                    <span class="value">{{ userGender }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">생년월일 :</span>
                    <span class="value">{{ userBirth }}</span>
                  </div>
                </div>
                <p class="sub_text" style="color: #7d828d">
                  잘못된 부분이 있다면 뒤로가기를 눌러<br />
                  이전 페이지로 돌아가서 다시 선택해주세요.
                </p>
                <div class="register_btn_wrap">
                  <button
                    type="submit"
                    class="correct_btn"
                    @click="submitRegistration"
                  >
                    전부 올바르게 작성했습니다.
                  </button>
                  <button
                    type="submit"
                    class="back_btn"
                    @click="submitRegistration"
                  >
                    뒤로가서 다시 선택하겠습니다.
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p>현재 <span class="highlight">회원가입</span> 진행중입니다.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Axios from 'axios';

const steps = [
  '아이디\n입력',
  '비밀번호\n입력',
  '비밀번호\n확인',
  '정보\n입력',
];
const currentStep = ref(-1);
const router = useRouter();

// 입력받은 정보
const isAgreed = ref(false);
const userId = ref('');
const password = ref('');
const checkPassword = ref('');
const userName = ref('');
const userGender = ref('');
const userBirth = ref('');

//이메일형식
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//브레드크럼 카운트 증가
const goToNextPage = () => {
  currentStep.value++;
};
// 아이디 중복 확인
const checkId = async () => {
  try {
    // 입력 없을 때
    if (userId.value.trim() === '') {
      alert('아이디를 입력해 주세요.');
      return;
    }
    // 이메일 형식 확인
    const isValidEmail = emailRegex.test(userId.value);
    if (!isValidEmail) {
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    //중복 확인
    const res = await Axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/users?userId=${userId.value}`
    );

    if (res.data.exists === false) {
      alert('사용 가능한 아이디입니다.');
      goToNextPage();
    } else {
      alert('이미 사용중인 아이디 입니다.');
    }
  } catch (error) {
    alert('오류 발생');
  }
};
//비밀번호 확인
const isPasswordConfirmed = () => {
  if (password.value.trim() === checkPassword.value.trim()) {
    goToNextPage();
  } else {
    alert('비밀번호가 일치하지 않습니다.');
  }
};

//회원가입 완료
const submitRegistration = async () => {
  try {
    const newUser = {
      userId: userId.value,
      password: password.value,
      userName: userName.value,
      userGender: userGender.value,
      userBirth: userBirth.value,
    };

    //데이터 전달
    await Axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
      newUser
    );
    router.push('/home');
  } catch (error) {
    alert('오류가 발생했습니다.');
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: -0.03rem;
}

p {
  font-family: 'Font-Medium';
}

input {
  width: 300px;
  height: 45px;
  background-color: #ffffff;
  border: none;
  border-bottom: 0.3125rem solid #b71a86;
  outline: none;
}

button {
  width: 300px;
  height: 50px;
  margin-bottom: 1.5rem;
  margin-top: 3.125rem;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-family: 'Font-Medium';
  font-size: 1.25rem;
  cursor: pointer;
}
button:hover,
button:focus,
button:active {
  background-color: #ffffff;
  border-color: #b71a86;
}

/* header */
.header_logo {
  padding-top: 2rem;
  padding-bottom: 2rem;
  width: 15rem;
  display: block;
  margin: 0 auto;
}

/* footer */
footer {
  text-align: center;
  font-family: 'Font-Medium';
  font-size: 1rem;
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
  width: 100%;
  max-width: 360px;
  height: 100dvh;
  max-height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  justify-content: space-between;
  background-color: #f6f6f6;
}

.container {
  flex-grow: 1;
}

.form_content {
  margin-top: 2.4375rem;
}

.form_content input {
  margin-top: 0.25rem;
}

.input_wrap {
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.btn {
  margin-top: 2.3125rem;
}

.main_text {
  width: 300px;
  /* display: flex; */
  align-items: center;
  text-align: left;
  justify-items: center;
  font-family: 'Font-Bold';
  font-size: 1.375rem;
  line-height: 1.2;
  margin-bottom: 0.4375rem;
  white-space: pre-line;
}

.sub_text {
  text-align: center;
  color: #7d828d;
}

/* 브레드크럼 */
.breadcrumb {
  display: flex;
  font-family: 'Font-Medium';
  font-size: 1rem;
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
  display: flex;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  text-align: center;
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

.input_name_wrap {
  width: 300px;
  margin-bottom: 3.15625rem;
}

/* 체크박스 영역 여백 및 정렬 */
.agree_wrap {
  align-items: flex-start;
  padding: 0 30px;
  gap: 1rem;
}

/* 체크박스 커스텀 */
.custom_checkbox {
  width: 2rem;
  height: 2rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  accent-color: #b71a86; /* 체크 색상 */
}

/* 텍스트 스타일 */
.checkbox_label {
  display: flex;
  align-items: center;
  font-family: 'Font-Medium';
  font-size: 1.05rem;
  color: #444;
}

.sub_text2 {
  font-family: 'Font-Light';
  font-size: 0.9rem;
  color: #7d828d;
}

.check_text {
  font-weight: bold;
}

.agree_detail_box {
  width: 300px;
  height: 250px;
  padding: 0.625rem;
  border-radius: 0.75rem;
  background-color: #ffffff;
  border: 0.0625rem solid #b71a86;
  margin-top: 0.5rem;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE & Edge */
  transition: all 0.3s ease;
  position: relative;
}

/* Chrome, Safari 스크롤 기본 숨김 */
.agree_detail_box::-webkit-scrollbar {
  width: 6px;
  opacity: 0;
}

/* 마우스 호버 시 스크롤바 표시 */
.agree_detail_box:hover::-webkit-scrollbar {
  opacity: 1;
}

/* 스크롤바 손잡이 (thumb) */
.agree_detail_box::-webkit-scrollbar-thumb {
  background-color: rgba(183, 26, 134, 0.6); /* 투명도 조절 */
  border-radius: 6px;
  border: 2px solid white; /* 배경과 어우러지게 */
}

/* 스크롤바 트랙 */
.agree_detail_box::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 6px;
}

/* 비활성 버튼 스타일 */
.btn.disabled {
  border-color: #7d828d;
  color: #7d828d;
  cursor: not-allowed;
  background-color: #ffffff;
}

/* 성별 드랍 */
.drop_gender {
  width: 300px;
  height: 45px;
  margin-bottom: 3.15625rem;
  padding: 0 10px;
  background-color: #fff;
  border: none;
  border-bottom: 4px solid #b71a86;
  font-size: 1rem;
  color: #444;
  outline: none;
  appearance: none;
}

/* 정보 확인 페이지 */
.check_wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.check_info_border {
  width: 300px;
  height: 250px;
  /* border: 0.0625rem solid #b71a86; */
  border-radius: 0.75rem;
  background-color: #ffffff;
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  font-family: 'Font-Medium';
  font-size: 1.375rem;
  /* 높낮이 */
  margin-top: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 0.9375rem;
}

.value {
  padding-left: 0.5rem;
}

.register_btn_wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.highlight {
  color: #b71a86;
}

.correct_btn {
  /* border: 0.0625rem solid #006FBC; */
  margin-top: 1rem;
  margin-bottom: 0.3rem;
}

.back_btn {
  border: 0.0625rem solid #eb6120;
  margin-top: 0.3rem;
}
</style>
