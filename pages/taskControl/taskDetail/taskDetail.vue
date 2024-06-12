<template>
	<view class="uv-page">
		<!-- PCB缺陷拍摄图展示 -->
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">PCB缺陷拍摄图</text>
			<view class="uv-demo-block__content">
				<image :src="imageSrc" mode="aspectFit" @click="previewPicture" />
			</view>
		</view>

		<!-- 任务详细信息展示 -->
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">任务详细信息</text>
			<view class="uv-demo-block__content">
				<view class="task-info">
					<text class="label">任务编号:</text>
					<text>{{ task.id }}</text>
				</view>
				<view class="task-info">
					<text class="label">生产线编号:</text>
					<text>{{ task.pipelineNumber }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成状态:</text>
					<text>{{ task.assignTime === null ? '未分配' : task.finishTime === null ? '未完成' : '已完成' }}</text>
				</view>
				<view class="task-info">
					<text class="label">创建时间:</text>
					<text>{{ task.createTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成时间:</text>
					<text>{{ task.finishTime === null ? '未完成' : task.finishTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配时间:</text>
					<text>{{ task.assignTime === null ? '未分配' : task.assignTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配人员编号:</text>
					<text>{{ task.assignWorkerEmpno === null ? '无' : task.assignWorkerEmpno }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺孔缺陷:</text>
					<text>{{ task.mhCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">鼠咬缺陷:</text>
					<text>{{ task.mbCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">开路缺陷:</text>
					<text>{{ task.ocCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">短路缺陷:</text>
					<text>{{ task.shCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">尖角线缺陷:</text>
					<text>{{ task.spCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">多余铜缺陷:</text>
					<text>{{ task.spcCount }}</text>
				</view>
				<view class="task-actions">
					<uv-button class="task-button" type="primary" :plain="true" :disabled="task.assignTime !== null"
						@click="goPersonnelAssignment">分配人员</uv-button>
					<uv-button class="task-button" :disabled="task.finishTime !== null || task.assignTime === null"
						type="error" @tap="cancelAssign">取消任务</uv-button>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ref
	} from 'vue';
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'

	const taskId = ref(null)
	const task = ref({})
	const imageSrc = ref('')


	const goPersonnelAssignment = () => {
		uni.navigateTo({
			url: `/pages/taskControl/personnelAssignment/personnelAssignment?id=${taskId.value}`
		})
	}

	const downloadImage = () => {
		uni.showLoading({
			title: '加载中'
		})

		uni.downloadFile({
			url: `http://10.0.2.2:8000/task/getTaskPicture/?id=${taskId.value}`,
			success: (res) => {
				imageSrc.value = res.tempFilePath
				uni.hideLoading()
			},
			fail: (err) => {
				console.log("download fail for err ", err)
			}
		})
	}

	const previewPicture = () => {
		uni.previewImage({
			urls: [imageSrc.value]
		})
	}

	const getTaskDetail = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/task/getTaskDetail/',
			method: 'GET',
			data: {
				'id': taskId.value
			},
			success: (res) => {
				task.value = res.data
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

	const cancelAssign = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/task/cancelAssign/',
			method: 'POST',
			data: {
				'taskId': taskId.value
			},
			success: (res) => {
				uni.showToast({
					title: res.data.info,
					icon: 'success',
					duration: 1000
				})
			},
			fail: (err) => {
				uni.showToast({
					title: '请求失败',
					icon: 'error',
					duration: 1000
				})
			}
		})
		getTaskDetail()
	}

	onLoad((options) => {
		taskId.value = options.id

		downloadImage()
		getTaskDetail()
	})

	onShow(() => {
		getTaskDetail()
	})
</script>
<style scoped lang="scss">
	.uv-page {
		padding: 15px;
	}

	.uv-demo-block {
		margin-bottom: 20px;
	}

	.uv-demo-block__title {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.uv-demo-block__content {
		background: #fff;
		padding: 30px;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.album {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		&__avatar {
			margin-bottom: 10px;
		}
	}

	.task-info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 5px 0;
	}

	.label {
		font-weight: bold;
		color: #333;
	}

	.link-text {
		color: #3c9cff;
		cursor: pointer;
	}

	.unassigned {
		color: #ccc;
	}

	.task-actions {
		display: flex;
		justify-content: space-between;
		margin-top: 10px;
	}

	.task-button {
		width: 140px;
	}
</style>