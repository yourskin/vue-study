<template>
  <div class="K-form-item">
    <label>{{ label }}</label>
    <slot></slot>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import Schema from "async-validator";
export default {
  name: "KFormItem",
  props: {
    label: String,
    prop: String,
  },
  data() {
    return {
      error: "",
    };
  },
  mounted() {
    this.$on("onchange", () => {
      this.validate();
    });
  },
  methods: {
    validate() {
      const rule = this.$parent.rules[this.prop];
      const value = this.$parent.model[this.prop];
      const validator = new Schema({ [this.prop]: rule });
      return validator.validate({ [this.prop]: value }, (valid) => {
        if (valid) {
          this.error = valid[0].message;
        } else {
          this.error = "";
        }
      });
    },
  },
};
</script>

<style>
</style>