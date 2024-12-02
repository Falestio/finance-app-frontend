<script setup>
const jwtCookie = useCookie("jwt");

const dropdownItems = [
  [
    {
      label: "Dashboard",
      icon: "i-heroicons-credit-card",
      to: "/dashboard",
    },
  ],
  [
    {
      label: "Logout",
      icon: "i-heroicons-arrow-left-start-on-rectangle",
      click: async () => {
        await logout();
      },
    },
  ],
];

const logout = async () => {
  jwtCookie.value = null;
  await navigateTo("/");
};
</script>

<template>
  <div class="w-full p-4 sticky top-0">
    <UContainer class="flex justify-between">
      <NuxtLink to="/" class="font-mono text-3xl">BUDGETIN</NuxtLink>

      <div v-if="jwtCookie">
        <UDropdown
          :items="dropdownItems"
          :popper="{ placement: 'bottom-start' }"
        >
          <UButton>
            <UIcon name="i-heroicons-user"></UIcon>
          </UButton>
        </UDropdown>
      </div>
    </UContainer>
  </div>
</template>
