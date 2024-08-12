<template>
  <n-flex id="menu-item" class="items-center" vertical :justify="'center'" :size="2">
    <n-icon :size="22">
      <slot name="icon"/>
    </n-icon>
    <n-text class="text-xs select-none" depth="1">{{ title }}</n-text>
  </n-flex>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
})
</script>

<style scoped lang="less">

</style>
