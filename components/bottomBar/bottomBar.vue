<template>
	<view>
		<uv-tabbar :value="tabBarValue" @change="index=>tabBarValue = index">
			<template v-if="authType == 0">
				<uv-tabbar-item text="任务" icon="order" @tap="goCamaraTest"></uv-tabbar-item>
				<uv-tabbar-item text="我的" icon="account" @tap="goChartsTest"></uv-tabbar-item>
			</template>
			<template v-else-if="authType == 1">
				<uv-tabbar-item text="数据展示" @tap="goDataDisplay">
					<template v-slot:active-icon>
						<image class="icon" src="@/static/icon/data-display-activated.png"></image>
					</template>
					<template v-slot:inactive-icon>
						<image class="icon" src="@/static/icon/data-display.png"></image>
					</template>
				</uv-tabbar-item>
				<uv-tabbar-item text="任务管理" icon="order" @tap="goChartsTest"></uv-tabbar-item>
				<uv-tabbar-item text="用户管理" @tap="goCamaraTest">
					<template v-slot:active-icon>
						<image class="icon" src="@/static/icon/user-admin-activated.png"></image>
					</template>
					<template v-slot:inactive-icon>
						<image class="icon" src="@/static/icon/user-admin.png"></image>
					</template>
				</uv-tabbar-item>
				<uv-tabbar-item text="我的" icon="account" @tap="goPersonPage"></uv-tabbar-item>
			</template>
		</uv-tabbar>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useTabBarNavigateStore } from '@/stores/tabBarNavigateStore'
	import { useUserAuthStore } from '@/stores/userAuthStore'
	import { storeToRefs } from 'pinia'

	const tabBarNavigaterStore = useTabBarNavigateStore()
	const { tabBarValue } = storeToRefs(tabBarNavigaterStore)
	const userAuthStore = useUserAuthStore()
	const { authType } = storeToRefs(userAuthStore)

	const goDataDisplay = () => {
		uni.reLaunch({
			url:"/pages/dataShow/dataDisplay/dataDisplay"
		})
	}

	const goCamaraTest = () => {
		uni.reLaunch({
			url: "/pages/CamaraTest/CamaraTest"
		})
	}

	const goChartsTest = () => {
		uni.reLaunch({
			url: "/pages/chartsTest/chartsTest"
		})
	}

	const goPicturePreviewTest = () => {
		uni.reLaunch({
			url: "/pages/picturePreview/picturePreview"
		})
	}
	
	const goPersonPage = () => {
		uni.reLaunch({
			url:"/pages/personPage/personPage/personPage"
		})
	}
</script>

<style>
	.icon {
		width: 36rpx;
		height: 36rpx;
	}
</style>
