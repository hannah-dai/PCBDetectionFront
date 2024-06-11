<template>
	<view class="uv-page">
		<!-- 筛选部分 -->
		<uv-drop-down ref="dropDownRef" sign="dropDown_1" text-active-color="#3c9cff"
			:extra-icon="{name:'arrow-down-fill',color:'#666',size:'26rpx'}"
			:extra-active-icon="{name:'arrow-up-fill',color:'#3c9cff',size:'26rpx'}" :defaultValue="defaultValue"
			:custom-style="{padding: '0 30rpx'}" @click="selectMenu">
			<uv-drop-down-item name="completionStatus" type="2" :label="dropItem('completionStatus').label"
				:value="dropItem('completionStatus').value">
			</uv-drop-down-item>
			<uv-drop-down-item name="assignmentStatus" type="2" :label="dropItem('assignmentStatus').label"
				:value="dropItem('assignmentStatus').value">
			</uv-drop-down-item>
			<uv-drop-down-item name="dateOrder" type="2" :label="dropItem('dateOrder').label"
				:value="dropItem('dateOrder').value">
			</uv-drop-down-item>
		</uv-drop-down>
		<uv-drop-down-popup sign="dropDown_1" :click-overlay-on-close="true" :currentDropItem="currentDropItem"
			@clickItem="clickItem"></uv-drop-down-popup>

		<view>
			<uni-datetime-picker v-model="datetimerange" type="datetimerange" rangeSeparator="至" />
		</view>

		<!-- 任务列表部分 -->
		<uv-collapse>
			<uv-collapse-item v-for="(task, index) in filteredTasks" :key="index"
				:title="`任务: ${task.id} 状态: ${task.status}`">
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
						<text @click="task.assignment === '已分配' ? showPersonnelInfo(task.assignmentNumber) : null"
							:class="{'link-text': task.assignment === '已分配', 'unassigned': task.assignment !== '已分配'}">
							{{ task.assignment === '已分配' ? task.assignmentNumber : '未分配' }}
						</text>
					</view>
					<view class="task-actions">

						<uv-button @click="viewTaskDetail(task.id)"
							customStyle="flex: 1; margin-right: 10px;">详情</uv-button>

					</view>
				</view>
			</uv-collapse-item>
		</uv-collapse>

		<!-- 人员选择器 -->
		<uv-picker ref="pickerRef" :columns="personnelColumns" @cancel="cancelPicker" @confirm="confirmPicker"
			@change="changePicker"></uv-picker>

		<view class="fab-block">
			<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
				:direction="direction" style="bottom: 100px;"></uni-fab>
		</view>

		<bottomBar />
	</view>
