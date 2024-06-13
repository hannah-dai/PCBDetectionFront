<template>
	<view class="background">
		<uv-sticky class="sticky-block" offset-top="10">
			<uv-search v-model="searchInput" bgColor="#fff" :clearabled="true" shape="round" :showAction="false"
				@blur="search()" @clear="search"></uv-search>
		</uv-sticky>

		<view class="worker-list">
			<view v-for="worker in filteredWorkerList" v-bind:key="worker.UUID">
				<view class="user-list-item">
					<view class="user-list-item-content">
						<uv-avatar :src="workerIconSrc" size="80"></uv-avatar>
						<view class="user-list-item-text-content">
							<view style="margin-bottom: 4px;">
								<text>姓名：</text>
								<text>{{ worker.fullName }}</text>
							</view>
							<view>
								<text>工号：</text>
								<text>{{ worker.empno }}</text>
							</view>
						</view>
						<uv-button type="primary" text="分配任务" :plain="true" class="user-list-button"
							@tap="assignTask(worker.UUID)" />
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref, watch
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import Fuse from 'fuse.js';

	const searchInput = ref('')
	const workerList = ref([])
	const filteredWorkerList = ref([])
	const taskId = ref(null)
	
	const workerIconSrc = ref('/static/icon/worker.png')

	const search = () => {
		const fuse = new Fuse(workerList.value, {
			keys: ['fullName'],
			threshold: 0.3
		})
		
		if(searchInput.value === ''){
			filteredWorkerList.value = workerList.value
		}else{
			const results = fuse.search(searchInput.value)
			filteredWorkerList.value = results.map(result => result.item)
		}
	}
	
	const assignTask = (UUID) => {
		uni.request({
			url: 'http://10.0.2.2:8000/task/assignTask/',
			method: 'POST',
			data: {
				'UUID': UUID,
				'taskId': taskId.value
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				uni.showToast({
					title: res.data.info,
					icon: 'success',
					duration: 1000
				})
				setTimeout(() => {
					uni.navigateBack()
				}, 1000)
			},
			fail: (err) => {
				uni.showToast({
					title: '请求失败',
					icon: 'error',
					duration: 1000
				})
			}
		})
	}
	
	const getWorkerList = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/userAdmin/getWorkerList/',
			method: 'GET',
			success: (res) => {
				workerList.value = res.data
				filteredWorkerList.value = res.data
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			fail: (err) => {
				uni.showToast({
					title: '请求失败',
					icon: 'error',
					duration: 1000
				})
			}
		})
	}
	
	onLoad((options) => {
		taskId.value = options.id
		
		getWorkerList()
	})
</script>

<style>
	.background {
		min-height: 100%;
		background-color: #f1f3f2;
	}

	.sticky-block {
		width: 90%;
		margin: 0px auto;
	}
	
	.worker-list {
		padding: 12px 0px;
		padding-top: 24px;
	}
	
	.user-list-item {
		background-color: #FFF;
		width: 95%;
		border-radius: 0.5rem;
		margin: 0px auto;
		margin-bottom: 12px;
	}
	
	.user-list-item-content {
		padding: 18px 0px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}
	
	.user-list-item-text-content {
		margin-left: -5%;
	}
	
	.user-list-button {
		margin-left: 5%;
	}
</style>