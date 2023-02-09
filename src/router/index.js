import {createRouter, createWebHashHistory} from 'vue-router'
import Intro from '../views/Intro.vue'
import GamePlay from '../views/GamePlay.vue'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'intro',
            component: Intro,
            meta: {
                title: '牛牛发牌器'
            }
        },
        {
            path: '/gamePlay',
            name: 'gamePlay',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: GamePlay,
            meta: {
                title: '牛牛发牌器'
            }
        }
    ]
})

export default router
