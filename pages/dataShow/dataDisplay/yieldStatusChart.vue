<template>
	<view class="options-list">
		<view class="options-item-lg">
			<uni-data-select v-model="productLineId" :localdata="productLineIdRange" placeholder="选择生产线" />
		</view>
	</view>
	<view class="chart-part">
		<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true" />
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watch
	} from 'vue'
	import {
		onLoad,
		onReady
	} from '@dcloudio/uni-app'
	import {
		useProductLineStore
	} from '@/stores/productLineStore.js'
	import {
		storeToRefs
	} from 'pinia'

	const productLineStore = useProductLineStore()
	const {
		productLineList, timeRange
	} = storeToRefs(productLineStore)

	const productLineId = ref(null)
	const productLineIdRange = computed(() => {
		const productLineDict = []

		for (const item of productLineList.value) {
			productLineDict.push({
				value: item,
				text: `生产线${item}`
			})
		}

		return productLineDict
	})

	const chartData = ref({})
	const opts = ref({
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [15, 30, 0, 15],
		enableScroll: true,
		legend: {},
		xAxis: {
			disableGrid: true,
			scrollShow: true,
			itemCount: 4,
			title: '日期'
		},
		yAxis: {
			gridType: "dash",
			dashLength: 2,
			showTitle: true,
			data: [{
				position: "left",
				title: "单位:%"
			}]
		},
		extra: {
			line: {
				type: "straight",
				width: 2,
				activeType: "hollow"
			}
		}
	})

	const getServerData = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/dataShow/getYieldStatus/',
			method: 'GET',
			data: {
				'startTime': timeRange.value[0],
				'endTime': timeRange.value[1],
				'productLineId': productLineId.value
			},
			success: (res) => {
				const data = res.data

				chartData.value = data
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
	
	watch(timeRange, () => {
		getServerData()
	})
	
	watch(productLineId, () => {
		getServerData()
	})

	onLoad(() => {
		getServerData()
	})
</script>

<style>
	.chart-part {
		width: 95%;
		height: 250px;
		margin-left: auto;
		margin-right: auto;
	}

	.options-list {
		margin: 15px auto;
	}

	.options-item-lg {
		width: 90%;
		margin: 0px auto;
	}
</style>