<template>
	<view class="backView">
		<view class="timeSelect">
			TimeSelect
		</view>
		<view class="timeSelect">
			TimeSelect
		</view>
		<view class="timeSelect">
			TimeSelect
		</view>
		<view class="timeSelect">
			TimeSelect
		</view>
		<view class="timeSelect">
			TimeSelect
		</view>
	</view>
	<bottomBar/>
</template>

<script setup>
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
</script>

<style>
	.backView {
		background-color: rgb(241 245 249);
		min-height: 100%;
		padding-top: 15px;
	}
	.timeSelect {
		background-color: #fff;
		height: 200px;
		width: 90%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 15px;
		border-radius: 0.5rem;
	}
</style>
