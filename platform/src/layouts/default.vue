<template>
  <div
    class="flex flex-col w-screen min-h-screen px-8 py-8 md:px-16 lg:px-32 2xl:px-64"
  >
    <header class="flex items-center justify-between">
      <svg
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 235 64"
        class="h-8 md:h-16"
      >
        <path
          d="M33.502 8.268C47.073 10.413 57.33 21.49 57.33 35.764 57.33 51.52 44.89 64 28.665 64 12.442 64 0 51.52 0 35.764 0 21.45 10.257 10.414 23.83 8.268V0h9.672v8.268zM46.06 35.803c0-8.698-5.031-15.289-12.559-17.239v16.498H23.83V18.564c-7.527 1.95-12.558 8.541-12.558 17.239 0 10.023 7.488 17.589 17.395 17.589 9.906 0 17.394-7.566 17.394-17.59zM87.322 25.116v10.258c-4.563.078-10.764 1.56-13.533 4.446v23.283H63.532v-37.87h10.257v4.017c3.94-3.042 9.36-4.329 13.533-4.134zM89.506 57.097l5.695-7.293a13.26 13.26 0 0010.335 4.953c2.457 0 4.017-1.092 4.017-2.808 0-2.613-2.457-3.16-7.215-4.212-7.605-1.677-11.35-5.421-11.35-11.583 0-6.63 6.124-11.662 14.119-11.662 5.382 0 10.14 1.872 13.65 5.5l-5.031 6.747c-2.613-2.301-5.382-3.354-8.502-3.354-2.457 0-4.017 1.014-4.017 2.496 0 2.067 1.794 2.496 7.098 3.627 7.254 1.482 11.271 5.85 11.271 12.207 0 6.942-5.772 11.973-13.767 11.973-6.591.039-12.87-2.457-16.303-6.591zM151.634 61.27c-3.042 1.521-6.318 2.301-9.399 2.301-7.761 0-13.962-5.07-13.962-14.664v-14.43h-6.162v-9.244h6.162v-12.05h10.179v12.05h10.101l-2.574 9.244h-7.527v13.22c0 4.68 2.34 6.904 5.616 6.904 1.56 0 3.354-.507 5.187-1.482l2.379 8.15zM172.578 54.562c4.407 0 7.254-1.95 9.243-4.758l6.591 6.474c-3.471 4.64-9.321 7.566-15.834 7.566-11.544 0-20.242-8.463-20.242-19.695 0-11.194 8.503-19.657 19.774-19.657 10.725 0 18.291 8.385 18.291 19.11 0 1.327-.117 2.692-.273 3.667h-27.027c1.209 4.446 4.875 7.293 9.477 7.293zm-9.204-14.547h16.77c-1.053-4.056-4.056-6.67-8.034-6.67-4.212 0-7.449 2.575-8.736 6.67zM234.004 8.58v54.562h-10.258v-1.794c-2.769 1.638-6.006 2.535-9.477 2.535-11.076 0-19.422-8.463-19.422-19.656 0-11.194 8.346-19.657 19.422-19.657 3.471 0 6.747.858 9.477 2.496V8.62h10.258V8.58zm-10.258 42.394V37.44c-1.716-2.028-4.602-3.51-8.112-3.51-5.928 0-10.179 4.446-10.179 10.296s4.29 10.257 10.179 10.296c3.471 0 6.396-1.521 8.112-3.55z"
          fill="#3FA7DF"
        />
      </svg>

      <nav v-if="authorized" class="hidden space-x-4 md:block">
        <router-link to="/">
          <a href="#">Oversigt</a>
        </router-link>

        <span class="text-gray-200">|</span>

        <a href="#" @click.prevent="logout">Log af</a>
      </nav>

      <div class="md:hidden">
        <button @click="menu = !menu">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        <div v-if="menu" class="absolute top-0 left-0 z-10 w-full p-4">
          <div class="relative w-full p-4 bg-white shadow-md">
            <button @click="menu = false" class="absolute top-0 right-0 m-4">
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <nav v-if="authorized" class="flex flex-col space-y-6 text-lg">
              <a href="#">Oversigt</a>
              <hr />
              <a href="#">Log af</a>
            </nav>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-grow pt-8">
      <slot />
    </main>

    <footer class="flex justify-between">
      <p>
        &copy; {{ new Date().getFullYear() }} Aarhus Tech ⏤ Alle rettigheder
        reserveret.
      </p>

      <nav  v-if="authorized" class="space-x-4">
        <router-link to="/">
          <a href="#">Oversigt</a>
        </router-link>
      </nav>
    </footer>
  </div>
</template>

<script>
import { computed, ref } from "vue";

import useAuth from "../hooks/auth";

export default {
  setup() {
    const menu = ref(false);

    const auth = useAuth();

    return {
      menu,
      logout: auth.logout,
      authorized: computed(() => {
        return !!auth.user.value;
      }),
    };
  },
};
</script>
