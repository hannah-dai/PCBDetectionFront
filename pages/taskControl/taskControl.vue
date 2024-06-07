<template>
	<view class="uv-page">
		<!-- 筛选部分 -->
		<uv-drop-down 
			ref="dropDown"
			sign="dropDown_1" 
			text-active-color="#3c9cff"
			:extra-icon="{name:'arrow-down-fill',color:'#666',size:'26rpx'}" 
			:extra-active-icon="{name:'arrow-up-fill',color:'#3c9cff',size:'26rpx'}"
			:defaultValue="defaultValue" 
			:custom-style="{padding: '0 30rpx'}" 
			@click="selectMenu"
		>
			<uv-drop-down-item 
				name="completionStatus" 
				type="2" 
				:label="dropItem('completionStatus').label" 
				:value="dropItem('completionStatus').value">
			</uv-drop-down-item>
			<uv-drop-down-item 
				name="assignmentStatus" 
				type="2" 
				:label="dropItem('assignmentStatus').label" 
				:value="dropItem('assignmentStatus').value">
			</uv-drop-down-item>
			<uv-drop-down-item 
				name="dateOrder" 
				type="2" 
				:label="dropItem('dateOrder').label" 
				:value="dropItem('dateOrder').value">
			</uv-drop-down-item>
		</uv-drop-down>
		<uv-drop-down-popup 
			sign="dropDown_1" 
			:click-overlay-on-close="true"
			:currentDropItem="currentDropItem" 
			@clickItem="clickItem"
			@popupChange="change"
		></uv-drop-down-popup>
		
		<!-- 任务列表部分 -->
		<uv-collapse>
			<uv-collapse-item
				v-for="(task, index) in filteredTasks"
				:key="index"
				:title="`任务: ${task.id} 状态: ${task.status}`"
			>
				<view class="task-content">

					<view class="task-info">
						<text class="label">出现时间:</text>
						<text>{{ task.appearanceTime }}</text>
					</view>
					<view class="task-info">
						<text class="label">完成时间:</text>
						<text>{{ task.status === '已完成' ? task.completionTime : '未完成' }}</text>
					</view>

					<view class="task-info">
						<text class="label">分配人员编号:</text>
						<text @click="task.assignment === '已分配' ? showPersonnelInfo(task.assignmentNumber) : null" :class="{'link-text': task.assignment === '已分配', 'unassigned': task.assignment !== '已分配'}">
							{{ task.assignment === '已分配' ? task.assignmentNumber : '未分配' }}
						</text>
					</view>
					<view class="task-actions">

						<uv-button @click="viewTaskDetail(task.id)" customStyle="flex: 1; margin-right: 10px;">详情</uv-button>

					</view>
				</view>
			</uv-collapse-item>
		</uv-collapse>
		
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
				defaultValue: ['all', 'all', 'asc'],
				result: [],
				activeName: 'completionStatus',
				selectedTaskIndex: null,
				personnelColumns: [['人员A', '人员B', '人员C']],
				completionStatus: {
					label: '完成情况',
					value: 'all',
					activeIndex: 0,
					color: '#333',
					activeColor: '#2878ff',
					child: [
						{ label: '全部', value: 'all' },
						{ label: '已完成', value: 'completed' },
						{ label: '未完成', value: 'incomplete' }
					]
				},
				assignmentStatus: {
					label: '分配情况',
					value: 'all',
					activeIndex: 0,
					color: '#333',
					activeColor: '#2878ff',
					child: [
						{ label: '全部', value: 'all' },
						{ label: '已分配', value: 'assigned' },
						{ label: '未分配', value: 'unassigned' }
					]
				},
				dateOrder: {
					label: '日期排序',
					value: 'asc',
					activeIndex: 0,
					color: '#333',
					activeColor: '#2878ff',
					child: [
						{ label: '升序', value: 'asc' },
						{ label: '降序', value: 'desc' }
					]
				},
				tasks: [
					{ id: 1, pipelineNumber: '123', status: '未完成', assignment: '未分配', appearanceTime: '2024-01-01 12:00', assignmentNumber: '无', assignmentTime: '无', completionTime: '无' },
					{ id: 2, pipelineNumber: '456', status: '已完成', assignment: '已分配', appearanceTime: '2024-01-02 13:00', assignmentNumber: 'T123', assignmentTime: '2024-01-02 14:00', completionTime: '2024-01-03 15:00' },
					{ id: 3, pipelineNumber: '789', status: '未完成', assignment: '已分配', appearanceTime: '2024-01-03 14:00', assignmentNumber: 'T456', assignmentTime: '2024-01-03 15:00', completionTime: '无' },
					{ id: 4, pipelineNumber: '012', status: '已完成', assignment: '未分配', appearanceTime: '2024-01-04 15:00', assignmentNumber: '无', assignmentTime: '无', completionTime: '2024-01-05 16:00' }
				]
			};
		},
		computed: {
			filteredTasks() {
				let filtered = this.tasks;

				if (this.result.find(item => item.name === 'completionStatus')?.value === 'completed') {
					filtered = filtered.filter(task => task.status === '已完成');
				} else if (this.result.find(item => item.name === 'completionStatus')?.value === 'incomplete') {
					filtered = filtered.filter(task => task.status === '未完成');
				}

				if (this.result.find(item => item.name === 'assignmentStatus')?.value === 'assigned') {
					filtered = filtered.filter(task => task.assignment === '已分配');
				} else if (this.result.find(item => item.name === 'assignmentStatus')?.value === 'unassigned') {
					filtered = filtered.filter(task => task.assignment === '未分配');
				}

				if (this.result.find(item => item.name === 'dateOrder')?.value === 'desc') {
					filtered = filtered.sort((a, b) => new Date(b.appearanceTime) - new Date(a.appearanceTime));
				} else {
					filtered = filtered.sort((a, b) => new Date(a.appearanceTime) - new Date(b.appearanceTime));
				}

				return filtered;
			},
			dropItem() {
				return name => {
					const result = {};
					const find = this.result.find(item => item.name === name);
					if (find) {
						result.label = find.label;
						result.value = find.value;
					} else {
						result.label = this[name].label;
						result.value = this[name].value;
					}
					return result;
				};
			},
			currentDropItem() {
				return this[this.activeName];
			}
		},
		methods: {
			selectMenu(e) {
				const { name, active, type } = e;
				this.activeName = name;
				const find = this.result.find(item => item.name == this.activeName);
				if (find) {
					const findIndex = this[this.activeName].child.findIndex(item => item.label == find.label && item.value == find.value);
					this[this.activeName].activeIndex = findIndex;
				} else {
					this[this.activeName].activeIndex = 0;
				}
			},
			clickItem(e) {
				let { label, value } = e;
				const findIndex = this.result.findIndex(item => item.name === this.activeName);
				if (this.defaultValue.indexOf(value) > -1 && this[this.activeName].label) {
					label = this[this.activeName].label;
				}
				if (findIndex > -1) {
					this.$set(this.result, findIndex, { name: this.activeName, label, value });
				} else {
					this.result.push({ name: this.activeName, label, value });
				}
				this.result = this.result.filter(item => this.defaultValue.indexOf(item.value) === -1);
			},
			showPersonnelInfo(assignmentNumber) {
				uni.showToast({
					title: `分配人员编号: ${assignmentNumber}`,
					icon: 'none'
				});
			},
			showPicker(index) {
				this.selectedTaskIndex = index;
				this.$refs.picker.open();
			},
			changePicker(e) {
				console.log('changePicker', e);
			},
			confirmPicker(e) {
				if (this.selectedTaskIndex !== null) {
					this.tasks[this.selectedTaskIndex].assignment = '已分配';
					this.tasks[this.selectedTaskIndex].assignmentNumber = e.value[0];
					this.tasks[this.selectedTaskIndex].assignmentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
					this.selectedTaskIndex = null;
				}
			},
			cancelPicker() {
				this.selectedTaskIndex = null;
			},
			viewTaskDetail(taskId) {
				uni.navigateTo({
					url: `/pages/taskControl/taskDetail/taskDetail?taskId=${taskId}`
				});
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

	.collapse-title {
		display: flex;
		justify-content: space-between;
		padding: 5px 0;
	}

	.collapse-title-item {
		flex: 1;
		text-align: center;
	}

	.task-content {
		padding: 10px;
		border-bottom: 1px solid #e5e5e5;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		gap: 5px;
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
		justify-content: center; /* 将子元素水平居中 */
		margin-top: 10px;
	}
</style>
