<!-- src/newpages/auth/SignupSelectPage.vue -->
<template>
  <main class="signup-select">
    <section class="cards">
      <AuthCardButton
        title="일반 회원가입"
        subtitle="사용자 계정 만들기"
        :to="{ name: 'SigninV2' }"
      />
      <AuthCardButton
        title="보호자 회원가입"
        subtitle="가족/보호자용 계정 만들기"
        :to="{ name: 'GuardianSignupV2' }"
      />
    </section>
  </main>
</template>

<script setup>
import AuthCardButton from '@/newpages/auth/components/AuthHomeBtn.vue'
</script>

<style scoped>
.signup-select{
  display:flex; flex-direction:column; align-items:center;
  gap:2rem; 
  padding:6rem 0 2.5rem 0;
}

.cards{
  display:flex; flex-direction:column; align-items:center;
  gap:3rem; width:100%;
}
@media (min-width: 420px){
  .cards{ flex-direction:row; justify-content:center; }
}
</style>
