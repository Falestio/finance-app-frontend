<template>
  <UContainer class="h-screen flex items-center justify-center">
    <UCard class="w-full max-w-sm p-6">
      <h1 class="text-2xl font-bold text-center mb-4">Daftar</h1>
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <ULabel for="username">Nama Pengguna</ULabel>
          <UInput
            id="username"
            v-model="username"
            type="text"
            placeholder="Masukkan nama pengguna Anda"
            required
          />
        </div>
        <div class="mb-4">
          <ULabel for="email">Email</ULabel>
          <UInput
            id="email"
            v-model="email"
            type="email"
            placeholder="Masukkan email Anda"
            required
          />
        </div>
        <div class="mb-4">
          <ULabel for="password">Kata Sandi</ULabel>
          <UInput
            id="password"
            v-model="password"
            type="password"
            placeholder="Masukkan kata sandi Anda"
            required
          />
        </div>
        <UButton
          type="submit"
          class="w-full flex justify-center"
          :loading="isRegisterButtonLoading"
          >Daftar</UButton
        >
        <UButton
          :loading="isReqresButtonLoading"
          variant="ghost"
          class="w-full flex justify-center mt-2"
          @click="handleSubmitReqres"
          >Daftar Reqres</UButton
        >
      </form>
      <p class="mt-4 text-center">
        Sudah punya akun?
        <NuxtLink to="/masuk" class="text-blue-500">Masuk di sini</NuxtLink>
      </p>
    </UCard>
  </UContainer>
</template>

<script setup>
const toast = useToast();

const username = ref("");
const email = ref("");
const password = ref("");

const isReqresButtonLoading = ref(false);
const isRegisterButtonLoading = ref(false);

const handleSubmit = async () => {
  try {
    isRegisterButtonLoading.value = true
    const register = await $fetch("http://103.174.114.151:3000/auth/register", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
        username: username.value,
      },
    });
  } catch (err) {
    if (err.statusCode === 409) {
      toast.add({
        title: "Pendaftaran gagal.",
        description: "Email sudah digunakan",
        variant: "error",
      });
    } else {
      toast.add({
        title: "Pendaftaran gagal Silahkan coba lagi beberapa saat",
        description: err.message,
        variant: "error",
      });
    }

    console.log("Error Code:", err.statusCode);
    console.log(err);
  } finally {
    isRegisterButtonLoading.value = false
  }
};

const handleSubmitReqres = async () => {
  isReqresButtonLoading.value = true;

  try {
    console.log(email.value, password.value);

    const reqresResponse = await $fetch("https://reqres.in/api/register", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    console.log(reqresResponse);

    toast.add({
      title: `Selamat datang, ${username.value}`,
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      title: "Pendaftaran gagal.",
      description: error,
      variant: "error",
    });
  } finally {
    isReqresButtonLoading.value = false;
  }
};
</script>
