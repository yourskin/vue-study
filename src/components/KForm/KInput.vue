<template>
  <input :value="value" @input="onchange" v-bind="$attrs" />
</template>

<script>
export default {
  name: "KInput",
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  methods: {
    onchange(e) {
      this.$emit("input", e.target.value);
      // 如果父组件不是FormItem,需要递归实现
      this.$parent.$emit("onchange");
    },
  },
};
</script>

<style>
</style>