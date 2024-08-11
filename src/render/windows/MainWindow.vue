<template>
  <AppBar/>
  <MainLayout/>
  <StatusBar/>
</template>

<script setup lang="ts">
import AppBar from "@render/components/AppBar/index.vue";
import StatusBar from "@render/components/statusBar/StatusBar.vue";
import MainLayout from "@render/views/mainWindow/layouts/MainLayout.vue";
</script>
