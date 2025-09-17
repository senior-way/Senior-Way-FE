<!-- src/newpages/home/MyPage.vue -->
<template>
  <main class="profile">
    <SimpleHeader title="내 정보 관리" />

    <section class="panel">
      <div class="panel-content">
        <img :src="profileImg" alt="프로필 이미지" class="avatar" />

        <div class="rows">
          <GrayTagRow label="이름"     :text="profile.name"  />
          <GrayTagRow label="이메일"   :text="profile.email" />
          <GrayTagRow label="생년월일" :text="profile.birth" />
        </div>

        <div class="action-grid">
          <!-- 1행 -->
          <SquareButton label="문의 하기"      :icon="iconContact"   @click="onContact" />
          <SquareButton label="로그아웃"       :icon="iconLogout"    @click="onLogout" />
          <!-- 2행 -->
          <SquareButton label="비밀번호 변경"  :icon="iconPassword"  @click="onChangePw" />
          <SquareButton label="회원 탈퇴"      :icon="iconWithdraw"  @click="onWithdraw" />
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import SimpleHeader from '@/components/layout/SimpleHeader.vue'
import GrayTagRow from '@/components/layout/GrayTagRow.vue'
import SquareButton from '@/components/button/SquareButton.vue'
import profileImg from '@/assets/img/profile_img.jpg'

import iconContact from '@/assets/icons/qa.png'
import iconLogout from '@/assets/icons/logout.png'
import iconPassword from '@/assets/icons/pw-change.png'
import iconWithdraw from '@/assets/icons/delete-account.png'

const router = useRouter()

const profile = {
  name:  '이다연',
  email: 'carrotday0429@gmail.com',
  birth: '1999.10.11.',
}

function onLogout () {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('role')
  router.replace({ name: 'LoginV2' })
}
function onChangePw () {
  router.push({ name: 'AuthHomeV2', query: { modal: 'changePw' } })
}
function onWithdraw () {
  router.push({ name: 'AuthHomeV2', query: { modal: 'withdraw' } })
}
function onContact () {
  router.push({ name: 'AuthHomeV2', query: { modal: 'contact' } })
}
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

.action-grid{
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 8px; 
  justify-items: stretch;
  margin-top: 12px;
}
</style>
