<template>
  <div class="greetings" v-if="loaded">
    <h1>
      牛牛发牌工具
    </h1>
    <div class="intro bubble">
      当您点进这个页面的时候，您一定是想找点乐子
    </div>
    <div class="intro bubble">
      是的，牛牛的快乐超乎想象，无论输赢，感情都在一声声牛牛里
    </div>
    <div class="intro bubble">
      2023 从“牛牛”起航 ~，开启牛气冲天的一年
    </div>

    <div class="disclaimers">
      <div class="title">免责申明</div>
      <div class="content">
        这只是一个牛牛发牌工具，仅供大家娱乐和学习，请不要使用本工具用于任何形式的赌博，造成任何损失，本工具概不负责！
      </div>
    </div>

    <div class="copyright"> @2023 抖音搜Bee锅~</div>

    <div class="gameGen">
      <button class="gameGen-btn" @click="roomCreate">创 建 房 间</button>
    </div>
    <div>
      <van-popup v-model:show="roomCreateShow" :closeable="false" :round="true"
                 :style="{ padding: '30px 10px', backgroundColor:'#E9A64D'}">
        <RoomCreate @on-sure="roomCreateIng"/>
      </van-popup>

    </div>
  </div>
  <div v-else>
    loading ...
  </div>
</template>

<script>

import RoomCreate from "../components/RoomCreate.vue";

export default {
  name: 'intro',
  components: { RoomCreate },
  mounted () {
    document.title = '牛牛发牌器'
    const that = this
    that.timer = setInterval(function () {
      console.log(document.readyState)
      if (document.readyState === 'complete') {
        that.loaded = true
        window.clearInterval(that.timer)
      }
    }, 1000)
  },
  data () {
    return {
      loaded: false,
      roomCreateShow: false
    }
  },
  methods: {
    roomCreate () {
      this.roomCreateShow = !this.roomCreateShow
    },
    roomCreateIng (data) {
      //字符串转数组

      let param = data.split(',')

      this.$router.push({
        path: "/GamePlay",
        query: {
          mode: 'createRoom',
          roomName: param[0] ?? '',
          roomPass: param[1] ?? '',
          dealerMode: param[2] ?? '',
        }
      })
    }
  }
}
</script>
<style scoped>


.gameGen-btn {
  font-family: 'f1';
  background: orangered;
  border: none;
  color: white;
  padding: 15px 24px;
  font-size: 1.4rem;
  outline: none;
  box-shadow: -6px 6px 0 hsl(16, 100%, 30%);
  position: fixed;
  top: 25px;
  right: 15px;
}

.disclaimers {
  margin-top: 50px;
  font-size: 24px;
  color: red;
}

.copyright, .intro {
  padding: 5px 8px;
  font-size: 24px;
  margin-top: 13%;
}


header {
  line-height: 1.5;
  max-height: 100vh;
}


nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

.bubble {
  border-radius: 10px;
  background-color: aquamarine;
  position: relative;
  margin-left: 20px;
}

.bubble::before {
  position: absolute;
  top: 40px;
  left: -20px;
  content: '';
  width: 0;
  height: 0;
  border-right: 10px solid aquamarine;
  border-bottom: 10px solid transparent;
  border-left: 10px solid transparent;
  border-top: 10px solid transparent;
}


</style>
