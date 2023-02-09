<template>
  <div class="greetings" v-if="loaded">
    <div class="font-base">庄 家 大 哥 : <b class="font-letter-space-base font-30">{{ roomInfo.dealerName }}</b></div>
    <div class="font-base" @click="showOnline">大 佬 共 计 : {{ roomJoiner.length || 0 }} 人</div>
    <div class="font-base">第 {{ roomInfo.rounds }} 局 :{{ homeStatusText(roomInfo.status) }}</div>
    <div class="btn-box">
      <button class="btn-base" @click="ready">准 备</button>
    </div>
    <van-popup v-model:show="clientOnlineShow" position="left"
               :style="{ width: '60%', height: '100%',backgroundColor:'#E9A64D' }">
      <div class="userlist-left-box">
        <div class="font-base center userlist-left-box-item">
          在线大佬列表
        </div>
        <div class="online-item">
          <div class="font-base center userlist-left-box-item" v-for="item in roomJoiner">
            <b class="user-remove" v-if="isDecDealer()">
              <van-icon name="clear" @click="tClient(item.clientId)"/>
            </b> {{ item.clientName }}
            <div class="online-pai-item">
              <div v-for="pai in paiData[item.clientId]">
                <div><img class="online-pai-img" :src="pai.decorUrl"></div>
                <div class="online-pai-val">{{ pai.pokerVal }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <div class="box-status bs0" v-if="roomInfo.status == 0">
      <div class="userlist-title font-30">群 雄 集 结</div>
      <div class="userlist-box" v-if="roomJoiner.length !=0">
        <div class="userlist-box-item" v-for="item in roomJoiner">
          <div v-if="checkReady(item.clientId)" class="bubble">
            {{ item.clientName }}
            <van-icon class="userlist-box-item-status" name="success"/>
          </div>
          <div class="bubble-noready" v-else>
            {{ item.clientName }}
            <van-icon class="userlist-box-item-status" name="cross"/>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- 按道理不存在这样的状态，除非房主跑了，别的用户进不来        -->
        <div class="font-base">暂时还没有一位勇士</div>
      </div>
    </div>
    <div class="box-status bs1" v-if="roomInfo.status == 1 && joinerPaiData.length != 0">
      <div class="poker-show-box">
        <div class="poker-overlap">
          <div v-for="(item ,index) in joinerPaiData"><img :class="pokerClassGen(index)" :src="item.pokerUrl"></div>
        </div>
      </div>
      <div class="poker-about-me">
        <div class="poker-show-mode ">
          <div class="font-base"> 我的牌</div>
        </div>
        <div class="decor-box">
          <draggable v-model="joinerPaiData" item-key="name">
            <template #item="{element}">
              <div class="decor-item">
                <div><img class="decor-img" :src="element.decorUrl"></div>
                <div class="poker-val">{{ element.pokerVal }}</div>
              </div>
            </template>
          </draggable>
        </div>
      </div>
      <!--      <div class="poker-about-dealer" v-if="!isDecDealer()">
              <div class="poker-show-mode ">
                <div class="font-base"> 庄家牌</div>
              </div>
              &lt;!&ndash;
                    <div class="poker-overlap">
                      <div v-for="(item ,index) in dealerPaiData"><img :class="pokerClassGen(index)" :src="item.pokerUrl"></div>
                    </div>&ndash;&gt;
              <div class="decor-box">
                <draggable v-model="dealerPaiData" item-key="name">
                  <template #item="{element}">
                    <div class="decor-item">
                      <div><img class="decor-img" :src="element.decorUrl"></div>
                      <div class="poker-val">{{ element.pokerVal }}</div>
                    </div>
                  </template>
                </draggable>
              </div>
            </div>-->
    </div>
    <!-- 正在进行结算的游戏状态   -->
    <div v-if="roomInfo.status == 1 && joinerPaiData.length == 0">
      <div class="box-status bs1">
        <div class="font-base">请等待下一轮发牌</div>
      </div>
    </div>
    <!--  本来放在底部的，有点不协调放上面了  -->
    <div class="footer-menu">
      <img src="../assets/img/home.png" @click="goHome">
      <img src="../assets/img/user-guide.png" @click="showGuide">
    </div>
    <div>
      <!--  控制用户手册的弹出层    -->
      <van-popup v-model:show="userGuideShow" :closeable="true" :round="true"
                 :style="{ height: '80%', padding: '30px 10px', backgroundColor:'#E9A64D'}">
        <UserGuide/>
      </van-popup>
    </div>
    <div class="copyright"> @2023 抖音搜Bee锅~</div>
    <Login @on-sure="init"/>
  </div>
  <div v-else>
    loading ...
  </div>
</template>

<script>
import {showNotify} from 'vant';
import {ref} from 'vue';
import draggable from 'vuedraggable'
import Login from "../components/Login.vue"
import UserGuide from "../components/UserGuide.vue"

export default {
  name: 'GamePlay',
  components: {
    draggable, Login, UserGuide
  },
  data () {
    return {
      loaded: false, // 页面是否加载完
      userGuideShow: true, // 用户手册展示控制
      clientOnlineShow: false, // 用户在线展示
      readyAudio: null, // 准备的音频
      startAudio: null, // 进入房间的音频
      clientId: '', // 用户clientId
      clientName: '', // 用户名称
      roomJoiner: [], // 房间参与者
      // 房间信息
      roomInfo: {
        dealerName: '...',
        status: 0, // 0 玩家准备中 1 牛牛进行中
        rounds: 0,
      },
      // 用户状态
      joinerRoundStatus: {},
      paiData: {},
      // 庄家牌
      dealerPaiData: [],
      // 参与者的牌
      joinerPaiData: [],
      // ws 链接
      ws: null,
      // ws 状态
      wsUnconnectStatus: false,
    }
  },

  mounted () {
    this.init()
  },
  methods: {
    init () {
      // 页面加载判断
      this.isLoaded()
      // 初始化标题
      this.setTitle('页面加载中..')
      // 加载音频
      this.loadAudio()

      // 检测是否有名称 否则需要先完成名称
      let username = this.getClientName()
      if (!username) {
        return
      }
      // 建立ws
      this.wsConnect()
    },
    loadAudio () {
      this.readyAudio = new Audio(this.assetsUrl('mp3', 'ready.mp3'));
      this.startAudio = new Audio(this.assetsUrl('mp3', 'start.mp3'));
    },
    audioPlay (audio) {
      if (!audio) {
        return;
      }
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          // Autoplay started
          console.log('come in ~~~')
        }).catch(error => {
          // Autoplay was prevented.
          audio.muted = true;
          audio.play();
        });
      }
    },
    isLoaded () {
      const that = this
      that.timer = setInterval(function () {
        console.log(document.readyState)
        if (document.readyState === 'complete') {
          that.loaded = true
          that.audioPlay(that.startAudio)
          window.clearInterval(that.timer)
        }
      }, 1000)

    },
    setTitle (title) {
      document.title = title
    },
    isDecDealer () {
      const dealerClientId = this.roomInfo.dealerClientId ?? ''
      const clientId = this.clientId
      if (dealerClientId != '' && dealerClientId == clientId) {
        return true;
      } else {
        return false
      }
    },
    checkReady (clientId) {
      return this.joinerRoundStatus[clientId] ?? false
    },
    ready () {
      const readyData = { type: "ready" };
      this.audioPlay(this.readyAudio)
      this.send(readyData)
    },
    getClientStatus (clientId) {
      return joinerRoundStatus[clientId] ?? false
    },
    getClientName () {
      return localStorage.getItem('username')
    },
    getRoomId () {
      return this.$router.currentRoute.value.query.roomId ?? 0
    },
    tClient (clientId) {
      return this.send({ 'type': 'T', 'targetId': clientId })
    },
    homeStatusText () {
      let config = {
        0: "玩家准备中...",
        1: "游戏进行中...",
      }
      return config[this.roomInfo.status]
    },
    pokerClassGen (index) {
      index += 1
      return `imgItem img-${index}`
    },
    assetsUrl (dir, name) {
      return new URL(`../assets/${dir}/${name}`, import.meta.url).href
    },
    convertPaiData (data) {
      if (typeof data !== 'object') {
        return []
      }
      if (!data) {
        return []
      }
      let paiData = [];
      data.forEach((item) => {

        let decor = item.substr(0, 1)
        let pokerVal = item.substr(1)

        const pokerValConfig = {
          '1': 'A', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
          '7': '7', '8': '8', '9': '9', '10': '10', '11': 'J', '12': 'Q',
          '13': 'K'
        }

        paiData.push(
            {
              name: item,
              decor,
              pokerVal: pokerValConfig[pokerVal],
              'decorUrl': this.assetsUrl('decor', `${decor}.png`),
              'pokerUrl': this.assetsUrl('poker', `${item}.png`)
            },
        )
      })
      return paiData;
    },
    goHome () {
      this.$router.push({
        path: "/",
      })
    },
    showGuide () {
      this.userGuideShow = !this.userGuideShow
    },
    showOnline () {
      this.clientOnlineShow = !this.clientOnlineShow
    },
    wsConnect () {
      const _that = this
      // 创建websocket
      _that.ws = new WebSocket(this.wsUrl());
      // 当socket连接打开时，输入用户名 登录
      _that.ws.onopen = this.onopen;
      // 当有消息时根据消息类型显示不同信息
      _that.ws.onmessage = this.onmessage;

      _that.ws.onerror = function () {
        _that.wsUnconnectStatus = true
        console.log(_that.wsUnconnectStatus)
        console.log("出现错误");
      };

      _that.ws.onclose = function () {
        console.log("连接关闭，定时重连");
        _that.wsUnconnectStatus = true
        setTimeout(_that.wsConnect, 3000)
      };
    },
    onopen () {
      this.send({ "type": "login", "clientName": localStorage.getItem("username") });
    },
    onmessage (e) {

      let data = JSON.parse(e.data);
      console.log(data, 'msg rec');
      switch (data['type']) {
          // 服务端ping客户端
        case 'ping':
          this.ws.send('{"type":"pong"}');
          break;
          // 登录 更新用户列表
        case 'loginSucc':
          this.wsUnconnectStatus = false
          this.clientId = data['clientId']
          // 登录成功之后判断是创建房间还是加入房间
          if (this.$router.currentRoute.value.query.mode == "createRoom") {
            // 创建房间
            this.send({
              type: "roomCreate",
              roomName: this.$router.currentRoute.value.query.roomName ?? "",
              roomPass: this.$router.currentRoute.value.query.roomPass ?? "",
              dealerMode: this.$router.currentRoute.value.query.dealerMode ?? "",
            })

          } else {
            this.send({
              type: "roomJoin",
              roomId: this.$router.currentRoute.value.query.roomId ?? "",
            })
          }
          break;
        case 'roomCreateSucc':
          //房间创建成功
          // 更换路由
          this.$router.replace({
            path: "/GamePlay",
            query: {
              mode: 'joinRoom',
              roomId: data.data['roomId'] ?? "",
            }
          })
          break;
          // 房间所有信息初始化
        case 'roomDataInit':
          this.roomJoiner = data.data.roomJoiner
          this.roomInfo = data.data.roomInfo ?? {}
          this.joinerRoundStatus = data.data.joinerRoundStatus ?? {}
          this.clientId = data.data.clientId
          this.clientName = data.data.clientName
          this.setTitle(this.roomInfo.roomName)
          break;
        case 'roomInfoChange':
          this.roomInfo = data.data
          break;
        case 'roomJoinSuccInform':
          this.roomJoiner.push({
            clientId: data.data['clientId'],
            clientName: data.data['clientName'],
          })
          break;
        case 'clientStatusReset':
          // 用户状态全部重置
          this.joinerRoundStatus = data.data
          console.log(this.joinerRoundStatus)
          break;
        case 'clientReadied':
          // 单个用户准备完毕
          this.joinerRoundStatus[data.data.clientId] = true
          console.log(this.joinerRoundStatus)
          break;
        case 'roomLogout':
          // 退出
          this.roomJoiner = this.roomJoiner.filter(({ clientId }) => clientId !== data.data['clientId']);
          break;
          // 用户退出 更新用户列表
        case 'dealerPaiData':
          this.dealerPaiData = this.convertPaiData(data.data.pai)
          break;
        case 'joinerPaiData':
          this.joinerPaiData = this.convertPaiData(data.data.pai)
          break;
        case 'allJoinerPaiData':
          let pai = data.data.pai ?? {};

          let convertedPai = {};

          for (let [key, value] of Object.entries(pai)) {
            convertedPai[key] = this.convertPaiData(value)
          }

          this.dealerPaiData = convertedPai[this.roomInfo['dealerClientId']] ?? []
          this.joinerPaiData = convertedPai[this.clientId] ?? []
          this.paiData = convertedPai

          break;
        case 'error':
          showNotify({ type: 'danger', message: data.msg });
          break;
      }
    },
    send (data) {
      let sendData = { ...data, roomId: this.getRoomId() }
      this.ws.send(JSON.stringify(sendData))
    },
    wsUrl () {
      let domain = document.domain;
      let isSsl = document.location.href.search('https') === -1
      if (isSsl) {
        return "ws://" + domain + ":7272"
      }
      return "wss://" + domain + '/wss';
    },
  }
}
</script>

