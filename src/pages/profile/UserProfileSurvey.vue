<template>
  <div class="wrap">
    <header><img src="@/assets/img/seniorway_logo.png" alt="SENIORWAY Logo" class="header_logo" /></header>
    <div class="container">
      <div class="content">
        <div class="breadcrumb">
          <div
            v-for="(stepName, index) in steps"
            :key="index"
            :class="['step', 'step_label', { active: index === step }]"
          >
            {{ stepName }}
          </div>
        </div>
        <div class="survey_content">
          <!-- 체험 선택 창 -->
          <div v-if="step === 0" class="form_list">
            <div class="main_text_wrap">
              <div class="main_text">
                하고 싶은 체험을<br /><span class="highlight">모두</span>
                선택해주세요.
              </div>
              <img src="@/assets/img/evaluation.png" alt="체험선택" class="sub_img">
            </div>
            <div class="select_gird">
              <div
                v-for="(item, index) in experienceOptions"
                :key="index"
                class="select_btn"
                :class="{ selected: selectedExperiences.includes(item) }"
                @click="toggleExperience(item)"
              >
                {{ item }}
              </div>
            </div>
            <div class="btn_wrap">
              <button class="btn" @click="goToNextPage">
                다음 질문 넘어가기
              </button>
            </div>
          </div>
          <!-- 이동수단 선택 창 -->
          <div v-if="step === 1" class="form_list">
            <div class="main_text_wrap">
              <div class="main_text">
                이용할 이동 수단을<br /><span class="highlight">모두</span>
                선택해주세요.
              </div>
              <img src="@/assets/img/public-transport.png" alt="교통수단" class="sub_img">
            </div>
            <div class="select_gird">
              <div
                v-for="(item, index) in vehicle"
                :key="index"
                class="select_btn"
                :class="{ selected: selectedVehicle.includes(item) }"
                @click="toggleVehicle(item)"
              >
                {{ item }}
              </div>
            </div>
            <div class="btn_wrap">
              <button class="btn" @click="goToNextPage">
                다음 질문 넘어가기
              </button>
            </div>
          </div>
          <!-- 휠체어 사용 여부 창 -->
          <div v-if="step === 2" class="form_list">
            <div class="main_text_wrap">
              <div class="main_text">
                휠체어 사용 여부를<br />
                선택해주세요.
              </div>
              <img src="@/assets/img/wheelchair.png" alt="휠체어" class="sub_img">
            </div>
            <div class="select_gird">
              <div class="select_btn_wrap">
                <button
                  class="select_two_option_btn"
                  :class="{ selected: usesWheelchair === true }"
                  @click="selectWheelchair(true)"
                >
                  휠체어를&nbsp;<span class="blue_highlight">사용합니다</span>.
                </button>
                <button
                  class="select_two_option_btn"
                  :class="{ selected: usesWheelchair === false }"
                  @click="selectWheelchair(false)"
                >
                  휠체어를&nbsp;<span class="orange_highlight"
                    >사용하지 않습니다</span
                  >.
                </button>
              </div>
            </div>
            <div class="btn_wrap">
              <button class="btn" @click="goToNextPage">
                다음 질문 넘어가기
              </button>
            </div>
          </div>

          <!-- 반려동물 동반 여부 창 -->
          <div v-if="step === 3" class="form_list">
            <div class="main_text_wrap">
              <div class="main_text">
                반려동물 동반 여부를<br />
                선택해주세요.
              </div>
              <img src="@/assets/img/pets.png" alt="반려동물" class="sub_img">
            </div>
            <div class="select_gird">
              <div class="select_btn_wrap">
                <button
                  class="select_two_option_btn"
                  :class="{ selected: withPet === true }"
                  @click="selectWithPet(true)"
                >
                  반려동물을&nbsp;<span class="blue_highlight">동반합니다</span
                  >.
                </button>
                <button
                  class="select_two_option_btn"
                  :class="{ selected: withPet === false }"
                  @click="selectWithPet(false)"
                >
                  반려동물을&nbsp;<span class="orange_highlight"
                    >동반하지 않습니다</span
                  >.
                </button>
              </div>
            </div>
            <div class="btn_wrap">
              <button class="btn" @click="goToNextPage">
                다음 질문 넘어가기
              </button>
            </div>
          </div>

          <!-- 전자기기 활용 능력 창 -->
          <div v-if="step === 4" class="form_list">
            <div class="main_text_wrap">
              <div class="main_text">
                전자기기 활용 능력을<br />
                선택해주세요.
              </div>
              <img src="@/assets/img/smartphone.png" alt="스마트폰" class="sub_img" />
            </div>

            <div class="digital_skill_btns">
              <img
                :src="digitalSkillLevel === 'high' ? smartphoneHighSelect : smartphoneHighNone"
                alt="상"
                class="digital_img_btn"
                @click="selectDigitalSkill('high')"
              />
              <img
                :src="digitalSkillLevel === 'medium' ? smartphoneMediumSelect : smartphoneMediumNone"
                alt="중"
                class="digital_img_btn"
                @click="selectDigitalSkill('medium')"
              />
              <img
                :src="digitalSkillLevel === 'low' ? smartphoneLowSelect : smartphoneLowNone"
                alt="하"
                class="digital_img_btn"
                @click="selectDigitalSkill('low')"
              />
            </div>

            <div class="btn_wrap">
              <button class="btn_final" @click="goToNextPage">
                설문 끝내기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer>
      <p>현재 <span class="highlight">선호도 조사</span> 진행중입니다.</p>
    </footer>
  </div>
