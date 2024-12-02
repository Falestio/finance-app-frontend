<template>
  <UContainer class="h-screen flex items-center justify-center">
    <UCard class="w-full max-w-sm p-6">
      <h1 class="text-2xl font-bold text-center mb-4">Masuk</h1>
      <form @submit.prevent="handleSubmit">
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
          :loading="isLoginButtonLoading"
        >
          Masuk
        </UButton>
        <UButton
          @click="handleSubmitReqres"
          :loading="isReqresButtonLoading"
          variant="ghost"
          class="w-full flex justify-center mt-2"
        >
          Masuk Reqres
        </UButton>
      </form>
      <p class="mt-4 text-center">
        Belum punya akun?
        <NuxtLink to="/daftar" class="text-blue-500">Daftar di sini</NuxtLink>
      </p>
    </UCard>
  </UContainer>
</template>

<script setup>
const toast = useToast();

const email = ref("");
const password = ref("");
const isReqresButtonLoading = ref(false);
const isLoginButtonLoading = ref(false);

const jwtCookie = useCookie("jwt", {
  maxAge: 36000000,
  secure: false,
});

const userDataCookie = useCookie("user", {
  maxAge: 36000000,
  secure: false,
});

const handleSubmit = async () => {
  try {
    isLoginButtonLoading.value = true;
    const login = await $fetch("http://103.174.114.151:3000/auth/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });
    console.log("User:", login.user);

    jwtCookie.value = login.accessToken;
    userDataCookie.value = login.user;

    toast.add({
      title: `Login berhasil Selamat datang, ${email.value}`,
    });

    await navigateTo("/dashboard");
  } catch (err) {
    if (err.statusCode == 403) {
      toast.add({
        title: `Email atau password salah`,
        variant: "error",
      });
    } else {
      toast.add({
        title: "Login gagal. Silakan coba lagi.",
        variant: "error",
      });
    }
  } finally {
    isLoginButtonLoading.value = false;
  }
};

const handleSubmitReqres = async () => {
  isReqresButtonLoading.value = true;

  try {
    const reqresResponse = await $fetch("https://reqres.in/api/login", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    console.log(reqresResponse);

    toast.add({
      title: `Selamat datang, ${email.value}`,
    });
  } catch (error) {
    console.error("Error:", error);
    toast.add({
      title: "Login gagal. Silakan coba lagi.",
      variant: "error",
    });
  } finally {
    isReqresButtonLoading.value = false;
  }
};
</script>
