<template>
  <h1 class="text-3xl font-medium">Din adresse</h1>
  <h2 class="mt-4 text-xl">{{ address.addressString }}</h2>
  <p class="mb-2 text-sm font-light text-gray-500">
    Oversigt over forbrug og fakturaer for denne adresse.
  </p>
  <div class="flex space-x-8">
    <card class="min-w-[200px]">
      <p class="text-lg font-medium">Forbrug</p>
      <p class="text-sm font-light">Denne måned</p>
      <p class="mt-4 text-2xl font-bold">
        {{
          new Intl.NumberFormat("da-DK", {
            minimumFractionDigits: 2,
          }).format(usage_monthly)
        }}
        Kr.-
      </p>
    </card>

    <card class="min-w-[200px]">
      <p class="text-lg font-medium">Forbrug</p>
      <p class="text-sm font-light">Dette år</p>
      <p class="mt-4 text-2xl font-bold">
        {{
          new Intl.NumberFormat("da-DK", {
            minimumFractionDigits: 2,
          }).format(usage_yearly)
        }}
        Kr.-
      </p>
    </card>
    <card>
      <p class="mb-2 text-xs font-light text-left">
        Forbrug efter pris i DKK pr. måned.
      </p>
      <chart v-if="usage_all" :data="usage_all" />
    </card>
  </div>

  <h2 class="mt-4 text-xl">Fakturaer</h2>
  <div class="flex flex-wrap mt-4">
    <card v-for="invoice in invoices" :key="invoice" class="m-2">
      <div class="flex justify-between">
        <div class="flex mr-4">
          <i-file class="w-12 h-12" />
          <div class="ml-2 text-left">
            <p>
              Forbrug d.
              {{ new Intl.DateTimeFormat("da-DK").format(invoice.date) }}
            </p>
            <p class="text-xs font-light">{{ invoice.filename }}</p>
          </div>
        </div>
        <a
          :href="invoice.download"
          :download="invoice.filename"
          target="_blank"
          class="flex items-center justify-center px-3 py-1 my-auto font-light text-white align-middle bg-black rounded"
        >
          Hent Faktura
        </a>
      </div>
    </card>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

import Card from "../../components/card.vue";
import Chart from "../../components/chart.vue";

import IFile from "heroicons/vue/outline/Document";
import useØrsted from "../../hooks/ørsted";
import { ref } from "vue-demi";

export default {
  components: {
    Card,
    Chart,
    IFile,
  },

  setup() {
    const ørsted = useØrsted();
    const router = useRouter();

    const { id } = router.currentRoute.value.params;

    const address = ref({});
    const invoices = ref([]);
    const usage_monthly = ref(0);
    const usage_yearly = ref(0);
    const usage_all = ref(false);

    ørsted.address(id).then((result) => (address.value = result));
    ørsted.invoices(id).then((result) => (invoices.value = result));
    ørsted.usage_monthly(id).then((result) => (usage_monthly.value = result));
    ørsted.usage_yearly(id).then((result) => (usage_yearly.value = result));
    ørsted.usage_all(id).then((result) => (usage_all.value = result));

    return {
      address,
      invoices,
      usage_monthly,
      usage_yearly,
      usage_all,
    };
  },
};
</script>
