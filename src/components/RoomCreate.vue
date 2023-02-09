<template>
  <div class="greetings">
    <div class="title">
      创建房间
    </div>
    <van-cell-group inset>
      <van-field v-model="roomName" label="房间名称" placeholder="请输入房间名称"/>
      <!--      <van-field v-model="roomPass" label="房间密码" placeholder="密码（不填表示不要密码）"/>-->
      <van-field name="radio" label="庄家规则">
        <template #input>
          <van-radio-group v-model="dealerMode" direction="horizontal">
            <van-radio :name=0>固定</van-radio>
            <van-radio :name=1>轮转</van-radio>
          </van-radio-group>
        </template>
      </van-field>
    </van-cell-group>
    <div class="waring">
      <div>固定庄表示庄家一直是房主，轮转表示出现最大的牛牛自动切换为庄家</div>
    </div>
    <div class="homeCreate">
      <button class="homeCreate-btn" @click="roomCreate">确 定</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RoomCreate',
  data () {
    return {
      roomName: '',
      roomPass: '',
      dealerMode: 1,
    }
  },
  methods: {
    roomCreate () {
      if (!this.roomName) {
        showNotify({ type: 'warning', message: '名 称 必 填', background: "orangered" });
        return
      }
      this.loginShow = false
      let infoStr = [this.roomName, this.roomPass, this.dealerMode].toString()
      this.$emit('on-sure', infoStr)
    },
  }
}
</script>

<style scoped>
.title {
  font-size: 24px;
  color: #f8f8f8;
  text-align: center;
  margin-bottom: 1em;
}

.waring {
  font-size: 20px;
  margin: 0.5em 1em;
  color: red;
}

.homeCreate {
  text-align: center;
}

.homeCreate-btn {
  font-family: 'f1';
  background: orangered;
  border: none;
  color: white;
  padding: 15px 24px;
  font-size: 1.2rem;
  outline: none;
  box-shadow: -6px 6px 0 hsl(16, 100%, 30%);

}
</style>