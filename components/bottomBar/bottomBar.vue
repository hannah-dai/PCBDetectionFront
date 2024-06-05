<template>
	<view>
		<uv-tabbar :value="tabBarValue" @change="index=>tabBarValue = index">
			<uv-tabbar-item text="首页" icon="home" @tap="goCamaraTest"></uv-tabbar-item>
			<uv-tabbar-item text="放映厅" icon="photo" @tap="goChartsTest"></uv-tabbar-item>
			<uv-tabbar-item text="直播" icon="play-right" @tap="goPicturePreviewTest"></uv-tabbar-item>
			<uv-tabbar-item text="我的" icon="account"></uv-tabbar-item>
		</uv-tabbar>
	</view>
</template>

<script setup>
	import { ref } from 'vue';
	import { useTabBarNavigateStore } from '@/stores/tabBarNavigateStore'
	import { storeToRefs } from 'pinia'

	const tabBarNavigaterStore = useTabBarNavigateStore()
	const { tabBarValue } = storeToRefs(tabBarNavigaterStore)

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
</script>

<style>

</style>