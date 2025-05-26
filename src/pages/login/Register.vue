<template>
  <div class="wrap">
    <div class="header"><h1>회원가입</h1></div>
    <div class="container">
      <div class="content">
        <form class="register_form">
          <div class="form_content">
            <div class="form_list">
              <div class="input_user_id">
                <input type="text" class="id" v-model="id" />
              </div>
              <div class="input_user_pw">
                <input type="password" class="pw" v-model="pw" />
              </div>
              <div class="input_user_email">
                <input type="text" class="email" v-model="email" />
              </div>
            </div>
            <div class="form_list"></div>
          </div>
          <div class="register_btn_wrap">
            <button type="submit" class="register_btn">회원가입</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup></script>
<style scoped></style>
