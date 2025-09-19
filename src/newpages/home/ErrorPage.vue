<template>
  <main class="nf-root" role="main" aria-labelledby="nf-title">
    <img
      class="nf-img"
      :src="img404"
      alt="페이지를 찾을 수 없습니다"
      decoding="async"
    />
    <div>
      <h1 id="nf-title" class="nf-title bodyBold28px">
        페이지를 찾을 수 없습니다
      </h1>

      <p class="nf-text bodyMedium18px">
        주소가 바뀌었거나 잘못 눌렀을 수 있어요.
        <br />
        아래 버튼을 눌러 홈으로 이동해 주세요.
      </p>
    </div>
    <form @submit.prevent="goHome" class="nf-form">
      <SubmitBtn label="홈으로 가기" variant="primary" />
    </form>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import img404 from '@/assets/icons/error-404.png'
import SubmitBtn from '@/components/button/SubmitButton.vue' 

const router = useRouter()
function goHome () {
  router.push({ name: 'HomeV2' })
}
</script>

<style scoped>
.nf-root {
  min-height: calc(100vh - 64px);
  display: grid;
  place-items: center;
  text-align: center;
  padding: 24px 16px;
  color: var(--color-black);
  letter-spacing: -0.02em;
}

.nf-img {
  width: min(300px, 70vw);
  height: auto;
  object-fit: contain;
  margin-bottom: 14px;
}

.nf-title {
  margin: 0 0 8px 0;
  color: var(--color-black);
}

.nf-text {
  margin: 0 0 4rem 0;
  color: var(--color-darkgray);
  line-height: 1.4;
  word-break: keep-all;
}

.nf-form {
  display: inline-block;
}
</style>
