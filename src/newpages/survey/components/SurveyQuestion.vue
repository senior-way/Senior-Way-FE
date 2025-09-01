<template>
  <div class="q-head">
    <!-- 제목(HTML 허용) -->
    <h3 class="q-title bodyBold24px">
      <span v-if="!titleHtml">{{ title }}</span>
      <span v-else v-html="titleHtml"></span>
    </h3>

    <!-- 아이콘 -->
    <div class="q-icon" v-if="$slots.icon || iconSrc" aria-hidden="true">
      <slot name="icon">
        <img v-if="iconSrc" class="icon-img" :src="iconSrc" :alt="iconAlt" />
      </slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: '' },  
  titleHtml: { type: String, default: '' },     //HTML 사용하여 강조
  iconSrc: { type: String, default: '' },       
  iconAlt: { type: String, default: '' }
})
</script>

<style scoped>
.q-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 8px;
  width:100%;
}

.q-title{
  margin:0;
  line-height:1.25;
  word-break:keep-all;
}
.q-title :deep(em),
.q-title :deep(.accent) {
  color: var(--color-primary);
  font-style: normal;
}

.accent{ color: var(--color-primary); }

.q-icon{ flex:0 0 auto; }

.icon-img{ 
    width:40px; 
    height:40px; 
    object-fit:contain; 
}
</style>
