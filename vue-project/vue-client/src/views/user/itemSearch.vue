<template>
  <div>
    <b>#{{ item.storeID }}</b>
    <span>{{ item.storeName }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: { required: true },
  }
}
</script>