</template>
<script setup>
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	import {
		computed,
		ref
	} from 'vue';

	const defaultValue = ref(['all', 'all', 'asc'])
	const result = ref([])
	const activeName = ref('completionStatus')
	const selectedTaskIndex = ref(null)
	const personnelColumns = ref([
		['人员A', '人员B', '人员C']
	])
	const datetimerange = ref([])

	const dropDownRef = ref(null)
	const pickerRef = ref(null)

	const selections = ref({
		completionStatus: {
			label: '完成情况',
			value: 'all',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
					label: '全部',
					value: 'all'
				},
				{
					label: '已完成',
					value: 'completed'
				},
				{
					label: '未完成',
					value: 'incomplete'
				}
			]
		},
		assignmentStatus: {
			label: '分配情况',
			value: 'all',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
					label: '全部',
					value: 'all'
				},
				{
					label: '已分配',
					value: 'assigned'
				},
				{
					label: '未分配',
					value: 'unassigned'
				}
			]
		},
		dateOrder: {
			label: '日期排序',
			value: 'asc',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
					label: '升序',
					value: 'asc'
				},
				{
					label: '降序',
					value: 'desc'
				}
			]
		}
	})

	const tasks = ref([{
			id: 1,
			pipelineNumber: '123',
			status: '未完成',
			assignment: '未分配',
			appearanceTime: '2024-01-01 12:00',
			assignmentNumber: '无',
			assignmentTime: '无',
			completionTime: '无'
		},
		{
			id: 2,
			pipelineNumber: '456',
			status: '已完成',
			assignment: '已分配',
			appearanceTime: '2024-01-02 13:00',
			assignmentNumber: 'T123',
			assignmentTime: '2024-01-02 14:00',
			completionTime: '2024-01-03 15:00'
		},
		{
			id: 3,
			pipelineNumber: '789',
			status: '未完成',
			assignment: '已分配',
			appearanceTime: '2024-01-03 14:00',
			assignmentNumber: 'T456',
			assignmentTime: '2024-01-03 15:00',
			completionTime: '无'
		},
		{
			id: 4,
			pipelineNumber: '012',
			status: '已完成',
			assignment: '未分配',
			appearanceTime: '2024-01-04 15:00',
			assignmentNumber: '无',
			assignmentTime: '无',
			completionTime: '2024-01-05 16:00'
		}
	])

	const filteredTasks = ref([{
			id: 1,
			pipelineNumber: '123',
			status: '未完成',
			assignment: '未分配',
			appearanceTime: '2024-01-01 12:00',
			assignmentNumber: '无',
			assignmentTime: '无',
			completionTime: '无'
		},
		{
			id: 2,
			pipelineNumber: '456',
			status: '已完成',
			assignment: '已分配',
			appearanceTime: '2024-01-02 13:00',
			assignmentNumber: 'T123',
			assignmentTime: '2024-01-02 14:00',
			completionTime: '2024-01-03 15:00'
		},
		{
			id: 3,
			pipelineNumber: '789',
			status: '未完成',
			assignment: '已分配',
			appearanceTime: '2024-01-03 14:00',
			assignmentNumber: 'T456',
			assignmentTime: '2024-01-03 15:00',
			completionTime: '无'
		},
		{
			id: 4,
			pipelineNumber: '012',
			status: '已完成',
			assignment: '未分配',
			appearanceTime: '2024-01-04 15:00',
			assignmentNumber: '无',
			assignmentTime: '无',
			completionTime: '2024-01-05 16:00'
		}
	])

	const dropItem = computed(() => {
		return name => {
			const result1 = {}
			const find = result.value.find(item => item.name === name)
			if (find) {
				result1.label = find.label
				result1.value = find.value
			} else {
				result1.label = selections.value[name].label
				result1.value = selections.value[name].value
			}
			return result1
		}
	})

	const currentDropItem = computed(() => {
		return selections.value[activeName.value]
	})

	const selectMenu = (e) => {
		const {
			name,
			active,
			type
		} = e
		activeName.value = name;
		const find = result.value.find(item => item.name == activeName.value);
		if (find) {
			const findIndex = selections.value[activeName.value].child.findIndex(item => item.label == find.label &&
				item
				.value == find.value);
			selections.value[activeName.value].activeIndex = findIndex;
		} else {
			selections.value[activeName.value].activeIndex = 0;
		}
	}

	const clickItem = (e) => {
		let {
			label,
			value
		} = e
		const findIndex = result.value.findIndex(item => item.name === activeName.value)
		if (defaultValue.value.indexOf(value) > -1 && selections.value[activeName.value].label) {
			label = selections.value[activeName.value].label
		}
		if (findIndex > -1) {
			result.value[findIndex] = {
				name: activeName.value,
				label,
				value
			}
		} else {
			result.value.push({
				name: activeName.value,
				label,
				value
			})
		}
		result.value = result.value.filter(item => defaultValue.value.indexOf(item.value) === -1)
	}

	const showPersonnelInfo = (assignmentNumber) => {
		uni.showToast({
			title: `分配人员编号: ${assignmentNumber}`,
			icon: 'none'
		});
	}

	const showPicker = (index) => {
		selectedTaskIndex.value = index;
		pickerRef.value.open();
	}

	const changePicker = (e) => {
		console.log('changePicker', e);
	}

	const confirmPicker = (e) => {
		if (selectedTaskIndex.value !== null) {
			tasks.value[selectedTaskIndex.value].assignment = '已分配';
			tasks.value[selectedTaskIndex.value].assignmentNumber = e.value[0];
			tasks.value[selectedTaskIndex.value].assignmentTime = new Date().toISOString().slice(0, 19).replace('T',
				' ');
			selectedTaskIndex.value = null;
		}
	}

	const cancelPicker = () => {
		selectedTaskIndex.value = null;
	}

	const viewTaskDetail = (taskId) => {
		uni.navigateTo({
			url: `/pages/taskControl/taskDetail/taskDetail?taskId=${taskId}`
		});
	}

	const cancelTask = (taskId) => {
		uni.showToast({
			title: `取消任务ID: ${taskId}`,
			icon: 'none'
		})
	}

	const horizontal = 'right'
	const vertical = 'bottom'
	const direction = 'horizontal'
	const pattern = {
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#007AFF',
		buttonColor: '#007AFF',
		iconColor: '#fff'
	}

	const content = ref([{
		iconPath: '/static/icon/add-worker.png',
		selectedIconPath: '/static/icon/add-worker-active.png',
		text: '工人',
		active: false
	}])
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
		justify-content: center;
		/* 将子元素水平居中 */
		margin-top: 10px;
	}
</style>
