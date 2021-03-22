<template>
  <div id="recaptcha-container" />
  <div class="my-8 text-center">
    <h1 class="text-5xl font-bold">Velkommen til<br />Mit Ørsted</h1>
    <p class="mt-6 text-sm text-gray-500">
      Her kan du få indblik i dit el forbrug og fakturaer.
    </p>
  </div>

  <div class="flex flex-col max-w-xs p-8 mx-auto border rounded shadow-lg">
    <h1 class="text-2xl font-medium text-center">Login</h1>

    <hr class="my-2" />

    <form
      @submit.prevent="send_code"
      v-if="state === 'LOGIN'"
      class="flex flex-col px-4"
    >
      <p v-if="error" class="px-3 py-1 mb-4 text-center bg-red-200 rounded">
        {{ error }}
      </p>
      <label for="number" class="font-light">Dit telefon nummer</label>
      <input
        v-model="tlf"
        id="number"
        name="number"
        type="tel"
        class="w-full"
        placeholder="+4500000000"
        pattern="\+[0-9]+\w?[0-9]{8}"
        required
      />

      <button class="px-2 mx-auto mt-4 border rounded" type="submit">
        Send kode
      </button>
    </form>
    <div v-if="state === 'WAITING'">
      <p class="mb-4 text-center">Sender kode via SMS</p>
      <div
        class="w-8 h-8 mx-auto border-2 border-gray-400 border-dotted rounded-full animate-spin"
      />
    </div>
    <form
      v-if="state === 'CODE'"
      @submit.prevent="confirm_code"
      class="flex flex-col px-4"
    >
      <p v-if="error" class="px-3 py-1 mb-4 text-center bg-red-200 rounded">
        {{ error }}
      </p>
      <label for="number" class="font-light">Den modtaget kode</label>
      <input
        v-model="code"
        id="number"
        name="number"
        class="w-full"
        placeholder="000000"
        pattern="[0-9]{6}"
        required
      />

      <button class="px-2 mx-auto mt-4 border rounded" type="submit">
        Login
      </button>
    </form>
    <div v-if="state === 'AUTHORIZING'">
      <p class="mb-4 text-center">Bekræfter kode</p>
      <div
        class="w-8 h-8 mx-auto border-2 border-gray-400 border-dotted rounded-full animate-spin"
      />
    </div>
    <div v-if="state === 'AUTHORIZED'">
      <p class="mb-4 text-center">Kode Bekræftet</p>
      <p>Du bliver vidrestillet til din konto!</p>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue-demi";

import useAuth from "../hooks/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const auth = useAuth();

    const error = ref();
    const state = ref("LOGIN");

    const tlf = ref();
    const code = ref();

    function send_code() {
      state.value = "WAITING";
      error.value = undefined;
      auth
        .sendCode(tlf.value)
        .then(() => {
          state.value = "CODE";
        })
        .catch((err) => {
          error.value = err.message;
          state.value = "LOGIN";
          console.error(err);
        });
    }

    function confirm_code() {
      state.value = "AUTHORIZING";
      error.value = undefined;
      auth
        .confirmCode(code.value)
        .then(() => {
          state.value = "AUTHORIZED";
          setTimeout(() => {
            router.push("/");
          }, 1500);
        })
        .catch((err) => {
          error.value = err.message;
          state.value = "CODE";
          console.error(err);
        });
    }

    onMounted(() => {
      auth.createVerifier("recaptcha-container");
    });

    return {
      user: auth.user,
      error,
      tlf,
      code,
      state,
      send_code,
      confirm_code,
    };
  },
};
</script>
