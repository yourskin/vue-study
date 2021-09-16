<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "KForm",
  props: {
    model: {
      type: Object,
      default() {
        return {};
      },
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    validate(cb) {
      const tasks = this.$children
        .filter((item) => item.prop)
        .map((item) => item.validate());
      Promise.all(tasks)
        .then(() => {
          cb(true);
        })
        .catch(() => {
          cb(false);
        });
    },
  },
};
</script>

<style>
</style>