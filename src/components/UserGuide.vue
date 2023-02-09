<template>
  <div class="greetings font-30">
    <div>
      1 开始一局游戏：首页创建房间->分享给朋友->朋友都进入房间全部准备后程序自动发牌
    </div>
    <div>
      2 庄家规则：固定庄就是建房的为庄家一直不变，轮庄是玩家牛牛或者更大牌比庄家大则换庄
    </div>
    <div>
      3 牛牛规则：五小牛>炸弹>金牛>银牛>牛牛>有牛>没牛(不管倍数，这个地方只影响轮庄)
    </div>
    <div>
      4 操作规则：只关注准备按钮，全部准备好后开牌，结算后庄家再次点击准备，大家依次准备就会触发下一轮发牌
    </div>
    <div>
      5 请离队友：庄家点击房间人数，侧边弹出房间玩家，点击 X 即可
    </div>
    <div>
      6 更换姓名：清除缓存后重新进入
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowGuide'
}
</script>

<style scoped>
  .greetings{
    padding: 20px 30px;
  }
</style>