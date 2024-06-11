<template>
	<view class="uv-page">
		<!-- 当前工人正在执行的任务 -->
		<view class="uv-section">
			<text class="section-title">当前任务</text>
			<view v-if="currentTask" class="task-content">
				<view class="task-info">
					<text class="label">任务编号:</text>
					<text>{{ currentTask.id }}</text>
				</view>
				<view class="task-info">
					<text class="label">流水线编号:</text>
					<text>{{ currentTask.pipelineNumber }}</text>
				</view>
				<view class="task-info">
					<text class="label">任务描述:</text>
					<text>{{ currentTask.description }}</text>
				</view>
				<view class="task-info">
					<text class="label">出现时间:</text>
					<text>{{ currentTask.appearanceTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷类别:</text>
					<text>{{ currentTask.defectType }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷数量:</text>
					<text>{{ currentTask.defectCount }}</text>
				</view>
				<view class="task-actions">
					<uv-button @click="completeTask(currentTask.id)" type="success">完成任务</uv-button>
					<uv-button @click="viewTaskDetail(currentTask.id)" customStyle="margin-left: 10px;">详情</uv-button>
				</view>
			</view>
			<view v-else class="task-content">
				<text>没有正在进行的任务</text>
			</view>
		</view>

		<!-- 当前工人被指派的任务列表 -->
		<view class="uv-section">
			<uv-collapse>
				<uv-collapse-item title="被指派的任务">
					<view v-for="(task, index) in assignedTasks" :key="index" class="task-content">
						<view class="task-info">
							<text class="label">任务编号:</text>
							<text>{{ task.id }}</text>
						</view>
						<view class="task-info">
							<text class="label">流水线编号:</text>
							<text>{{ task.pipelineNumber }}</text>
						</view>
						<view class="task-info">
							<text class="label">任务描述:</text>
							<text>{{ task.description }}</text>
						</view>
						<view class="task-info">
							<text class="label">出现时间:</text>
							<text>{{ task.appearanceTime }}</text>
						</view>
						<view class="task-info">
							<text class="label">缺陷类别:</text>
							<text>{{ task.defectType }}</text>
						</view>
						<view class="task-info">
							<text class="label">缺陷数量:</text>
							<text>{{ task.defectCount }}</text>
						</view>
						<view class="task-actions">
							<uv-button @click="selectTask(task.id)" type="primary">选择任务</uv-button>
							<uv-button @click="viewTaskDetail(task.id)" customStyle="margin-left: 10px;">详情</uv-button>
						</view>
					</view>
				</uv-collapse-item>
			</uv-collapse>
		</view>

		<!-- 工人已完成的任务列表 -->
		<view class="uv-section">
			<uv-collapse>
				<uv-collapse-item title="已完成的任务">
					<view v-for="(task, index) in completedTasks" :key="index" class="task-content">
						<view class="task-info">
							<text class="label">任务编号:</text>
							<text>{{ task.id }}</text>
						</view>
						<view class="task-info">
							<text class="label">流水线编号:</text>
							<text>{{ task.pipelineNumber }}</text>
						</view>
						<view class="task-info">
							<text class="label">任务描述:</text>
							<text>{{ task.description }}</text>
						</view>
						<view class="task-info">
							<text class="label">出现时间:</text>
							<text>{{ task.appearanceTime }}</text>
						</view>
						<view class="task-info">
							<text class="label">缺陷类别:</text>
							<text>{{ task.defectType }}</text>
						</view>
						<view class="task-info">
							<text class="label">缺陷数量:</text>
							<text>{{ task.defectCount }}</text>
						</view>
						<view class="task-info">
							<text class="label">完成时间:</text>
							<text>{{ task.completionTime }}</text>
						</view>
						<view class="task-actions">
							<uv-button @click="viewTaskDetail(task.id)" customStyle="margin-left: 10px;">详情</uv-button>
						</view>
					</view>
				</uv-collapse-item>
			</uv-collapse>
		</view>
	</view>
</template>
<script>
	import { toast } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

	export default {
		data() {
			return {
				currentTask: null,
				assignedTasks: [
					{ id: 1, pipelineNumber: '123', description: '检查焊接点', appearanceTime: '2024-01-01 12:00', defectType: '焊接问题', defectCount: 5, status: '进行中' },
					{ id: 2, pipelineNumber: '456', description: '更换电容', appearanceTime: '2024-01-02 13:00', defectType: '电容损坏', defectCount: 3, status: '待完成' },
					{ id: 3, pipelineNumber: '789', description: '测试电路板', appearanceTime: '2024-01-03 14:00', defectType: '电路故障', defectCount: 2, status: '待完成' }
				],
				completedTasks: [
					{ id: 4, pipelineNumber: '101', description: '修复电路板', appearanceTime: '2024-01-01 10:00', defectType: '短路', defectCount: 1, completionTime: '2024-01-01 12:00' },
					{ id: 5, pipelineNumber: '102', description: '更换电阻', appearanceTime: '2024-01-02 12:00', defectType: '电阻问题', defectCount: 4, completionTime: '2024-01-02 14:00' }
				]
			};
		},
		methods: {
			selectTask(taskId) {
				const selectedTask = this.assignedTasks.find(task => task.id === taskId);
				if (selectedTask) {
					this.currentTask = { ...selectedTask, status: '进行中' };
				}
			},
			completeTask(taskId) {
				const completionTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
				this.completedTasks.push({ ...this.currentTask, completionTime });
				this.currentTask = null;
				toast('任务完成');
			},
			viewTaskDetail(taskId) {
				uni.navigateTo({
					url: `/pages/taskControl/taskDetail/taskDetail?taskId=${taskId}`
				});
			}
		}
	};
</script>
<style scoped lang="scss">
	.uv-page {
		padding: 15px;
	}

	.uv-section {
		margin-bottom: 20px;
	}

	.section-title {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.task-content {
		background: #fff;
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
		margin-bottom: 10px;
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

	.task-actions {
		display: flex;
		justify-content: center;
		margin-top: 10px;
		gap: 10px;
	}
</style>
