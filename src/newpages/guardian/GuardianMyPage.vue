<!-- src/newpages/home/MyPage.vue -->
<template>
  <main class="profile">
    <SimpleHeader title="내 정보 관리" />

    <section class="panel">
      <div class="panel-content">
        <img :src="profileImg" alt="프로필 이미지" class="avatar" />

        <div class="rows">
          <GrayTagRow2 label="이름"     :text="profile.name"  />
          <GrayTagRow2 label="이메일"   :text="profile.email" />
          <GrayTagRow2 label="생년월일" :text="profile.birth" />
        </div>

        <div class="action-grid">
          <SmallIconButton
            :icon="iconContact"
            label="문의 하기"
            bordered
            @click="onContact"
          />
          <SmallIconButton
            :icon="iconLogout"
            label="로그아웃"
            bordered
            @click="doLogoutWithNotice"
          />
          <SmallIconButton
            :icon="iconPassword"
            label="비밀번호 변경"
            bordered
            @click="openPwdModal('changePw')"
          />
          <SmallIconButton
            :icon="iconWithdraw"
            label="회원 탈퇴"
            bordered
            @click="openPwdModal('withdraw')"
          />
        </div>
      </div>
    </section>

    <!-- 문의하기 알림 -->
    <NoticeModal
      v-model="contactNoticeOpen"
      title="알림"
      message="준비중입니다!"
      confirmText="확인"
    />

    <!-- 비밀번호 확인 (비번변경/회원탈퇴) -->
    <PasswordConfirmModal
      v-model="pwdOpen"
      :loading="pwdLoading"
      :error="pwdError"
      @submit="onPwdSubmit"
    />

    <!-- 회원탈퇴 최종 확인 -->
    <NoticeModal
      v-model="withdrawConfirmOpen"
      title="확인"
      message="회원 탈퇴를 진행하시겠습니까?"
      confirmText="탈퇴하기"
      @confirm="onWithdrawConfirm"
    />

    <!-- 비밀번호 변경 완료 알림 (확인 시 로그아웃하고/ 로그인 페이지 이동) -->
    <NoticeModal
      v-model="pwChangedOpen"
      title="완료"
      message="비밀번호 변경이 완료되었습니다."
      confirmText="확인"
      @confirm="doLogoutToLogin"
    />

    <!-- 로그아웃 완료 알림 (확인 누르면/ 홈페이지 이동) -->
    <NoticeModal
      v-model="logoutDoneOpen"
      title="알림"
      message="로그아웃 되었습니다."
      confirmText="확인"
      @confirm="goHomeAfterLogout"
    />
  </main>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'

import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import GrayTagRow2 from '@/newpages/guardian/components/GrayTagRow2.vue'
import PasswordConfirmModal from '@/newpages/home/components/PasswordConfirmModal.vue'
import NoticeModal from '@/newpages/home/components/NoticeModal.vue'
import SmallIconButton from '@/newpages/guardian/components/SmallIconButton.vue'

import profileImg from '@/assets/img/profile_img.jpg'
import iconContact from '@/assets/icons/qa.png'
import iconLogout from '@/assets/icons/logout.png'
import iconPassword from '@/assets/icons/pw-change.png'
import iconWithdraw from '@/assets/icons/delete-account.png'

const router = useRouter()
const route  = useRoute()
const baseUrl = import.meta.env.VITE_API_BASE_URL

const profile = ref({ name: '', email: '', birth: '' })

async function fetchUserInfo() {
  try {
    const accessToken = localStorage.getItem('accessToken')
    const { data } = await axios.get(`${baseUrl}/user`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
    profile.value = {
      name: data.username,
      email: data.email,
      birth: data.birth ? data.birth : ''
    }
  } catch (error) {
    console.error('유저 정보 가져오기 실패', error)
  }
}
onMounted(fetchUserInfo)

/* 문의하기 */
const contactNoticeOpen = ref(false)
function onContact () { contactNoticeOpen.value = true }

/* 로그아웃 */
function clearAuth() {
  // await axios.post('/api/auth/logout', null, { withCredentials: true })
  localStorage.removeItem('accessToken')
  localStorage.removeItem('role')
}
const logoutDoneOpen = ref(false)
function doLogoutWithNotice () { clearAuth(); logoutDoneOpen.value = true }
function goHomeAfterLogout () { router.replace({ name: 'AuthHomeV2' }) }

/* 비밀번호 변경 완료 → 로그인 이동 */
const pwChangedOpen = ref(false)
function doLogoutToLogin () { clearAuth(); router.replace({ name: 'LoginV2' }) }

/* 비번 확인 */
const pwdOpen = ref(false)
const pwdLoading = ref(false)
const pwdError = ref('')
const pwdAction = ref/** @type {'withdraw'|'changePw'|null} */(null)
function openPwdModal(action) { pwdAction.value = action; pwdError.value = ''; pwdOpen.value = true }
async function onPwdSubmit(currentPw) {
  if (pwdLoading.value) return
  pwdLoading.value = true
  pwdError.value = ''
  try {
    // await axios.post('/api/auth/verify-password', { password: currentPw }, { withCredentials: true })
    if ((currentPw || '').length < 4) throw new Error('INVALID')
    pwdOpen.value = false
    if (pwdAction.value === 'changePw') {
      router.push({ name: 'AuthHomeV2', query: { modal: 'changePw' } })
    } else if (pwdAction.value === 'withdraw') {
      withdrawConfirmOpen.value = true
    }
  } catch (e) {
    pwdError.value = '비밀번호가 올바르지 않습니다.'
  } finally {
    pwdLoading.value = false
  }
}

/* 회원탈퇴 */
const withdrawConfirmOpen = ref(false)
async function onWithdrawConfirm () { clearAuth(); router.replace({ name: 'AuthHomeV2' }) }

/* 비번 변경 완료 플래그 감지 */
function clearPwChangedFlag() {
  const q = { ...route.query }
  delete q.pwChanged
  router.replace({ query: q })
}
function checkPwChangedFlag() {
  if (route.query.pwChanged) { pwChangedOpen.value = true; clearPwChangedFlag() }
}
onMounted(checkPwChangedFlag)
watch(() => route.query.pwChanged, () => checkPwChangedFlag())
</script>

<style scoped>
.profile{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.panel{
  width: 100%;
  max-width: 420px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 1rem;
}
.panel-content{
  width: 100%;
  max-width: 420px;
  min-height: 620px;
  display: grid;
  justify-items: center;
  row-gap: 10px;
  background: var(--color-white);
  border-radius: 12px;
  padding: 16px;
}
.avatar{
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin-top: 8px;
  margin-bottom: 8px;
}
.rows{
  width: 100%;
  display: grid;
  justify-items: center;
  row-gap: 0;
}

/* 액션 버튼 컨테이너 */
.action-grid{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 6px;  
  justify-items: center;
  margin-top: 12px;
}

.action-grid :deep(.mini-btn){
  --sib-width: 132px;
  --sib-height: 84px;
  --sib-padding: 10px;
  --sib-icon-size: 24px;
  --sib-border-color: var(--color-lightgray);
  margin: 0; 
}
</style>
