<template>
  <div v-if="place">
    <div class="wrap">
      <header>
        <p class="title">{{ place.name }}</p>
      </header>
      <div class="container">
        <div class="content">
          <img :src="place.image" alt="장소 이미지" />
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <p>오류</p>
  </div>
</template>
<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const testId = 1;
const place = ref(null);

onMounted(async () => {
  try {
    const res = await axios.get(`http://localhost:3000/places?id=${testId}`);
    place.value = res.data[0];
  } catch (error) {
    console.error('에러', error);
  }
});
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  font-weight: bold;
  line-height: 1;
  letter-spacing: 0;
}
header {
  font-size: 2rem;
  padding: 2.03125rem;
}
/* class */
.wrap {
  width: 360px;
  height: 740px;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
  display: flex;
  background-color: #f6f6f6;
}
.container {
  flex-grow: 1;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
