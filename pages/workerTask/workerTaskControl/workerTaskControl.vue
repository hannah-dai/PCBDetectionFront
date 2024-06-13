<template>
	<view class="uv-page">
		<!-- 筛选部分 -->
		<uv-drop-down ref="dropDownRef" sign="dropDown_1" text-active-color="#3c9cff"
			:extra-icon="{name:'arrow-down-fill',color:'#666',size:'26rpx'}"
			:extra-active-icon="{name:'arrow-up-fill',color:'#3c9cff',size:'26rpx'}" :defaultValue="defaultValue"
			:custom-style="{padding: '0 90rpx'}" @click="selectMenu">
			<uv-drop-down-item name="finishStatus" type="2" :label="dropItem('finishStatus').label"
				:value="dropItem('finishStatus').value">
			</uv-drop-down-item>
			<uv-drop-down-item name="timeOrder" type="2" :label="dropItem('timeOrder').label"
				:value="dropItem('timeOrder').value">
			</uv-drop-down-item>
		</uv-drop-down>
		<uv-drop-down-popup sign="dropDown_1" :click-overlay-on-close="true" :currentDropItem="currentDropItem"
			@clickItem="clickItem"></uv-drop-down-popup>

		<!-- 任务列表部分 -->
		<view class="task-list">
			<uv-collapse :border="false" ref="collapseRef">
				<view v-if="taskList.length !== 0">
					<view v-for="task in taskList" :key="task.id">
						<uv-collapse-item :border="false"
							:title="`任务: ${task.id.toString().padStart(4, '0')}&nbsp;&nbsp;&nbsp;状态: ${task.assignTime === null ? '未分配' : task.finishTime === null ? '未完成' : '已完成'}`"
							class="collapse-item">
							<view class="task-content">
								<view class="task-info">
									<text class="label">创建时间:</text>
									<text>{{ format(task.createTime, 'yyyy-MM-dd HH:mm:ss') }}</text>
								</view>

								<view class="task-info">
									<text class="label">分配时间:</text>
									<text>{{ task.assignTime === null ? '未分配' : format(task.assignTime, 'yyyy-MM-dd HH:mm:ss') }}</text>
								</view>

								<view class="task-info">
									<text class="label">完成时间:</text>
									<text>{{ task.finishTime === null ? '未完成' : format(task.finishTime, 'yyyy-MM-dd HH:mm:ss') }}</text>
								</view>

								<view class="task-actions">
									<uv-button class="task-button" type="primary" :plain="true"
										@click="viewTaskDetail(task.id)">详情</uv-button>
								</view>
							</view>
						</uv-collapse-item>
					</view>
				</view>
			</uv-collapse>
		</view>

		<view>
			<uniFab :pattern="pattern" :horizontal="horizontal" :vertical="vertical" :direction="direction"
				@fabClick="fabClick"></uniFab>
		</view>

		<view>
			<uv-popup ref='popupRef' mode="center" :round="5">
				<view class="popup-body">
					<view class="popup-title">
						<view class="ver-line"></view>
						<view class="title-desc">
							<text>
								任务时间筛选
							</text>
						</view>
					</view>

					<view class="time-selecter">
						<uni-datetime-picker type="date" :clear-icon="false" v-model="date" />
					</view>

					<view class="popup-buttom-group">
						<uv-button type="default" text="取消" shape="circle" color="rgb(148 163 184)" :plain="true"
							class="popup-bottom" @tap="closePopup" />
						<uv-button type="primary" text="筛选" shape="circle" class="popup-bottom" @tap="filterByTime" />
					</view>
				</view>
			</uv-popup>
		</view>

		<bottomBar />

		<uv-toast ref="toastRef" class="toast-block"></uv-toast>
	</view>
</template>

