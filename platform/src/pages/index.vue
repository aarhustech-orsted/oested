<template>
  <div
    class="flex flex-col-reverse items-center justify-around lg:items-start lg:space-x-8 lg:flex-row"
  >
    <div class="flex flex-col w-full">
      <h1 class="text-3xl font-medium">Seneste fakturaer</h1>
      <p class="text-sm font-light text-gray-500">
        Oversigt over dine seneste fakturaer.
      </p>

      <card
        v-for="invoice in recent_invoices"
        :key="invoice"
        class="max-w-md m-2"
      >
        <div class="flex justify-between">
          <div class="flex mr-4">
            <i-file class="w-12 h-12" />
            <div class="ml-2 text-left">
              <p>
                Forbrug d.
                {{ new Intl.DateTimeFormat("da-DK").format(invoice.date) }}
              </p>
              <p class="text-xs font-light text-gray-500">
                {{ invoice.address }}
              </p>
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

    <div class="mb-8 lg:mb-0">
      <h1 class="text-3xl font-medium">Din oversigt</h1>
      <p class="mb-4 text-sm font-light text-gray-500">
        Her kan du se dit forbrug over alle adresser.
      </p>
      <div
        class="flex flex-col mb-4 space-y-4 sm:space-y-0 sm:space-x-3 sm:flex-row"
      >
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
      </div>

      <card class="w-full h-40">
        <p class="mb-2 text-xs font-light text-left">
          Forbrug efter pris i DKK pr. måned.
        </p>
        <chart v-if="usage_all" :data="usage_all" />
      </card>

      <h1 class="mt-4 text-3xl font-medium">Mine adresser</h1>
      <p class="mb-4 text-sm font-light text-gray-500">
        Klik for at gå til oversigt for den specifikke adresse.
      </p>
      <div
        v-for="address in addresses"
        :key="address"
        class="flex items-center justify-between"
      >
        <div class="flex mr-4">
          <i-location class="w-12 h-12" />
          <div class="ml-2 text-left">
            <p>{{ address.address }}</p>
            <p class="text-xs font-light text-gray-500">
              Seneste faktura:
              {{
                new Intl.DateTimeFormat("da-DK").format(
                  address.latest_invoice.date
                )
              }}
              på
              {{
                new Intl.NumberFormat("da-DK", {
                  minimumFractionDigits: 2,
                }).format(address.latest_invoice.price)
              }}
              kr.-
            </p>
          </div>
        </div>
        <a
          :href="'/adresse/' + address.id"
          class="flex items-center justify-center px-3 py-2 my-auto font-light text-white bg-black rounded"
        >
          Se mere
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Card from "../components/card.vue";
import Chart from "../components/chart.vue";

import IFile from "heroicons/vue/outline/Document";
import ILocation from "heroicons/vue/outline/LocationMarker";

import useAuth from "../hooks/auth";
import useØrsted from "../hooks/ørsted";
import { ref } from "vue-demi";

export default {
  components: {
    Card,
    Chart,
    IFile,
    ILocation,
  },

  setup() {
    const auth = useAuth();
    const ørsted = useØrsted();

    const recent_invoices = ref([]);
    const usage_monthly = ref(0);
    const usage_yearly = ref(0);
    const usage_all = ref(false);

    const addresses = ref([]);

    ørsted.recent_invoices().then((result) => (recent_invoices.value = result));
    ørsted.usage_monthly().then((result) => (usage_monthly.value = result));
    ørsted.usage_yearly().then((result) => (usage_yearly.value = result));
    ørsted.usage_all().then((result) => (usage_all.value = result));
    ørsted.addresses().then((result) => (addresses.value = result));

    return {
      logout: auth.logout,
      recent_invoices,
      usage_monthly,
      usage_yearly,
      addresses,
      usage_all,
    };
  },
};
</script>
