<template>
  <div>
    <KForm :model="form" :rules="rules" ref="KForm">
      <KFormItem label="用户名: " prop="username">
        <KInput
          v-model="form.username"
          placeholder="请输入用户名"
          type="text"
        />
      </KFormItem>
      <KFormItem label="密码: " prop="password">
        <KInput
          v-model="form.password"
          placeholder="请输入密码"
          type="password"
        />
      </KFormItem>
      <KFormItem>
        <button @click="submit">提交</button>
      </KFormItem>
    </KForm>
  </div>
</template>

<script>
import KForm from "./KForm";
import KFormItem from "./KFormItem.vue";
import KInput from "./KInput.vue";
export default {
  data() {
    return {
      form: {
        username: "Tom",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "用户名是必填的!" }],
        password: [{ required: true, message: "密码是必填的!" }],
      },
    };
  },
  components: {
    KInput,
    KFormItem,
    KForm,
  },
  methods: {
    submit() {
      this.$refs["KForm"].validate((valid) => {
        if (valid) {
          console.log("可以提交了");
          this.$notice({ title: "提示", message: "可以提交了" });
        } else {
          console.log("没有通过验证");
        }
      });
    },
  },
};
</script>

<style>
</style>