<!-- src/newpages/guardian/GuardianHomePage.vue -->
<template>
  <main class="page">
    <section class="container">
      <div class="list">
        <!-- 1. 사용자 연동 -->
        <BigIconCardBtn
          :icon="icons.connect"
          title="사용자 연동"
          desc="연동하고자 하는 사용자의 이메일을 입력한 뒤, 승인 과정을 진행합니다."
          variant="primary"
          :disabled="linkBtnDisabled"
          :icon-opacity="0.8"
          @click="openLinkModal"
        />

        <!-- 2. 사용자 일정 확인 -->
        <BigIconCardBtn
          :icon="icons.schedule"
          title="사용자 일정 확인"
          desc="연동된 사용자가 저장한 모든 일정을 확인할 수 있습니다."
          variant="red"
          @click="goSchedule"
        />

        <!-- 3. 사용자 위치 확인 -->
        <BigIconCardBtn
          :icon="icons.location"
          title="사용자 위치 확인"
          desc="연동된 사용자의 실시간 위치를 확인할 수 있습니다."
          variant="blue"
          :icon-opacity="0.9"
          @click="goLocation"
        />
      </div>

      <!-- 하단 작은 버튼 둘-->
      <div class="mini-actions">
        <button class="mini-btn" type="button" @click="showGuide">
          <img class="mini-icon" :src="mini.manual" alt="" />
          <span class="mini-label bodyMedium14px">이용 안내</span>
        </button>
        <button class="mini-btn" type="button" @click="goMyPage">
          <img class="mini-icon" :src="mini.personal" alt="" />
          <span class="mini-label bodyMedium14px">마이페이지</span>
        </button>
      </div>
    </section>

    <div v-if="linkOpen" class="modal-backdrop" @click.self="closeLinkModal">
      <div class="modal-card">
        <h3 class="modal-title bodyBold20px">피보호자 연동</h3>
        <label class="field">
          <span class="field-label bodyMedium14px">피보호자 이메일</span>
          <input
            v-model.trim="wardEmail"
            class="modal-input bodyMedium16px"
            type="email"
            placeholder="예: seniorway@google.com"
            autocomplete="email"
            @keyup.enter="confirmLink"
          />
        </label>
        <label class="field">
          <span class="field-label bodyMedium14px">피보호자 이름</span>
          <input
            v-model.trim="wardName"
            class="modal-input bodyMedium16px"
            type="text"
            maxlength="20"
            placeholder="예: 홍길동"
            autocomplete="name"
            @keyup.enter="confirmLink"
          />
        </label>
        <div class="modal-actions">
          <button class="btn ghost bodyMedium16px" @click="closeLinkModal">취소</button>
          <button
            class="btn primary bodyMedium16px"
            :disabled="!canLink || linking"
            @click="confirmLink"
          >
            {{ linking ? '전송 중…' : '연동 메일 전송' }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import BigIconCardBtn from '@/newpages/guardian/components/BigIconButton.vue'

import iconConnect from '@/assets/icons/home/guardian-connect.png'
import iconSchedule from '@/assets/icons/home/guardian-schedule.png'
import iconLocation from '@/assets/icons/home/guardian-location.png'
import iconManual from '@/assets/icons/home/manual.png'
import iconPersonal from '@/assets/icons/home/personal.png'

const icons = {
  connect: iconConnect,
  schedule: iconSchedule,
  location: iconLocation || iconSchedule,
}
const mini = { manual: iconManual, personal: iconPersonal }

const router = useRouter()
function goSchedule() { router.push({ name: 'SavedScheduleListV2' }) }
function goLocation() { router.push({ name: 'LocationV2' }) }
function goMyPage()   { router.push({ name: 'MyPageV2' }) }
function showGuide()  { alert('준비중입니다.') }

const linkOpen = ref(false)
const wardEmail = ref('')
const wardName  = ref('')
const linking   = ref(false)
const linked    = ref(false)
const linkedWard = ref(null)

const linkBtnDisabled = computed(() => linked.value || linking.value)
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const canLink = computed(() => emailRe.test(wardEmail.value))

function openLinkModal() {
  if (linked.value) return
  linkOpen.value = true
  nextTick(() => document.querySelector('.modal-input')?.focus())
}
function closeLinkModal() {
  linkOpen.value = false
  wardEmail.value = ''
  wardName.value = ''
}

async function loadLinkedStatus() {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/user-guardians/status`,
      { withCredentials: true }
    )
    linked.value = !!data?.linked
    linkedWard.value = data?.ward || null
  } catch {
    linked.value = false
    linkedWard.value = null
  }
}

async function confirmLink() {
  if (!canLink.value || linking.value) return
  linking.value = true
  try {
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/alarm/guardian/invite`,
      null,
      {
        params: {
          wardEmail: wardEmail.value.trim(),
          wardName : wardName.value.trim() || undefined,
        },
        withCredentials: true,
      }
    )
    alert('연동 메일 전송이 완료되었습니다.')
    closeLinkModal()
  } catch {
    alert('메일 전송에 실패했습니다. 다시 시도해주세요.')
  } finally {
    linking.value = false
  }
}

onMounted(() => {
  loadLinkedStatus()
  linkedWard.value = null
})
</script>

<style scoped>
.page { 
  padding: 1rem; 
}

.list {
  display: grid;
  gap: 16px;
  justify-items: center;
}

.mini-actions{
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  width: 100%;
  max-width: 360px;
  justify-items: center;
}

.mini-btn{
  width: 145px;
  height: 88px;
  border-radius: 12px;
  background: var(--color-white);
  display: grid;
  place-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 12px;
}
.mini-icon{
  width: 44px; height: 44px; object-fit: contain; display: block;
}
.mini-label{
  color: var(--color-black);
  line-height: 1;
}

.modal-backdrop{
  position: fixed; inset: 0;
  background: rgba(0,0,0,.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 100;
}
.modal-card{
  width: calc(100% - 2rem); max-width: 440px;
  background: var(--color-white);
  border-radius: 12px; padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
}
.modal-title{ margin: 0 0 10px; color: var(--color-black); }
.field{ display: grid; gap: 6px; margin-top: 10px; }
.field-label{ color: var(--color-mediumgray); }
.modal-input{
  width: 100%; height: 42px; padding: 0 12px;
  border: 1px solid var(--color-mediumgray); border-radius: 8px; outline: none;
}
.modal-input:focus{ border-color: var(--color-primary); box-shadow: 0 0 0 3px rgba(0,0,0,.02); }
.modal-actions{
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 14px;
}
.btn{
  height: 44px; border-radius: 10px;
  display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--color-mediumgray);
  background: var(--color-white); color: var(--color-black);
}
.btn.primary{ background: var(--color-primary); border-color: var(--color-primary); color: var(--color-white); }
.btn:disabled{ opacity: .6; cursor: not-allowed; }
</style>
