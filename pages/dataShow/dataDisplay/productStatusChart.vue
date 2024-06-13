<template>
	<view class="options-list">
		<view class="options-item">
			<uni-data-select v-model="columnType" :localdata="columnTypeRange" placeholder="选择柱状图类型" />
		</view>
		<view class="options-item">
			<uni-data-select v-model="productLineId" :localdata="productLineIdRange" placeholder="选择生产线" />
		</view>
	</view>
	<view class="chart-part">
		<qiun-data-charts type="column" :opts="opts" :chartData="chartData" :ontouch="true" />
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		watch
	} from 'vue'
	import {
		onLoad
	} from "@dcloudio/uni-app"
	import { useProductLineStore } from '@/stores/productLineStore.js'
	import { storeToRefs } from 'pinia'

	const productLineStore = useProductLineStore()
	const { productLineList, timeRange } = storeToRefs(productLineStore)

	const columnType = ref(null)
	const columnTypeRange = ref([{
			value: 'group',
			text: '基本柱状图'
		},
		{
			value: 'stack',
			text: '堆叠柱状图'
		}
	])
	const columnStyle = computed(() => {
		if (columnType.value == 'stack') {
			return {
				type: "stack",
				width: 30,
				activeBgColor: "#000000",
				activeBgOpacity: 0.08,
				labelPosition: "center"
			}
		} else {
			return {
				type: "group",
				width: 30,
				activeBgColor: "#000000",
				activeBgOpacity: 0.08
			}
		}
	})

	const productLineId = ref(null)
	const productLineIdRange = computed(() => {
		const productLineDict = []
		
		for(const item of productLineList.value){
			productLineDict.push({value: item, text: `生产线${item}`})
		}
		
		return productLineDict
	})

	const chartData = ref({})
	const opts = computed(() => {
		return {
			color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
				"#ea7ccc"
			],
			padding: [15, 30, 0, 5],
			enableScroll: true,
			legend: {},
			xAxis: {
				disableGrid: true,
				scrollShow: true,
				itemCount: 4,
				title: '日期'
			},
			yAxis: {
				showTitle: true,
				data: [{
					position: "left",
					title: "单位:个",
					min: 0
				}]
			},
			extra: {
				column: columnStyle.value
			}
		}
	})

	const getServerData = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/dataShow/getProductStatus/',
			method: 'GET',
			data:{
				'startTime': timeRange.value[0],
				'endTime': timeRange.value[1],
				'productLineId': productLineId.value
			},
			header: {
				'Authorization': uni.getStorageSync('token')
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
		width: 95%;
		margin: 15px auto;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.options-item {
		width: 45%;
	}
</style>