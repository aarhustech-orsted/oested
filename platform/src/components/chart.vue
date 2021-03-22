<template>
  <div class="flex h-full min-w-full">
    <div class="flex w-full h-full justify-evenly">
      <div
        v-for="(column, i) in data.columns"
        :key="i"
        class="relative flex flex-col items-center mx-1 text-center"
      >
        <span
          class="absolute text-xs bg-white"
          :style="`top: calc((100% - 2.75rem) / ${limit} * ${
            limit - data.values[i]
          } - 0.25rem)`"
          >{{
            new Intl.NumberFormat("da-DK", {
              maximumFractionDigits: 1,
            }).format(data.values[i])
          }}</span
        >
        <hr
          class="absolute w-full border-black"
          :style="`top: calc((100% - 2.75rem) / ${limit} * ${
            limit - data.values[i]
          } + 0.75rem)`"
        />
        <hr class="w-px h-full bg-gray-200" />
        <span class="mt-2 text-xs font-light text-gray-600">{{ column }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["data"],
  
  setup(props) {
    const limit = Math.max(...props.data.values);
    
    return { limit };
  },
};
</script>
