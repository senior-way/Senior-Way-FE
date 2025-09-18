<template>
  <main class="auth-home">
    <section class="cards">
      <AuthCardButton
        title="회원가입"
        subtitle="처음 방문했어요!"
        :to="{ name: 'SignupSelectV2' }"
      />
      <AuthCardButton
        title="로그인"
        subtitle="일반 계정이 있어요!"
        :to="{ name: 'LoginV2' }"
      />
    </section>

    <section class="kakao">
      <button class="kakao-btn" type="button" @click="onKakaoLogin">
        <img
          src="@/assets/img/kakao_login.png"
          alt="카카오 로그인"
          width="250"
          height="auto"
          loading="eager"
        />
      </button>
      <p class="kakao-caption bodyMedium16px">카카오 계정으로 가입했어요!</p>
    </section>
  </main>
</template>

<script setup>
import AuthCardButton from '@/newpages/auth/components/AuthHomeBtn.vue'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()


// .env에서 값 가져오기
const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_KAKAO_REDIRECT_URI
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 1️⃣ 카카오 로그인 버튼 클릭 시 Authorization URL로 이동
function onKakaoLogin() {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`
  window.location.href = kakaoAuthUrl
}

// 2️⃣ 카카오 Redirect URI로 돌아왔을 때
// 프론트 kakao/callback.vue
onMounted(async () => {
  const code = new URLSearchParams(window.location.search).get('code')
  if (!code) return

  console.log(code)
  const res = await axios.get(`${API_BASE_URL}/api/oauth/kakao/callback`, {
    params: { code },
    withCredentials: true
  })

  localStorage.setItem('accessToken', res.data.accessToken)
  router.replace('/') 
})


// axios 전역 설정
axios.defaults.withCredentials = true


</script>


<style scoped>
.auth-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 5rem 0 2.5rem;
  min-height: calc(100dvh - var(--app-header-height, 4rem));
}

.cards {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.kakao {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.kakao-btn {
  display: inline-flex;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  border-radius: 12px;  
  line-height: 0;
  box-shadow: 0 6px 16px rgba(0,0,0,.08);
  transition: transform .12s ease, box-shadow .12s ease;
}

.kakao-btn:active { transform: translateY(0); box-shadow: 0 6px 16px rgba(0,0,0,.06); }

.kakao-caption {
  margin: 0;
  color: var(--color-mediumgray);
  text-align: center;
}
</style>
