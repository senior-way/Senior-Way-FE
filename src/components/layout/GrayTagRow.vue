<template>
  <div class="row">
    <div class="tag bodyBold16px">{{ label }}</div>
    <div class="desc bodyMedium20px">{{ text }}</div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: { type: String, required: true },
  text: { type: String, required: true }
})
</script>

<style scoped>
.row{
  width: 300px;                    
  display: grid;
  grid-template-columns: 72px 1fr;  
  column-gap: 4px;                 
  align-items: start;
  box-sizing: border-box;
  margin-top: 20px;                  
}
.row:first-child{ margin-top: 0; }  /* 첫 행은 간격 제거 */

.tag{
  width: 72px;
  height: 24px;
  padding-top: 3px;
  background: var(--color-lightgray);
  color: var(--color-black);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  letter-spacing: -0.03em;
}

.desc{
  color: var(--color-black);
  white-space: pre-wrap;   /* \n */
  word-break: break-all;   /* 글자 단위 줄바꿈 */
  line-height: 1.2;
  letter-spacing: -0.03em;
  padding: 0 4px;        
  box-sizing: border-box;  
}
</style>
