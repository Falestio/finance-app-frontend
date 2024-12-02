<script setup>
definePageMeta({
  middleware: ["auth"],
});

onMounted(async () => {
  await fetchTransactions();
});

const toast = useToast();
const transactions = ref(null);
const userData = useCookie("user");
const isTransactionModalOpen = ref(false);
const isAddTransactionButtonLoading = ref(false);
const isDeleteTransactionModalOpen = ref(false);
const selectedTransactionToDelete = ref(null);
const isEditTransactionModalOpen = ref(false);
const selectedTransactionToEdit = ref(null);

function formatRupiah(amount) {
  const number = parseFloat(amount);

  if (isNaN(number)) {
    return "Invalid amount";
  }

  const formattedNumber = number.toFixed(2).toString();

  const [whole, decimal] = formattedNumber.split(".");

  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${formattedWhole},${decimal}`;
}

const fetchTransactions = async () => {
  try {
    transactions.value = await $fetch(
      `http://localhost:3000/transactions/user/${userData.value.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
  } catch (err) {
    console.log(err);
  }
};

const transaction = ref({
  name: "",
  description: "",
  amount: null,
  type: "expense",
  date: new Date().toISOString().split("T")[0],
});

const handleCreateTranscation = async () => {
  isAddTransactionButtonLoading.value = true;

  const newTransactionObject = {
    name: transaction.value.name,
    description: transaction.value.description,
    amount: transaction.value.amount,
    type: transaction.value.type,
    date: transaction.value.date,
    category: transaction.value.type == "expense" ? "pengeluaran" : "pemasukan",
    userId: userData.value.id,
  };

  try {
    const newTransaction = await $fetch("http://localhost:3000/transactions", {
      method: "POST",
      body: newTransactionObject,
      credentials: "include",
    });

    toast.add({
      title: "Transaksi Berhasil Didapatkan",
    });

    await fetchTransactions();

    isTransactionModalOpen.value = false;
  } catch (err) {
    console.log(err);
    toast.add({
      title: "Gagal menambahkan transaksi",
      variant: "error",
    });
  } finally {
    isAddTransactionButtonLoading.value = false;
  }
};

const handleDeleteTransaction = async () => {
  try {
    await $fetch(
      `http://localhost:3000/transactions/${selectedTransactionToDelete.value.id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    toast.add({
      title: "Berhasil menghapus transaksi",
    });

    await fetchTransactions();

    isDeleteTransactionModalOpen.value = false;
  } catch (err) {
    console.log(err);
    toast.add({
      title: "Gagal menghapus transaksi",
    });
  }
};

const handleEditTransaction = async () => {
  const editedTransactionObject = {
    name: selectedTransactionToEdit.value.name,
    description: selectedTransactionToEdit.value.description,
    amount: selectedTransactionToEdit.value.amount,
    type: selectedTransactionToEdit.value.type,
    date: selectedTransactionToEdit.value.date,
    category: selectedTransactionToEdit.value.category,
  };

  try {
    const editedTransaction = await $fetch(
      `http://localhost:3000/transactions/${selectedTransactionToEdit.value.id}`,
      {
        method: "PUT",
        body: editedTransactionObject,
        credentials: "include",
      }
    );

    toast.add({
      title: "Berhasil edit transaksi",
    });

    await fetchTransactions();

    isEditTransactionModalOpen.value = false;
  } catch (err) {
    console.log(err);
    toast.add({
      title: "Gagal mengubah transaksi",
      variant: "error",
    });
  }
};
</script>

