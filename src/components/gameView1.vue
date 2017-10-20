<template>
  <div class="square">
    <div class="title">我的游戏区域</div>
    <div class="game">
      <div class="row" v-for="(items, i) in gameData" :key="i" v-show="i > 2">
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
      <div v-show="isGameOver">
        <div>游戏已结束</div>
        <button @click="initGame">重新开始</button>
      </div>
    </div>
  </div>
</template>

<script>
  import {gameData, squareData} from '@/utils/generateData'
  
  // const DOWN_INTERVAL = 500
  
  export default {
    data () {
      return {
        gameData: [],
        nextType: 0,
        nextDir: 0,
        nextData: [],
        gameTime: 0,
        gameScore: 0,
        isGameOver: false
      }
    },
    created () {
      this.initGame()
    },
    methods: {
      initGame () {
        this.gameData = gameData
        this.gameTime = 0
        this.gameScore = 0
        this.isGameOver = false
        this.gameTimer = setInterval(() => this.gameTime ++, 1000)
        // this.downTimer = setInterval(() => this.move(1, 0), DOWN_INTERVAL)
        this.nextSquare()
        this.insertSquare()
      },
      insertSquare () {
        this.nextData.forEach((items, x) => {
          items.forEach((item, y) => {
            if (item === 2) {
              if (this.valid(x, y)) this.gameData[x][y + 3] = 2
              else this.gameOver()
            }
          })
        })
        this.nextSquare()
      },
      nextSquare () {
        this.nextType = Math.floor(Math.random() * 7)
        this.nextDir = Math.floor(Math.random() * 4)
        this.nextData = squareData[this.nextType][this.nextDir]
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
        console.log('space')
      },
      move (diffX, diffY) {
        let newGameData = this.gameData.map((items, x) => {
          return items.map((item, y) => {
            return item === 2 ? 0 : item
          })
        })
        let isFail = this.gameData.filter((items, x) => {
          return items.filter((item, y) => {
            return item === 2 && !this.valid(x + diffX, y + diffY)
          }).length !== 0
        }).indexOf(true)
        if (isFail) {
          
        }
        this.gameData.forEach((items, x) => {
          items.forEach((item, y) => {
            if (item === 2) {
              if (this.valid(x + diffX, y + diffY)) newGameData[x + diffX][y + diffY] = 2
              else if (diffX > 0) this.landing()
            }
          })
        })
        this.gameData = newGameData
      },
      valid (x, y) {
        if (x < 0 || x >= this.gameData.length) return false
        if (y < 0 || y >= this.gameData[0].length) return false
        if (this.gameData[x][y] === 1) return false
        return true
      },
      landing () {
        this.refreshLine()
        if (!this.initSquare()) {
          this.isGameOver = true
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
      },
      gameOver () {
        this.isGameOver = true
        window.clearInterval(this.gameTimer)
        window.clearInterval(this.downTimer)
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
