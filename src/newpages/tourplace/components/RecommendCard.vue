<template>
  <div
    class="spot-card"
    :class="{ selected }"
    role="button"
    :aria-pressed="selected ? 'true' : 'false'"
    tabindex="0"
    @click="emit('toggle', id)"
    @keydown.enter.prevent="emit('toggle', id)"
    @keydown.space.prevent="emit('toggle', id)"
  >
    <button
      class="select-badge"
      :class="{ on: selected }"
      type="button"
      :aria-label="selected ? '선택됨' : '선택'"
      @click.stop="emit('toggle', id)"
    >
      <svg viewBox="0 0 24 24" class="check-icon" aria-hidden="true">
        <path
          d="M20 6L9 17l-5-5"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <div class="thumb-wrap">
      <img :src="image" :alt="name" class="spot-image" />
      <div v-if="selected" class="thumb-overlay"></div>
    </div>

    <div class="card-content">
      <h3 class="spot-title bodyBold26px">
        {{ name }}
        <span v-if="selected" class="pill-selected bodyMedium16px">선택됨</span>
      </h3>

      <div v-if="tags?.length" class="tag-container">
        <span v-for="tag in tags" :key="tag" class="tag bodyMedium16px">#{{ tag }}</span>
      </div>

      <div class="card-footer">
        <button type="button" class="detail-btn bodyMedium20px" @click.stop="emit('detail', id)">
          자세히 보기
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  id: { type: [String, Number], required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  selected: { type: Boolean, default: false }
})

const emit = defineEmits(['toggle', 'detail'])
</script>

<style scoped>
.spot-card {
  position: relative;
  background: var(--color-white);
  border-radius: 12px;
  border: 1.5px solid transparent;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition);
}
.spot-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 4px 6px var(--color-primary-10);
}

.select-badge {
  position: absolute;
  z-index: 2;
  top: 8px;
  right: 8px;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid var(--color-lightgray);
  background: var(--color-white);
  color: transparent;
  display: grid;
  place-items: center;
  transition: var(--transition);
}
.select-badge .check-icon {
  width: 1.5rem;
  height: 1.5rem;
}
.select-badge.on {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-white);
}

.thumb-wrap {
  position: relative;
}

.spot-image {
  width: 100%;
  height: 10rem;
  object-fit: cover;
  display: block;
}

.thumb-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(183, 26, 134, 0.18), rgba(183, 26, 134, 0));
}

.card-content {
  padding: 1rem;
}

.spot-title {
  color: var(--color-black);
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.pill-selected {
  padding: 4px 8px 1px 8px;
  margin-bottom: 2px;
  border-radius: 999px;
  background: var(--color-primary-10);
  color: var(--color-primary);
  letter-spacing: -0.03em;
}

.tag-container {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-start;
}

.tag {
  background: var(--color-lightgray);
  color: var(--color-black);
  padding: 4px 8px 1px 8px;
  border-radius: 1rem;
}

.card-footer {
  margin-top: 1rem;
}

.detail-btn {
  width: 100%;
  height: 40px;
  border: 1px solid var(--color-mediumgray);
  border-radius: 999px;
  background: var(--color-white);
  color: var(--color-black);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.detail-btn:active {
  transform: translateY(1px);
}
</style>
