<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <div>{{ $store.state.count }}</div>
    <div>{{ $store.getters.doubleCount }}</div>
    <div @click="$store.commit('addCount', 2)">+</div>
    <div>{{ $store.state.num }}</div>
    <div @click="$store.dispatch('asyncAddNum', 3)">+</div>
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  mounted() {
    console.log(this.$store);
  },
};
</script>
