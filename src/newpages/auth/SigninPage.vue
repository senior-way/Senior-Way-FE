<template>
  <main class="signin">
    <StepBreadcrumb
      v-if="currentKey !== 'review'"
      :steps="steps"
      :current="currentKey"
      :clickable="true"
      @update:current="goToPrev"
    />

    <section class="panel" :class="`step-${currentKey}`">
      <template v-if="currentKey === 'terms'">
        <div class="panel-content">
          <p class="panel-title bodyBold24px">
            개인정보 이용 동의 여부를<br />체크해주세요.
          </p>

          <label class="agree-line bodyMedium18px">
            <input class="agree-check" type="checkbox" v-model="agree" />
            [필수] 개인정보 수집 및 이용 동의
          </label>
          <p class="subnote bodyMedium16px">
            수집 개인정보 : 이메일, 이름, 성별, 생년월일
          </p>

          <div class="terms-box bodyMedium18px" role="region" aria-label="약관 상세" tabindex="0">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas
            consectetur voluptatem minus? Perspiciatis, animi? Culpa, laudantium
            beatae eligendi sequi illum tempora, explicabo quidem ipsam doloribus
            ad recusandae quo doloremque repudiandae? Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Explicabo, facilis hic. Aspernatur id
            doloribus, non, dicta atque facilis alias tenetur voluptate repellat
            omnis dolores provident nostrum saepe optio minus neque.
            <br /><br />
            Ex quibusdam veritatis officia qui iusto earum sint eaque possimus
            quos delectus voluptates eius sapiente cumque provident eveniet
            officiis corporis unde, fugit commodi! Accusamus incidunt hic id enim
            alias voluptates.
            <br /><br />
            Magnam, quia ipsum. Eveniet in eaque porro commodi voluptate quam,
            vero amet qui fuga ad sit dolores doloribus ipsam omnis minima velit
            quidem fugiat placeat libero. Laboriosam nostrum dolor nisi.
          </div>
        </div>

        <div class="cta-gap">
          <SubmitButton
            label="회원가입 계속 진행하기"
            :disabled="!agree"
            @click="next()"
          />
        </div>
      </template>

      <template v-else-if="currentKey === 'email'">
        <div class="panel-content">
          <TextInput
            v-model="email"
            as="email"
            placeholder="name@example.com"
          >
            <template #label>사용하실 <em>이메일</em>을 입력해주세요.</template>
          </TextInput>
        </div>

        <div class="cta-gap">
          <SubmitButton
            label="이메일 중복 확인"
            :disabled="!isEmailValid"
            @click="next()"
          />
        </div>
      </template>

      <template v-else-if="currentKey === 'pw'">
        <div class="panel-content">
          <TextInput v-model="pw" as="text" placeholder="8~20자, 영문/숫자 조합">
            <template #label><em>비밀번호</em>를 입력해주세요.</template>
          </TextInput>
        </div>

        <div class="cta-gap">
          <SubmitButton label="다음 페이지" :disabled="pw.length < 8" @click="next()" />
        </div>
      </template>

      <template v-else-if="currentKey === 'pw2'">
        <div class="panel-content">
          <TextInput v-model="pw2" as="text" placeholder="비밀번호 재입력">
            <template #label><em>비밀번호</em>를 한 번 더 입력해주세요.</template>
          </TextInput>
        </div>

        <div class="cta-gap">
          <SubmitButton label="다음 페이지" :disabled="pw2 !== pw" @click="next()" />
        </div>
      </template>

      <template v-else-if="currentKey === 'profile'">
        <div class="panel-content">
          <div class="form-stack">
            <TextInput v-model="name" as="text">
              <template #label><em>이름</em>을 입력해주세요.</template>
            </TextInput>

            <TextInput
              v-model="gender"
              as="select"
              :options="['남성', '여성', '기타']"
              placeholder="성별 선택"
            >
              <template #label><em>성별</em>을 선택해주세요.</template>
            </TextInput>

            <WheelDateInput v-model="birth" start="1965-01-01">
              <template #label><em>생년월일</em>을 선택해주세요.</template>
            </WheelDateInput>
          </div>
        </div>

        <div class="cta-gap">
          <SubmitButton
            label="다음 페이지"
            :disabled="!name || !gender || !birth"
            @click="goReview()"
          />
        </div>
      </template>

      <template v-else-if="currentKey === 'review'">
        <div class="panel-content">
          <p class="review-title bodyBold24px">
            내가 입력한 정보가 맞는지<br />다시 한번 확인해주세요.
          </p>

          <div class="review-card">
            <div class="review-row">
              <div class="review-label bodyMedium20px">이메일:</div>
              <div class="review-value bodyMedium20px">{{ email }}</div>
            </div>
            <div class="review-row pw">
              <div class="review-label bodyMedium20px">비밀번호:</div>
              <div class="review-value bodyMedium20px">{{ showPw ? pw : maskedPw }}</div>
              <button
                type="button"
                class="pw-toggle"
                :aria-pressed="showPw ? 'true' : 'false'"
                aria-label="비밀번호 표시 전환"
                @click="showPw = !showPw"
              >
                <img :src="showPw ? pwOpen : pwClosed" alt="" />
              </button>
            </div>
            <div class="review-row">
              <div class="review-label bodyMedium20px">이름:</div>
              <div class="review-value bodyMedium20px">{{ name }}</div>
            </div>
            <div class="review-row">
              <div class="review-label bodyMedium20px">성별:</div>
              <div class="review-value bodyMedium20px">{{ gender }}</div>
            </div>
            <div class="review-row">
              <div class="review-label bodyMedium20px">생년월일:</div>
              <div class="review-value bodyMedium20px">{{ birth }}</div>
            </div>
          </div>

          <p class="review-note bodyMedium20px">
            잘못된 부분이 있다면<br /> 뒤로가기를 눌러 이전 페이지로 <br />돌아가서 다시 선택해주세요.
          </p>
        </div>

        <div class="cta-gap review-actions">
          <SubmitButton label="회원가입을 완료하겠습니다." @click="submit()" />
          <SubmitButton label="뒤로가서 다시 선택하겠습니다." variant="mediumgray" @click="currentKey='profile'" />
        </div>
      </template>
    </section>

    <SimpleModal
      v-model="modalOpen"
      message="회원가입이 완료되었습니다!"
      @confirm="onModalConfirm"
    />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import StepBreadcrumb from '@/components/layout/StepBreadcrumb.vue'
