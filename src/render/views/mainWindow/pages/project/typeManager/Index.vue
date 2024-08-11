<template>
TypeManager
	{{route.query}}
</template>

<script setup lang="ts">
import {useRoute} from "vue-router";

defineOptions({name: "ProjectTypeManager"})

const route = useRoute()
</script>

<style scoped lang="less">

</style>
