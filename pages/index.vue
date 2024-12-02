<script setup>
const page = ref(1);
const users = ref([]);
const userCountPerPage = ref(0);
const totalUsers = ref(0);

// Function to fetch users from the API
const fetchUsers = async () => {
  try {
    users.value = await $fetch(
      `https://reqres.in/api/users?page=${page.value}`
    );

    console.log(users);
    userCountPerPage.value = users.value.per_page;
    totalUsers.value = users.value.total;
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Fetch users when the page number changes
watch(page, async () => {
  await fetchUsers();
});

await fetchUsers();

const isReviewModalOpen = ref(false);
const userDataForModal = ref({});
</script>

<template>
  <div>
    <UContainer
      class="h-screen flex flex-col gap-8 justify-center items-center"
    >
      <h1 class="text-center text-7xl font-bold">
        Hitung Pengeluaran dan Pemasukan di satu tempat, Gratis!
      </h1>
      <p class="text-center text-2xl">
        Kelola pengeluaran dan pemasukan dengan mudah dan efisien.
      </p>
      <div class="flex gap-4 items-center">
        <NuxtLink to="/daftar">
          <UButton size="xl">Daftar Gratis</UButton>
        </NuxtLink>

        <NuxtLink to="/masuk">
          <UButton size="xl" variant="outline">Masuk</UButton>
        </NuxtLink>
      </div>
    </UContainer>

    <UContainer
      class="lg:h-[80vh] h-auto mb-8 flex flex-col justify-center items-center"
    >
      <h2 class="text-center text-4xl font-bold mb-8">
        Dengarkan apa kata mereka
      </h2>
      <div class="grid lg:grid-cols-3 grid-cols-1 gap-8">
        <UCard v-for="user in users.data" :key="user.id">
          <div class="flex items-center gap-4">
            <div>
              <img
                @click="
                  isReviewModalOpen = true;
                  userDataForModal = user;
                "
                :src="user.avatar"
                alt="User Avatar"
                class="w-72 h-auto cursor-pointer"
              />
              <UModal v-model="isReviewModalOpen">
                <div class="p-4 flex items-center gap-4">
                  <img :src="userDataForModal.avatar" alt="foto" />
                  <div>
                    <p>
                      {{ userDataForModal.first_name }}
                      {{ userDataForModal.last_name }}
                    </p>
                    <p>{{ userDataForModal.email }}</p>
                  </div>
                </div>
              </UModal>
            </div>
            <div class="flex flex-col justify-between h-full">
              <p class="text-base">
                Penggunaan sangat mudah, sejak saya menggunakan aplikasi ini
                saya lebih teratur dalam mengelola keuangan sehingga dapat
                membeli motor impian
              </p>
              <p class="text-primary-500">
                {{ user.first_name }} {{ user.last_name }}
              </p>
            </div>
          </div>
        </UCard>
      </div>
      <div class="flex justify-center mt-4">
        <UPagination
          v-model="page"
          :page-count="userCountPerPage"
          :total="totalUsers"
          :max="5"
          @change="fetchUsers"
        />
      </div>
    </UContainer>
  </div>
</template>
