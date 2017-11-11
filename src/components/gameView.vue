<template>
  <div class="square">
    <div class="title">{{title}}</div>
    <div class="game">
      <div class="row" v-for="(items, i) in gameData" :key="i">
        <div :class="{none: item == 0, done: item == 1, curr: item == 2}" v-for="(item, j) in items" :key="j"></div>
      </div>
    </div>
    <div class="next">
      <div class="row" v-for="(items, i) in nextData" :key="i">
        <div :class="{none: item == 0, done: item == 1, curr: item == 2}" v-for="(item, j) in items" :key="j"></div>
      </div>
    </div>
    <div class="info">
      <div>已用时：{{gameTime}}s</div>
      <div>已得分：{{gameScore}}分</div>
      <div v-show="gameOver">
        <div>游戏已结束</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'title',
      'gameData',
      'nextData',
      'gameTime',
      'gameScore',
      'gameOver'
    ]
  }
</script>

<style scoped>

  .square{
    width: 400px;
    height: 600px;
    float: left;
  }
  .title{
    font-size: 30px;
    margin: 20px auto;
  }

  .game{
    position: relative;
    float: left;
    width: 200px;
    height: 400px;
    background-color: #f2faff;
    border: 1px solid blue;
    border-top: none;
  }
  .next{
    position: relative;
    float: left;
    width: 80px;
    height: 80px;
    margin-left: 40px;
    background-color: #f2faff;
    border: 1px solid blue;
  }
  .info{
    float: left;
    margin-left: 40px;
    margin-top: 10px;
  }
  .row{
    height: 20px;
  }
  .none,.curr,.done{
    float:left;
    width: 20px;
    height: 20px;
    box-sizing: border-box;
  }
  .none{
    background-color: #f2faff;
  }
  .curr{
    background-color: pink;
    border: 1px solid red;
  }
  .done{
    background-color: gray;
    border: 1px solid black;
  }
</style>