<style scoped>

.box-status {
  margin-top: 2em;
  margin-bottom: 6em;
}

.poker-overlap {
  height: 200px;
  margin-top: 0.3em;
  text-align: center;
  display: flex;
  flex-wrap: nowrap;
}

.img-1 {
  position: absolute;
  top: 1em;
  left: 25px;
}

.img-2 {
  position: absolute;
  top: 1em;
  left: 55px;
}

.img-3 {
  position: absolute;
  top: 1em;
  left: 85px;
}

.img-4 {
  position: absolute;
  top: 1em;
  left: 115px;
}

.img-5 {
  position: absolute;
  top: 1em;
  left: 145px;
}


.imgItem {
  width: 110px;
  margin-left: 0.2em;
}

.imgItem-flex {
  width: 65px;
  margin-left: 0.2em;
}

.userlist-left-box-item {
  margin: 0.8em;
}

.center {
  text-align: center;
}

.poker-show-mode {
  margin-top: 0.3em;
}


.userlist-box {
  margin-top: 1em;
  display: flex;
  flex-wrap: wrap;
}

.userlist-box-item {
  font-size: 22px;
  margin: 0.2em 0.1em;
  width: fit-content;
}


.bubble {
  border-radius: 10px;
  background-color: aquamarine;
  position: relative;
  margin-left: 20px;
  padding: 0.3em 0.5em;
}

