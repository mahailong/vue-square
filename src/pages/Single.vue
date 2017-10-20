<template>
  <div>
    <div slots>请用方向键和空格键进行操作：上->旋转，右->右移，下->下移，空格->坠落</div>
    <GameView ref="localGame"></GameView>
  </div>
</template>

<script>
  import GameView from '@/components/gameView1'

  export default {
    components: {
      GameView
    },
    created () {
      this.bindKeyEvent()
    },
    methods: {
      bindKeyEvent () {
        document.onkeydown = (event) => {
          event = window.event || event
          let keyCode = event.keyCode || event.which
          this.$refs.localGame.keyEvent(keyCode)
        }
      }
    }
  }
</script>
