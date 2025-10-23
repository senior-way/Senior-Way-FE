<template>
  <div
    class="spot-card"
    role="button"
    tabindex="0"
    :aria-label="`${name} 상세 보기`"
    @click="goDetail"
    @keydown.enter.prevent="goDetail"
    @keydown.space.prevent="goDetail"
  >
    <div class="thumb-wrap">
      <img :src="safeImage" :alt="name" class="spot-image" />
    </div>

    <div class="card-row">
      <h3 class="spot-title bodyBold22px">{{ name }}</h3>
      <button
        type="button"
        class="detail-btn bodyMedium16px"
        @click.stop="goDetail"
      >
        상세보기
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import fallBackImage from '@/assets/images/fall-back.png'

const props = defineProps({
  id:    { type: [String, Number], required: true },
  name:  { type: String, required: true },
  image: { type: String, required: true },
})

const safeImage = computed(() => (props.image && String(props.image).trim()) ? props.image : fallBackImage)

const router = useRouter()
function goDetail() {
  router.push(`/tourplace/${props.id}`)
}
</script>

<style scoped>
.spot-card {
  position: relative;
  width: 330px;
  height: 162px;
  background: #fff;
  border: 1px solid var(--color-primary);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.thumb-wrap { position: relative; }
.spot-image {
  display: block;
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-bottom: 1px solid var(--color-primary)
}

.card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 60px;        
  padding: 0 14px;       
}

.spot-title {
  color: var(--color-black);
  letter-spacing: -0.03em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding-top: 4px;
}

.detail-btn {
  flex: 0 0 auto;
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--color-mediumgray);
  background: #fff;
  color: var(--color-black);
  line-height: 34px;
}
.detail-btn:active { transform: translateY(1px); }
</style>
