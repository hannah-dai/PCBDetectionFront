<template>
	<view class="uv-page">
		<!-- PCB缺陷拍摄图展示 -->
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">PCB缺陷拍摄图</text>
			<view class="uv-demo-block__content">
				<uv-album :urls="pcbDefectPhotos" :multipleSize="62" rowCount="4" maxCount="10"></uv-album>
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
					<text class="label">流水线编号:</text>
					<text>{{ task.pipelineNumber }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成状态:</text>
					<text>{{ task.status }}</text>
				</view>
				<view class="task-info">
					<text class="label">出现时间:</text>
					<text>{{ task.appearanceTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成时间:</text>
					<text>{{ task.status === '已完成' ? task.completionTime : '未完成' }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配时间:</text>
					<text>{{ task.assignment === '已分配' ? task.assignmentTime : '未分配' }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配人员编号:</text>
					<text @click="task.assignment === '已分配' ? showPersonnelInfo(task.assignmentNumber) : null" :class="{'link-text': task.assignment === '已分配', 'unassigned': task.assignment !== '已分配'}">
						{{ task.assignment === '已分配' ? task.assignmentNumber : '未分配' }}
					</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷类别:</text>
					<text>{{ task.defectCategory }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷数量:</text>
					<text>{{ task.defectCount }}</text>
				</view>
				<view class="task-actions">
					<uv-button @click="showPicker" customStyle="flex: 1; margin-right: 10px;">分配人员</uv-button>
					<uv-button :disabled="task.status === '已完成' || task.assignment === '未分配'" @click="cancelTask(task.id)" type="error" customStyle="flex: 1;">取消任务</uv-button>
				</view>
			</view>
		</view>
		
		<!-- 人员选择器 -->
		<uv-picker
			ref="picker"
			:columns="personnelColumns"
			@cancel="cancelPicker"
			@confirm="confirmPicker"
			@change="changePicker"
		></uv-picker>
	</view>
</template>
<script>
	import { toast } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

	export default {
		data() {
			return {
				task: {
					id: 1,
					pipelineNumber: '123',
					status: '未完成',
					assignment: '未分配',
					appearanceTime: '2024-01-01 12:00',
					assignmentNumber: '无',
					assignmentTime: '无',
					completionTime: '无',
					defectCategory: '焊接缺陷',
					defectCount: 5
				},
				pcbDefectPhotos: [
					'https://via.placeholder.com/100x200.png/3c9cff/fff',
					'https://via.placeholder.com/200x200.png/3c9cff/fff',
					'https://via.placeholder.com/300x200.png/3c9cff/fff',
					'https://via.placeholder.com/280x200.png/3c9cff/fff',
					'https://via.placeholder.com/240x200.png/3c9cff/fff',
					'https://via.placeholder.com/180x200.png/3c9cff/fff',
					'https://via.placeholder.com/140x200.png/3c9cff/fff',
					'https://via.placeholder.com/150x200.png/3c9cff/fff',
					'https://via.placeholder.com/90x200.png/3c9cff/fff',
					'https://via.placeholder.com/220x200.png/3c9cff/fff'
				],
				personnelColumns: [['人员A', '人员B', '人员C']],
				selectedTaskIndex: null
			};
		},
		methods: {
			showPersonnelInfo(assignmentNumber) {
				uni.showToast({
					title: `分配人员编号: ${assignmentNumber}`,
					icon: 'none'
				});
			},
			showPicker() {
				this.$refs.picker.open();
			},
			changePicker(e) {
				console.log('changePicker', e);
			},
			confirmPicker(e) {
				this.task.assignment = '已分配';
				this.task.assignmentNumber = e.value[0];
				this.task.assignmentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
			},
			cancelPicker() {
				this.selectedTaskIndex = null;
			},
			cancelTask(taskId) {
				uni.showToast({
					title: `取消任务ID: ${taskId}`,
					icon: 'none'
				});
			}
		}
	};
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
		justify-content: center;
		margin-top: 10px;
		gap: 10px;
	}
</style>

