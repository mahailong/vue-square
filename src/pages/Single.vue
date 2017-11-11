<template>
  <div>
    <div slots>请用方向键和空格键进行操作：上->旋转，右->右移，下->下移，空格->坠落</div>
    <div class="msg">{{msg}}</div>
    <LocalGame :socket="socket"></LocalGame>
    <GameView
      title="对方游戏区域"
      :gameData="gameData"
      :nextData="nextData"
      :gameTime="gameTime"
      :gameScore="gameScore"
      :gameOver="gameOver">
    </GameView>
  </div>
</template>

<script>
  import io from 'socket.io-client'
  import LocalGame from '@/components/LocalGame'
  import GameView from '@/components/GameView'

  export default {
    components: {
      LocalGame,
      GameView
    },
    data () {
      return {
        msg: '',
        socket: null,
        gameData: [],
        nextData: [],
        gameTime: 0,
        gameScore: 0,
        gameOver: false
      }
    },
    created () {
      this.socket = io('ws://localhost:3000')
        .on('waiting', str => { this.msg = '请等待您的对手' })
        .on('start', str => { this.msg = '' })
        .on('leave', str => { this.msg = '对方已离开' })
        .on('gameData', str => { this.gameData = str })
        .on('nextData', str => { this.nextData = str })
        .on('gameTime', str => { this.gameTime = str })
        .on('gameScore', str => { this.gameScore = str })
        .on('gameOver', str => { this.gameOver = str })
    }
  }
</script>
