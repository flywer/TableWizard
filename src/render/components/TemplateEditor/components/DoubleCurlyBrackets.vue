<template>
  &lbrace;&lbrace;{{ content }}&rbrace;&rbrace;
</template>

<script>
export default {
  name: 'DoubleCurlyBrackets',
  props: {
    content: {
      type: String,
      required: false,
    },
  },
};
</script>