<script setup>
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	import {
		computed,
		ref,
		watch
	} from 'vue';
	import uniFab from '@/uni_modules/my-fab/components/uniFab/uniFab.vue'
	import {
		onLoad,
		onReady,
		onShow
	} from '@dcloudio/uni-app'
	import {
		startOfDay,
		format,
		addDays
	} from 'date-fns'

	const popupRef = ref(null)

	const defaultValue = ref(['all', 'ASC'])
	const result = ref([])
	const activeName = ref('finishStatus')
	const selectedTaskIndex = ref(null)
	const date = ref(format(new Date(), 'yyyy-MM-dd'))
	const taskList = ref([])

	const dropDownRef = ref(null)
	const pickerRef = ref(null)
	const collapseRef = ref(null)
	const toastRef = ref(null)

	const selections = ref({
		finishStatus: {
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
					label: '未完成',
					value: 'unFinish'
				},
				{
					label: '已完成',
					value: 'finished'
				},
			]
		},
		timeOrder: {
			label: '日期排序',
			value: 'ASC',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
					label: '升序',
					value: 'ASC'
				},
				{
					label: '降序',
					value: 'DES'
				}
			]
		}
	})

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
				item.value == find.value);
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

	const getTaskList = () => {
		let finishStatus = null
		let timeOrder = 'ASC'

		for (const item of result.value) {
			if (item.name === 'finishStatus') {
				finishStatus = item.value
			} else {
				timeOrder = item.value
			}
		}

		uni.request({
			url: 'http://10.0.2.2:8000/task/getMyTasks/',
			method: 'GET',
			data: {
				'startTime': format(date.value, "yyyy-MM-dd"),
				'endTime': format(addDays(date.value, 1), "yyyy-MM-dd"),
				'finishStatus': finishStatus,
				'timeOrder': timeOrder,
				'UUID': '13cce9d3-7e18-4f5c-85da-c95f2a593183'
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				const data = res.data
				taskList.value = data
				collapseRef.value.init()
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

	const horizontal = 'right'
	const vertical = 'bottom'
	const direction = 'horizontal'
	const pattern = ref({
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#007AFF',
		buttonColor: '#007AFF',
		iconColor: '#fff'
	})

	const fabClick = () => {
		openPopup()
	}

	const openPopup = () => {
		popupRef.value.open()
	}

	const closePopup = () => {
		popupRef.value.close()
	}

	const showTip = () => {
		toastRef.value.show({
			type: 'default',
			message: '默认筛选时间为今日，可点击右下角按钮修改筛选时间',
			duration: 2500,
			position: 'top'
		})
	}

	const filterByTime = () => {
		getTaskList()
		closePopup()
	}

	const viewTaskDetail = (id) => {
		uni.navigateTo({
			url: `/pages/workerTask/workerTaskDetail/workerTaskDetail?id=${id}`
		})
	}

	watch(result, () => {
		getTaskList()
	})

	onLoad(() => {
		getTaskList()
	})

	onReady(() => {
		collapseRef.value.init()
		showTip()
	})

	onShow(() => {
		getTaskList()
	})
</script>

<style>
	.uv-page {
		background-color: #FFF;
		min-height: 100%;
	}

	.task-list {
		background-color: #fff;
	}

	.collapse-item {
		padding: 5px 0px;
	}

	.collapse-text {
		font-size: 12px;
	}

	.task-content {
		width: 95%;
		margin: 0px auto;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.task-info {
		display: flex;
		justify-content: space-between;
		padding: 5px 0;
	}

	.task-actions {
		margin: 0px auto;
		width: 100%;
		margin-top: 10px;
	}

	.task-button {
		width: 100%;
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

	.popup-style {
		border-radius: 0.5rem;
	}

	.popup-body {
		width: 300px;
	}

	.popup-buttom-group {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		margin-bottom: 20px;
	}

	.popup-bottom {
		width: 125px;
	}

	.popup-title {
		box-sizing: border-box;
		width: 100%;
		padding: 0px 14px;
		margin: 10px 0px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.ver-line {
		height: 16px;
		width: 4px;
		border-radius: 10px;
		background-color: #0081CF;
	}

	.title-desc {
		font-size: 16px;
		color: #222222;
		margin-left: 12px;
		font-weight: bold;
	}

	.time-selecter {
		width: 90%;
		margin: 15px auto;
		margin-bottom: 20px;
	}
</style>