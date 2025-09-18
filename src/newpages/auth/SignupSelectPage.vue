<!-- src/newpages/auth/SignupSelectPage.vue -->
<template>
  <main class="signup-select" role="main" aria-label="회원가입 선택">
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
.signup-select {
  padding: 6.5rem 32px;
}

.cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(20px, 4vh, 48px);
  width: 100%;
  max-width: 420px; 
  margin: 0 auto;
}

.cards > *:not(:last-child) {
  margin-bottom: 4px;
}
</style>