import TextInput from '@/components/input/TextInput.vue'
import WheelDateInput from '@/components/input/DateInput.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'
import SimpleModal from '@/components/layout/SimpleModal.vue'

import pwClosed from '@/assets/icons/pw_hide_eye.png'
import pwOpen from '@/assets/icons/pw_show_eye.png'

const steps = [
  { key: 'terms',   label: '정보제공 동의' },
  { key: 'email',   label: '이메일' },
  { key: 'pw',      label: '비밀번호' },
  { key: 'pw2',     label: '비밀번호 확인' },
  { key: 'profile', label: '개인정보' },
]

const currentKey = ref('terms')
const idx = computed(() => steps.findIndex(s => s.key === currentKey.value))

const agree  = ref(false)
const email  = ref('')
const pw     = ref('')
const pw2    = ref('')
const name   = ref('')
const gender = ref('')
const birth  = ref('')

const isEmailValid = computed(() => /\S+@\S+\.\S+/.test(email.value))
const maskedPw = computed(() => pw.value ? '•'.repeat(Math.max(8, pw.value.length)) : '')
const showPw = ref(false)

const modalOpen = ref(false)

function next () {
  if (idx.value < steps.length - 1) currentKey.value = steps[idx.value + 1].key
}
function goToPrev (key) {
  const target = steps.findIndex(s => s.key === key)
  if (target <= idx.value) currentKey.value = key
}
function goReview () {
  currentKey.value = 'review'
  showPw.value = false
}
function submit () {
  modalOpen.value = true
}
function onModalConfirm () {
  modalOpen.value = false
}
</script>

<style scoped>
.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 12px 0 24px;
  --review-btn-h: 50px;
  --review-gap: 10px;
}

.panel {
  width: 100%;
  max-width: 420px;
  min-height: var(--frame-min, 560px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px 0 24px;
  --cta-gap: 2rem;
}

.panel-content {
  width: 100%;
  max-width: 420px;
  display: grid;
  justify-items: center;
  row-gap: 8px;
  flex: 1 1 auto;
}

.form-stack {
  width: 100%;
  display: grid;
  justify-items: center;
  row-gap: 14px;
}

.panel-title {
  width: 300px;
  margin-top: 4px;
  margin-bottom: 0;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.agree-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 300px;
  color: var(--color-black);
}
.agree-check {
  width: 1.5rem;
  height: 1.5rem;
  accent-color: var(--color-primary);
  letter-spacing: -0.03em;
}
.subnote {
  margin: 0;
  width: 300px;
  color: var(--color-mediumgray);
  letter-spacing: -0.03em;
}

.terms-box {
  width: 300px;
  height: 272px;
  padding: 12px;
  overflow: auto;
  border: 1px solid var(--color-lightgray);
  background: #fff;
  color: var(--color-black);
  line-height: 1;
}

.step-review .panel-content { padding-top: 8px; }

.review-title {
  width: 300px;
  line-height: 1.3;
  letter-spacing: -0.02em;
}

.review-card {
  width: 300px;
  background: #fff;
  border: 1px solid var(--color-lightgray);
  border-radius: 12px;
  padding: 16px;
  display: grid;
  row-gap: 12px;
}

.review-row {
  display: grid;
  grid-template-columns: 90px 1fr;
  column-gap: 0;
  align-items: center;
}

.review-row.pw { grid-template-columns: 90px 1fr auto; }

.review-label {
  color: var(--color-black);
  white-space: nowrap;
}

.review-value { color: var(--color-black); }

.pw-toggle{
  background: none;
  border: none;
  padding: 0;
  width: 32px; height: 32px;
  display: grid; place-items: center;
  cursor: pointer;
}
.pw-toggle img{ width: 20px; height: 20px; display: block; }

.review-note {
  width: 300px;
  color: var(--color-mediumgray);
  text-align: center;
  margin: 2rem 0;
  letter-spacing: -0.03em;
  line-height: 1.2;
}

/* .cta-gap { margin-top: var(--cta-gap); } */

.review-actions { display: grid; row-gap: var(--review-gap); }

.step-email { --cta-gap: 12px; }
.step-pw    { --cta-gap: 20px; }
</style>
