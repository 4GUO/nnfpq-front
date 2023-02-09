# 牛牛发牌工具前端

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## 主要技术栈
    "vant": "^4.0.7",
    "vue": "^3.2.45",
    "vue-router": "^4.1.6",
    "vuedraggable": "^4.1.0"

## 页面数据构造的主要逻辑

    数据交互方式：wss
    
    主要信息包括：房间信息，玩家信息，牌
    
    房间状态：准备状态，游戏结算状态

### 逻辑线
    登录->创建房间->加入房间->准备->结算

## 鸣谢
    vant4
    vue3
    vuedraggable



