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
        <SubmitButton label="로그인" @click="login" />
        <SubmitButton label="아이디/비밀번호 찾기" variant="mediumgray" @click="goFind" />
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import TextInput from '@/components/input/TextInput.vue'
import SubmitButton from '@/components/button/SubmitButton.vue'

const email = ref('')
const pw = ref('')

function login () {
  if (!email.value || !pw.value) {
    alert('이메일과 비밀번호를 입력해주세요.')
    return
  }
  console.log('login', { email: email.value, pw: pw.value })
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