</template>


<script setup>
import { ref } from 'vue';
import smartphoneHighNone from '@/assets/img/smartphone_high_none.png';
import smartphoneHighSelect from '@/assets/img/smartphone_high_select.png';
import smartphoneMediumNone from '@/assets/img/smartphone_medium_none.png';
import smartphoneMediumSelect from '@/assets/img/smartphone_medium_select.png';
import smartphoneLowNone from '@/assets/img/smartphone_low_none.png';
import smartphoneLowSelect from '@/assets/img/smartphone_low_select.png';

const steps = [
  '체험\n선택',
  '이동\n수단',
  '휠체어\n사용',
  '반려\n동물',
  '스마\n트폰'
];

const experienceOptions = [
  '자연',
  '역사·문화·예술',
  '먹거리',
  '쇼핑',
  '체험 액티비티',
  '상관 없음',
];

const selectedExperiences = ref([]);

const selectedVehicle = ref([]);
const vehicle = ['기차', '버스', '비행기', '자차', '자전거', '도보'];

const usesWheelchair = ref(null);

const withPet = ref(null);

// 전자기기 활용 능력 기준 low, medium, high
const digitalSkillLevel = ref('')  // 기본값 비워둘 수도 있음
const selectDigitalSkill = (level) => {
  digitalSkillLevel.value = level
  console.log('디지털 스킬 레벨:', level);
}

const step = ref(0);

// 체험 선택했을 시
const toggleExperience = (item) => {
  if (selectedExperiences.value.includes(item)) {
    selectedExperiences.value = selectedExperiences.value.filter(
      (v) => v !== item
    );
  } else {
    selectedExperiences.value.push(item);
  }
};

// 이동수단 선택했을 시
const toggleVehicle = (item) => {
  if (selectedVehicle.value.includes(item)) {
    selectedVehicle.value = selectedVehicle.value.filter((v) => v !== item);
  } else {
    selectedVehicle.value.push(item);
  }
};

// 휠체어 여부 선택
const selectWheelchair = (value) => {
  usesWheelchair.value = value;
};

// 반려견 동반 여부 선택
const selectWithPet = (value) => {
  withPet.value = value;
};

// 다음페이지 이동
const goToNextPage = () => {
  step.value++;
};

</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
  line-height: 1;
  letter-spacing: -0.03rem;
}

/* header */
.header_logo {
  padding-top: 2rem;
  width: 15rem; 
  display: block; 
  margin: 0 auto;
}

/* footer */
footer {
  text-align: center;
  margin-bottom: 2.5625rem;
}

footer p {
  text-decoration: underline;
  color: #7d828d;
  font-family: 'Font-Medium';
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
  flex-grow: 1;
}

.sub_img {
  width: 40px;
  display: flex;
}

/* 브레드크럼 */
.breadcrumb {
  display: flex;
  font-family: 'Font-Bold';
  font-size: 14pt;
  font-weight: bold;
  margin-top: 1.21875rem;
  justify-content: center;
}
.step {
  position: relative;
  width: 4.5rem;
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
.step_label {
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


/* 본문 */
.survey_content {
  margin-top: 1.5rem;
}
.main_text_wrap {
  padding: 0 1.875rem;
  font-family: 'Font-Bold';
  font-size: 1.375rem;
  display: flex;
  justify-content: space-between;
}

/* 선택창 */
.select_gird {
  display: grid;
  grid-template-columns: repeat(2, 150px);
  grid-template-rows: repeat(3, 100px);
  gap: 0.75rem;
  justify-content: center;
  margin-top: 2.0625rem;
}

/*체험, 이동수단 선택 버튼 */
.select_btn {
  width: 150px;
  height: 100px;
  background-color: #ffffff;
  border: 1px solid #7d828d;
  border-radius: 0.625rem;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: 'Font-Bold';
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 0.5625rem;
}
.selected {
  border-color: #b71a86;
  background-color: #b71a8630;
}

/* 휠체어, 반려견 선택 버튼 */
.select_two_option_btn {
  width: 300px;
  height: 150px;
  background-color: #ffffff;
  border: 1px solid #7d828d;
  border-radius: 0.625rem;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-family: 'Font-Bold';
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 1.125rem;
}
.blue_highlight {
  color: #005fbc;
}
.orange_highlight {
  color: #eb6120;
}
.select_two_option_btn.selected {
  border-color: #b71a86;
  background-color: #b71a8630
}

.digital_skill_btns {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
  gap: 0.3rem;
}

.digital_img_btn {
  width: 300px;
  height: auto;
  /* display: block; */
  cursor: pointer;
}

/* 다음 버튼 */
.btn_wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn {
  width: 300px;
  height: 50px;
  margin-top: 2.6875rem;
  margin-bottom: 1.25rem;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-family: 'Font-Medium';
  font-size: 1.25rem;
  cursor: pointer;
}

.btn_final{
  width: 300px;
  height: 50px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-family: 'Font-Medium';
  font-size: 1.25rem;
  cursor: pointer;
}
</style>