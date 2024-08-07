<template>
  <a-menu
    :defaultSelectedKeys="['1']"
    mode="vertical"
    :theme="theme"
    :selectedKeys="[getcurrent]"
    @click="handleClick"
  >
    <a-menu-item key="1">
      <router-link to="/">Upload</router-link>
    </a-menu-item>
    <a-menu-item key="2">
      <router-link to="/manage">Manage</router-link>
    </a-menu-item>
    <a-menu-item key="3">
      <router-link to="/settings">Setting</router-link>
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  name: "NavMenu",
  data: function() {
    return {
      current: "1",
      theme: "dark"
    };
  },
  computed: {
    getcurrent: function() {
      switch (this.$route.path) {
        case "/":
          return "1";
        case "/manage":
          document.title = "Manage";
          return "2";
        case "/settings":
          document.title = "Settings";
          return "3";
      }
    }
  },
  methods: {
    handleClick: function(e) {
      this.current = e.key;
    }
  }
};
</script>
<style>
</style>
