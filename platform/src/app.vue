<template>
  <div v-if="ready">
    <layout>
      <router-view />
    </layout>

    <img
      :src="background"
      alt="background effect"
      class="absolute top-0 left-0 object-cover w-screen h-screen -z-1"
    />
  </div>
</template>

<script>
import { ref } from "vue-demi";

import { useRouter } from "vue-router";
import useAuth, { onAuthorized } from "./hooks/auth";

import layout from "./layouts/default.vue";
import background from "./assets/background.svg";

export default {
  components: {
    layout,
  },

  setup() {
    useAuth();

    const router = useRouter();

    const ready = ref(false);

    onAuthorized((user) => {
      console.log("Credentials", {
        accessToken: user.value?.token,
        refreshToken: user.value?.refreshToken,
      });

      if (!user.value && router.currentRoute.value.path !== "/login") {
        router.replace("/login");
      } else if (user.value && router.currentRoute.value.path === "/login") {
        router.replace("/");
      }

      ready.value = true;
    });

    return { ready, background };
  },
};
</script>
