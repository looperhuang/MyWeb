<template>
  <q-page class="q-pa-md">
    <div class="container" style="transform: rotate(-30deg)">
      <div class="item item-skew">
        <div class="item-content">
          <q-icon name="cake"></q-icon>
          <span>Wish</span>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  width: 520px;
  height: 520px;
  border-radius: 520px;
  overflow: hidden;
  position: relative;
  background-color: #f0beff;
}

.item {
  position: absolute;
  display: flex;
  width: 50%;
  height: 50%;
  border: 2px solid #1f1172;
  color: #f0beff;
  background-color: #343baa;
  top: 0;
  right: 0;
  transform-origin: 0% 100%;
  justify-content: center;
  align-items: center;
}
/*
$n: 4;

@for $i from 1 through $n {
  $deg: 360deg / $n;

  .item-skew:nth-child(#{$i}) {
    transform: rotate($deg * $i) skewY($deg - 90);
  }
} */

.item-skew:nth-child(1) {
  -webkit-transform: rotate(60deg) skewY(-30deg);
  transform: rotate(60deg) skewY(-30deg);
}
/* skewY(90 - 60 deg) rotate(60 / 2deg) translate(-95px, 62px) */

.item-content {
  display: flex;
  width: 100px;
  align-items: center;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  transform-origin: center center;
  transform: skewY(30deg) rotate(30deg) translate(-95px, 62px);
  position: absolute;
  right: 0;
  bottom: 0;

  i {
    font-size: 4rem;
  }
}
</style>