.bubble-noready {
  border-radius: 10px;
  background-color: darkgray;
  position: relative;
  margin-left: 20px;
  padding: 0.3em 0.5em;
}

.userlist-box-item-status {
  margin-left: 10px;
}

.font-base {
  font-family: 'f1';
  font-size: 24px;
}

.font-letter-space-base {
  letter-spacing: 0.2em;
}

.font-30 {
  font-family: 'f1';
  font-size: 30px;
}

.btn-box {
  margin-top: 1em;
}

.btn-base {
  font-family: 'f1';
  background: orangered;
  border: none;
  color: white;
  padding: 15px 24px;
  margin-right: 30px;
  font-size: 1.2rem;
  outline: none;
  box-shadow: -6px 6px 0 hsl(16, 100%, 30%);
}

.poker-stretch div {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1.5em;
}

.userlist-left-box {
  margin: 3em 1em;
}

.user-remove {
  margin-right: 0.2em;
}

.decor-box div {
  display: flex;
  justify-content: center;
  border-radius: 6px;
}

.decor-item {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background: white;
  height: 60px;
  margin: 2px 3px;

}

.decor-img {
  width: 18px;
  margin-left: 5px;
}

.poker-val {
  font-family: 'f1';
  font-size: 21px;
  line-height: 3px;
  margin-right: 5px;
}

.online-pai-img {
  width: 18px;

}

.online-pai-val {
  font-family: 'f1';
  font-size: 21px;
  line-height: 3px;

}


.van-skeleton__content div {
  height: 35px;
}


.footer-menu {
  position: fixed;
  top: 2.5em;
  right: 5%;
  display: flex;
  flex-direction: row;
  justify-content: center;

}

.footer-menu img {
  margin-right: 5px;
  width: 2.5em;
}

.copyright {
  position: fixed;
  bottom: 2em;
  padding: 5px 8px;
  font-size: 15px;
  margin-top: 13%;
}

.online-pai-item {
  display: flex;
  justify-content: center;

}
</style>