<template>
  <div>
    <UContainer>
      <!-- TAMBAH TRANSAKSI -->
      <div class="w-full flex justify-between gap-4 mb-8">
        <div>
          <UButton
            variant="outline"
            color="green"
            @click="isTransactionModalOpen = true"
            >Tambah Transaksi</UButton
          >
          <UModal v-model="isTransactionModalOpen">
            <div class="p-4">
              <h2 class="text-xl font-bold mb-4">Tambah Transaksi</h2>
              <UForm @submit.prevent="handleCreateTranscation">
                <div class="mb-4">
                  <label
                    for="name"
                    class="block text-sm font-medium text-gray-200"
                    >Nama</label
                  >
                  <UInput
                    id="name"
                    v-model="transaction.name"
                    placeholder="Masukkan nama transaksi"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-200"
                    >Deskripsi</label
                  >
                  <UInput
                    id="description"
                    v-model="transaction.description"
                    placeholder="Masukkan deskripsi transaksi"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="amount"
                    class="block text-sm font-medium text-gray-200"
                    >Jumlah</label
                  >
                  <UInput
                    id="amount"
                    type="number"
                    v-model="transaction.amount"
                    placeholder="Masukkan jumlah"
                    required
                  />
                </div>
                <div class="mb-4">
                  <label
                    for="type"
                    class="block text-sm font-medium text-gray-200"
                    >Tipe</label
                  >
                  <select
                    id="type"
                    v-model="transaction.type"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                    required
                  >
                    <option value="income">Pendapatan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label
                    for="date"
                    class="block text-sm font-medium text-gray-200"
                    >Tanggal</label
                  >
                  <UInput
                    id="date"
                    type="date"
                    v-model="transaction.date"
                    required
                  />
                </div>
                <UButton
                  type="submit"
                  class="w-full flex justify-center"
                  :loading="isAddTransactionButtonLoading"
                  >Simpan Transaksi</UButton
                >
              </UForm>
            </div>
          </UModal>
        </div>
      </div>

      <div v-if="transactions">
        <div class="flex flex-col gap-4">
          <UCard
            class="w-full"
            v-for="transaction in transactions"
            :key="transaction.id"
          >
            <div class="flex justify-between">
              <div>
                <h2 class="text-xl font-bold mb-2">{{ transaction.name }}</h2>
                <p class="text-gray-300 mb-4">{{ transaction.description }}</p>
                <div class="flex justify-between items-center mt-2">
                  <span class="text-sm font-medium text-gray-500 mr-2"
                    >Kategori:</span
                  >
                  <span class="text-sm">{{ transaction.category }}</span>
                </div>
              </div>
              <div class="flex flex-col justify-between">
                <span
                  :class="
                    transaction.type === 'income'
                      ? 'text-green-500'
                      : 'text-red-500'
                  "
                  class="text-3xl"
                >
                  Rp {{ formatRupiah(transaction.amount) }}
                </span>

                <div class="flex gap-4 justify-end">
                  <UButton
                    icon="i-heroicons-pencil-square"
                    size="sm"
                    color="gray"
                    square
                    @click="
                      isEditTransactionModalOpen = true;
                      selectedTransactionToEdit = transaction;
                    "
                    variant="solid"
                  />
                  <UButton
                    icon="i-heroicons-trash"
                    size="sm"
                    color="rose"
                    square
                    @click="
                      isDeleteTransactionModalOpen = true;
                      selectedTransactionToDelete = transaction;
                    "
                    variant="solid"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>

      <UModal v-model="isDeleteTransactionModalOpen">
        <div class="p-4">
          <h3>
            Apakah Anda yakin ingin menghapus transaksi
            {{ selectedTransactionToDelete?.name }}
          </h3>
          <div class="flex justify-end mt-4 gap-4">
            <UButton @click="handleDeleteTransaction" color="rose"
              >Hapus</UButton
            >
            <UButton @click="isDeleteTransactionModalOpen = false" color="gray"
              >Batal</UButton
            >
          </div>
        </div>
      </UModal>

      <UModal v-model="isEditTransactionModalOpen">
        <div class="p-4">
          <h2 class="text-xl font-bold mb-4">Edit Transaksi</h2>
          <UForm @submit.prevent="handleEditTransaction">
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-200"
                >Nama</label
              >
              <UInput
                id="name"
                v-model="selectedTransactionToEdit.name"
                placeholder="Masukkan nama transaksi"
                required
              />
            </div>
            <div class="mb-4">
              <label
                for="description"
                class="block text-sm font-medium text-gray-200"
                >Deskripsi</label
              >
              <UInput
                id="description"
                v-model="selectedTransactionToEdit.description"
                placeholder="Masukkan deskripsi transaksi"
                required
              />
            </div>
            <div class="mb-4">
              <label
                for="amount"
                class="block text-sm font-medium text-gray-200"
                >Jumlah</label
              >
              <UInput
                id="amount"
                type="number"
                v-model="selectedTransactionToEdit.amount"
                placeholder="Masukkan jumlah"
                required
              />
            </div>
            <div class="mb-4">
              <label for="type" class="block text-sm font-medium text-gray-200"
                >Tipe</label
              >
              <select
                id="type"
                v-model="selectedTransactionToEdit.type"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50"
                required
              >
                <option value="income">Pendapatan</option>
                <option value="expense">Pengeluaran</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="date" class="block text-sm font-medium text-gray-200"
                >Tanggal</label
              >
              <UInput
                id="date"
                type="date"
                v-model="selectedTransactionToEdit.date"
                required
              />
            </div>
            <UButton type="submit" class="w-full flex justify-center"
              >Simpan Transaksi</UButton
            >
          </UForm>
        </div>
      </UModal>
    </UContainer>
  </div>
</template>
