<template>
  <div class="wrap">
    <header><p>SENIORWAY</p></header>
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
              <div class="image">난미<br />이지</div>
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
              <div class="image">난미<br />이지</div>
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
              <div class="image">난미<br />이지</div>
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
              <div class="image">난미<br />이지</div>
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
          <!-- 전자기기 활용 능력 창-->
          <div v-if="step === 4" class="form_list"></div>
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

const steps = [
  '체험 선택',
  '이동수단 선택',
  '휠체어 사용 여부',
  '반려동물 여부',
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
const digitalSkillLevel = ref('low');
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
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0;
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
  flex-grow: 1;
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
  margin-top: 1.875rem;
}
.main_text_wrap {
  padding: 0 1.875rem;
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
  font-weight: bold;
  font-size: 1.25rem;
  cursor: pointer;
  margin-bottom: 0.5625rem;
}
.selected {
  border-color: #b71a86;
  background-color: rgba(183, 26, 134, 0.1);
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
  font-weight: bold;
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
  background-color: rgba(183, 26, 134, 0.1);
}
/* 다음 버튼 */
.btn_wrap {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn {
  width: 250px;
  height: 50px;
  margin-top: 2.6875rem;
  margin-bottom: 1.25rem;
  border: 0.0625rem solid #b71a86;
  border-radius: 0.75rem;
  background-color: #ffffff;
  font-size: 1.25rem;
  cursor: pointer;
}
</style>
