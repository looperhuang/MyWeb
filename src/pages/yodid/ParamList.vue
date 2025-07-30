<template>
  <el-table :data="paramList" style="width: 100%">
    <el-table-column prop="name" label="參數名稱" />
    <el-table-column prop="desc" label="參數說明" />
  </el-table>
</template>

<script setup lang="ts">
const paramList = [
  { name: 'TotalAmount', desc: '單案金額' },
  { name: 'AT', desc: 'A/T利率' },
  { name: 'RefundAmount', desc: '歸戶金額' },
  { name: 'Commission', desc: '傭金' },
  { name: 'ApplyUser', desc: '申請人' },
  { name: 'SaleDept', desc: '業務單位' },
  { name: 'Reviwer', desc: '審查員' },
];
</script>

<style scoped></style>
