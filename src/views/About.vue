<template>
  <div class="about">
    <h1>Это страница об игре и её правилах</h1>
    <div class="container">
      
    </div>
  </div>
</template>
<script>


  let illo
  export default {
    name: 'About',
    data() {
      return {
        animation: function () {}
      }
    },
    methods: {
      
    },
    mounted() {
      this.startAnimation()
      // illo = new Zdog.Illustration({
      //   // set canvas with selector
      //   element: '.zdog-svg',
      //   dragRotate: true,
      //   rotate: Zdog.TAU / 4
      // })
      // let a = new Zdog.Ellipse({
      //   addTo: illo,
      //   diameter: 80,
      //   stroke: 20,
      //   color: '#636'
      // })
      //   .copy({
      //     translate: { z: -40 },
      //     color: '#e30'
      //   })
      //   .copy({
      //     translate: { z: 40 },
      //     color: '#23f'
      //   })
      // illo.updateRenderGraph()
      // function animate () {
      //   // rotate illo each frame
      //   illo.rotate.y += 0.03
      //   illo.updateRenderGraph()
      //   // animate next frame
      //   requestAnimationFrame(animate)
      // }
      // animate()
    },
    computed: {
      gamerParams() {
        return this.$store.state.roomParams
      },
      gamerPrevParams() {
        return this.$store.state.prevRoomParams
      }
    }
  }

</script>
<style>
  #my-div {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    /* display: flex; */
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    grid-template-rows: repeat(6, 1fr);
    /* flex-direction: column; */
    flex-flow: wrap;
    justify-content: center;
    z-index: -1;
  }
  #my-div * {
    display: flex;
    margin: auto;
  }

  #particles {
    margin: auto;
    width: 200px;
    display: flex;
    flex-flow: wrap;
  }

  .el {
    width: 20px;
    height: 20px;
    /* background-color: #000; */
    margin-right: 40px;
    margin-left: 40px;
    margin-bottom: 40px;
    margin-top: 40px;
  }

</style>
