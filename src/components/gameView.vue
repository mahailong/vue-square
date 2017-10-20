<template>
  <div class="square">
    <div class="title">我的游戏区域</div>
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
        <button @click="initGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {gameData, squareData} from '@/utils/generateData'
  
  const DOWN_INTERVAL = 500
  
  export default {
    data () {
      return {
        origin: {},
        gameData: [],
        nextType: 0,
        nextDir: 0,
        nextData: [],
        currType: 0,
        currDir: 0,
        currData: [],
        gameTime: 0,
        gameScore: 0,
        gameOver: false
      }
    },
    created () {
      this.initGame()
      this.initSquare()
    },
    methods: {
      initGame () {
        this.gameData = gameData
        this.gameTime = 0
        this.gameScore = 0
        this.gameOver = false
        this.gameTimer = setInterval(() => this.gameTime ++, 1000)
        this.downTimer = setInterval(() => this.move(1, 0), DOWN_INTERVAL)
      },
      initSquare () {
        this.origin = { x: 0, y: 3 }
        if (this.valid(this.origin)) {
          this.currType = this.nextType ? this.nextType : Math.floor(Math.random() * 7)
          this.currDir = this.nextDir ? this.nextDir : Math.floor(Math.random() * 4)
          this.currData = this.nextData.length ? this.nextData : squareData[this.currType][this.currDir]
          this.nextType = Math.floor(Math.random() * 7)
          this.nextDir = Math.floor(Math.random() * 4)
          this.nextData = squareData[this.nextType][this.nextDir]
          return true
        }
      },
      keyEvent (key) {
        switch (key) {
          case 32: this.space(); break
          case 37: this.move(0, -1); break
          case 38: this.rotate(); break
          case 39: this.move(0, 1); break
          case 40: this.move(1, 0); break
          default: break
        }
      },
      rotate () {
        this.currDir = this.currDir + 1 < 4 ? this.currDir + 1 : 0
        this.currData = squareData[this.currType][this.currDir]
      },
      space () {
        while (this.valid({...this.origin, x: this.origin.x + 1})) {
          this.move(1, 0)
        }
      },
      move (x, y) {
        let origin = {x: this.origin.x + x, y: this.origin.y + y}
        if (this.valid(origin)) {
          this.origin = origin
          return true
        } else if (x > 0) {
          this.landing()
          return false
        }
      },
      valid (origin) {
        for (var x = 0; x < this.currData.length; x++) {
          for (var y = 0; y < this.currData[x].length; y++) {
            if (this.currData[x][y] === 2) {
              if (origin.y + y < 0) return false
              if (origin.y + y >= this.gameData[0].length) return false
              if (origin.x + x >= this.gameData.length) return false
              if (this.gameData[origin.x + x][origin.y + y] === 1) return false
            }
          }
        }
        return !this.gameOver
      },
      landing () {
        this.refreshLine()
        if (!this.initSquare()) {
          this.gameOver = true
          window.clearInterval(this.gameTimer)
          window.clearInterval(this.downTimer)
        }
      },
      refreshLine () {
        this.gameData = this.gameData.map((items, x) => {
          return items.map((item, y) => {
            return item === 2 ? 1 : item
          })
        })
        this.clearLine()
      },
      clearLine () {
        let line = 0
        this.gameData.forEach((items, x) => {
          if (items.length === items.filter(item => item === 1).length) {
            line++
            for (let i = x; i >= 1; i--) {
              this.gameData[i] = this.gameData[i - 1]
            }
          }
        })
        this.updateGameScore(line)
      },
      updateGameScore (line) {
        switch (line) {
          case 1: this.gameScore += 10; break
          case 2: this.gameScore += 30; break
          case 3: this.gameScore += 60; break
          case 4: this.gameScore += 100; break
          default: break
        }
      }
    },
    watch: {
      origin (origin) {
        this.gameData = this.gameData.map((items, x) => {
          return items.map((item, y) => {
            return item === 2 ? 0 : item
          })
        })
        this.currData.forEach((items, x) => {
          items.forEach((item, y) => {
            if (item === 2) {
              this.gameData[x + this.origin.x][y + this.origin.y] = 2
            }
          })
        })
      }
    }
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
