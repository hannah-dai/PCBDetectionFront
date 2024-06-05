<template>
	<view class="content">
		<image class="logo" src="/static/logo/PCB.png"></image>
		<view class="text-area">
			<text class="title">{{title}}</text>
		</view>

	</view>
</template>

<script setup>
	import { onReady } from '@dcloudio/uni-app'
	import { ref } from 'vue';

	const title = 'Welcome!'

	onReady(() => {
		setTimeout(() => {
			uni.reLaunch({
				url:"/pages/loginPage/login/login"
			})
		}, 1500)
	})
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 250rpx;
		width: 250rpx;
		margin-top: 250rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 64rpx;
		color: #000;
	}
</style>
