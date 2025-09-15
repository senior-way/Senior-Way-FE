<template>
  <main class="login">
    <section class="panel">
      <div class="form">
        <!-- 이메일 입력 -->
        <div class="field email">
          <TextInput v-model="email" as="email">
            <template #label>이메일을 입력해주세요.</template>
          </TextInput>
        </div>

        <!-- 비밀번호 입력 -->
        <div class="field password">
          <TextInput v-model="pw" as="text" type="password">
            <template #label>비밀번호를 입력해주세요.</template>
          </TextInput>
        </div>
      </div>

      <!-- 버튼 -->
      <div class="cta">
        <SubmitButton label="로그인" @click="login" />
        <SubmitButton label="아이디/비밀번호 찾기" variant="mediumgray" @click="goFind" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import TextInput from '@/components/input/TextInput.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'
import { useRouter } from 'vue-router'

const email = ref('')
const pw = ref('')
const router = useRouter()

async function login() {
  if (!email.value || !pw.value) {
    alert('이메일과 비밀번호를 입력해주세요.')
    return
  }

  try {
    const res = await axios.post('http://localhost:8080/api/auth/login', {
      email: email.value,
      password: pw.value
    }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true // 중요: HttpOnly 쿠키(refreshToken) 포함
    })

    console.log('로그인 성공', res.data)

    // accessToken 저장
    const accessToken = res.data.accessToken
    localStorage.setItem('accessToken', accessToken)

    // 로그인 성공하면 루트 페이지로 이동
    router.push('/')
  } catch (err) {
    console.error('로그인 실패', err.response?.data || err.message)
    alert('로그인 실패: 이메일/비밀번호를 확인해주세요.')
  }
}


function goFind() {
  console.log('go to find account/password')
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0 24px;
}

.panel {
  width: 100%;
  max-width: 420px;
  min-height: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 0 24px;
}

.form {
  width: 100%;
  max-width: 420px;
  display: grid;
  justify-items: center;
}

.field.email {
  margin-top: 5rem;
}

.field.password {
  margin-top: 3rem;
}

:deep(.text-input) {
  width: 300px;
}

:deep(.text-input .label) {
  width: 300px;
}

.cta {
  width: 100%;
  max-width: 420px;
  margin-top: 2rem;
  display: grid;
  row-gap: 0.5rem;
  justify-items: center;
}
</style>
