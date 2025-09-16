<!-- src/pages/LoginPage.vue -->
<template>
  <main class="login">
    <section class="panel">
      <div class="form">
        <div class="field email">
          <TextInput v-model="email" as="email">
            <template #label>이메일을 입력해주세요.</template>
          </TextInput>
        </div>

        <div class="field password">
          <TextInput v-model="pw" as="text">
            <template #label>비밀번호를 입력해주세요.</template>
          </TextInput>
        </div>
      </div>

      <div class="cta">
        <SubmitButton :disabled="loading" label="로그인" @click="login" />
        <SubmitButton label="아이디/비밀번호 찾기" variant="mediumgray" @click="goFind" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TextInput from '@/components/input/TextInput.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'

const email = ref('')
const pw = ref('')
const loading = ref(false)
const router = useRouter()

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] || ''))
    return String(payload.role || payload.userType || '').toLowerCase()
  } catch { return '' }
}

async function login () {
  if (!email.value || !pw.value) {
    alert('이메일과 비밀번호를 입력해주세요.')
    return
  }
  loading.value = true
  try {
    // ① 실제 로그인 API 연동
    // const res = await fetch('/api/auth/login', {
    //   method:'POST',
    //   headers:{ 'Content-Type':'application/json' },
    //   body: JSON.stringify({ email: email.value, password: pw.value })
    // })
    // if (!res.ok) throw new Error('LOGIN_FAIL')
    // const data = await res.json() // { token, user: { role: 'guardian' | 'user' } }

    // ② 토큰/역할 파싱 (백엔드 응답 형태에 맞춰 둘 중 골라 사용)
    // const role = (data.user?.role || getRoleFromToken(data.token) || 'user').toLowerCase()
    // localStorage.setItem('token', data.token)
    // localStorage.setItem('role', role)

    // 역할에 따라 라우팅
    if (role === 'guardian') {
      router.replace({ name: 'GuardianHomeV2' })
    } else {
      router.replace({ name: 'AuthHomeV2' }) // 일반 홈
    }
  } catch (e) {
    console.error(e)
    alert('로그인에 실패했어요. 다시 시도해줘.')
  } finally {
    loading.value = false
  }
}

function goFind () {
  console.log('go to find account/password')
}
</script>

<style scoped>
.login{
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:12px 0 24px;
}
.panel{
  width:100%;
  max-width:420px;
  min-height:560px;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:8px 0 24px;
}

.form{
  width:100%;
  max-width:420px;
  display:grid;
  justify-items:center;  
}

.field.email{ 
    margin-top:5rem; 
}

.field.password{ 
    margin-top:3rem; 
}


:deep(.text-input){ width:300px; }
:deep(.text-input .label){
  width:300px;
}

.cta{
  width:100%;
  max-width: 420px;
  margin-top: 2rem;
  display:grid;
  row-gap: 0.5rem; 
  justify-items:center;
}
</style>
