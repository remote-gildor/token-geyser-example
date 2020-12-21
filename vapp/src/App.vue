<template>
  <div v-if="isDrizzleInitialized" id="app">
    <Navbar />

    <keep-alive>
      <router-view />
    </keep-alive>

    <Toast />
  </div>

  <div v-else>Loading Value dApp...</div>
</template>

<script>
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    Navbar, 
    Toast
  },
  computed: mapGetters("drizzle", ["isDrizzleInitialized"])
}
</script>

<style>
</style>
