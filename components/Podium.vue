<template>
  <div>
    <div class="podium">
      <div class="row">
        <p>{{ data[1].name }}</p>
        <div class="second">2</div>
      </div>
      <div class="row">
        <p class="first">{{ data[0].name }}</p>
        <div class="first">1</div>
      </div>
      <div class="row">
        <p>{{ data[2].name }}</p>
        <div class="third">3</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const { data } = defineProps<{ data: any[] }>();
</script>

<style scoped lang="scss">
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  padding: 20px;
  margin-top: 30px;
  div.row {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    & > p {
      text-align: center;
      line-break: break-all;
      width: fit-content;
      &.first {
        font-size: 1.5rem;
        font-weight: bold;
      }
    }
    > div {
      border-radius: 10px 10px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 2rem;
      color: white;
      font-weight: bold;
      &.first {
        width: 100px;
        height: 200px;
        background-color: goldenrod;
      }
      &.second {
        width: 100px;
        height: 140px;
        background-color: silver;
      }
      &.third {
        width: 100px;
        height: 100px;
        background-color: brown;
      }
    }
  }
}
</style>
