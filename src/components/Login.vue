<template>
  <van-popup v-model:show="loginShow" :closeable="false" :round="true" :close-on-click-overlay="false"
             :style="{ padding: '30px 10px', backgroundColor:'#E9A64D'}">
    <div class="greetings">
      <div class="title">
        建 个 角 色 吧 ~
      </div>
      <van-cell-group inset>
        <van-field v-model="username" placeholder="写 个 牛 逼 的 名 字 8 ~"/>
      </van-cell-group>
      <div class="userCreate">
        <button class="userCreate-btn" @click="UserCreate">确 定</button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      username: '',
      loginShow: false, // 正常来讲 loginshow 控制在这里卵用都没有 只是用个一次性的遮罩而已
      overlayClass: "noClick"
    }
  },
  mounted () {
    let hasUsername = localStorage.getItem('username')
    this.loginShow = hasUsername ? false : true
  },
  methods: {
    UserCreate () {
      if (!this.username) {
        showNotify({ type: 'warning', message: '名 字 必 填', background: "orangered" });
        return
      }
      localStorage.setItem('username', this.username)
      this.loginShow = false
      this.$emit('on-sure')
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

.userCreate {
  margin-top: 2em;
  text-align: center;
}

.userCreate-btn {
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