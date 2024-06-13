<template>
	<view class="backView">
		<view class="time-select-content">
			<view class="title-time-select">
				<view class="ver-line-time-selected"></view>
				<view class="title-desc">
					<text>
						时间段选择
					</text>
					<text class="title-sm">
						(默认为近一周)
					</text>
				</view>
			</view>
			<view class="time-select-part">
				<uni-datetime-picker v-model="timeRange" type="daterange" :clear-icon="false" />
			</view>
		</view>
		<view class="content">
			<view class="title">
				<view class="ver-line"></view>
				<view class="title-desc">
					<text>
						生产情况数据
					</text>
				</view>
			</view>
			<view class="chart-part">
				<productStatusChart />
			</view>
		</view>
		<view class="content">
			<view class="title">
				<view class="ver-line"></view>
				<view class="title-desc">
					<text>
						缺陷占比情况
					</text>
				</view>
			</view>
			<view class="chart-part">
				<defectStatusChart/>
			</view>
		</view>
		<view class="content">
			<view class="title">
				<view class="ver-line"></view>
				<view class="title-desc">
					<text>
						良品率情况
					</text>
				</view>
			</view>
			<view class="chart-part">
				<yieldStatusChart/>
			</view>
		</view>
	</view>
	<bottomBar />
</template>

<script setup>
	import {
		onBeforeMount,
		ref,
		watch
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import { useProductLineStore } from '@/stores/productLineStore.js'
	import { format, subDays } from 'date-fns'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	import productStatusChart from '@/pages/dataShow/dataDisplay/productStatusChart.vue'
	import defectStatusChart from '@/pages/dataShow/dataDisplay/defectStatusChart.vue'
	import yieldStatusChart from '@/pages/dataShow/dataDisplay/yieldStatusChart.vue'

	const productLineStore = useProductLineStore()

	const startTimePickerRef = ref(null)

	const startTime = format(subDays(new Date(), 7), 'yyyy-MM-dd')
	const endTime = format(subDays(new Date(), 1), 'yyyy-MM-dd')

	const timeRange = ref([startTime, endTime])

	watch(timeRange, () => {
		getProductLineList()
	})

	const getProductLineList = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/dataShow/getProductLineList/',
			method: 'GET',
			data: {
				'startTime': timeRange.value[0],
				'endTime': timeRange.value[1]
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				const data = res.data
				
				productLineStore.productLineList = data.productLineList
				productLineStore.timeRange = timeRange.value
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

	onBeforeMount(() => {
		getProductLineList()
	})

</script>

<style>
	.backView {
		background-color: #f1f3f2;
		min-height: 100%;
		padding-top: 15px;
		padding-bottom: 5px;
	}

	.content {
		background-color: #fff;
		width: 95%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 15px;
		padding-top: 8px;
		border-radius: 0.5rem;
	}

	.time-select-content {
		background-color: #fff;
		height: 95px;
		width: 95%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 15px;
		padding-top: 8px;
		border-radius: 0.5rem;
	}

	.title {
		box-sizing: border-box;
		width: 100%;
		padding: 0px 14px;
		margin: 10px 0px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.title-time-select {
		box-sizing: border-box;
		width: 100%;
		padding: 0px 14px;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
	}

	.title-sm {
		font-size: 12px;
		color: #6e6e6e;
		padding-left: 2px;
	}

	.ver-line-time-selected {
		height: 16px;
		width: 4px;
		border-radius: 10px;
		background-color: #0081CF;
	}

	.ver-line {
		height: 16px;
		width: 4px;
		border-radius: 10px;
		background-color: #4e9d77;
	}

	.title-desc {
		font-size: 16px;
		color: #222222;
		margin-left: 12px;
		font-weight: bold;
	}

	.time-select-part {
		width: 90%;
		margin-top: 15px;
		margin-left: auto;
		margin-right: auto;
	}

	.chart-part {
		margin-bottom: 20px;
	}
</style>
