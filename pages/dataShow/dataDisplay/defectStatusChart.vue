<template>
	<view class="options-list">
		<view class="options-item-lg">
			<uni-data-select v-model="productLineId" :localdata="productLineIdRange" placeholder="选择生产线" />
		</view>
		<view class="options-list-group">
			<view class="options-item">
				<uni-data-select v-model="rateOrNum" :localdata="rateOrNumRange" placeholder="百分比或数量" />
			</view>
			<view class="options-item">
				<uni-data-select v-model="defectType" :localdata="defectTypeRange" placeholder="选择缺陷类型" />
			</view>
		</view>
	</view>
	<view class="chart-part">
		<qiun-data-charts type="line" :opts="opts" :chartData="chartData" :ontouch="true" />
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
	} from '@dcloudio/uni-app'
	import { useProductLineStore } from '@/stores/productLineStore.js'
	import { storeToRefs } from 'pinia'

	const productLineStore = useProductLineStore()
	const { productLineList, timeRange } = storeToRefs(productLineStore)
	
	const productLineId = ref(null)
	const productLineIdRange = computed(() => {
		const productLineDict = []
		
		for(const item of productLineList.value){
			productLineDict.push({value: item, text: `生产线${item}`})
		}
		
		return productLineDict
	})
	
	const rateOrNum = ref(1)
	const rateOrNumRange = ref([
		{ value: 0, text: '百分比' },
		{ value: 1, text: '数量'}
	])
	
	const defectType = ref(null)
	const defectTypeRange = ref([
		{ value: 'mh', text: '缺孔' },
		{ value: 'mb', text: '鼠咬' },
		{ value: 'oc', text: '开路' },
		{ value: 'sh', text: '短路' },
		{ value: 'sp', text: '尖角线' },
		{ value: 'spc', text: '多余铜' },
	])

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
				title: "单位:个"
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
			url: 'http://10.0.2.2:8000/dataShow/getDefectStatus/',
			method: 'GET',
			data: {
				'startTime': timeRange.value[0],
				'endTime': timeRange.value[1],
				'productLineId': productLineId.value,
				'percentage': rateOrNum.value,
				'defectType': defectType.value
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
	
	watch(rateOrNum, () => {
		if(rateOrNum.value === 0){
			opts.value.yAxis.data[0].title = '单位:%'
		}else{
			opts.value.yAxis.data[0].title = '单位:个'
		}
		getServerData()
	})
	
	watch(productLineId, () => {
		getServerData()
	})
	
	watch(defectType, () => {
		getServerData()
	})
	
	watch(timeRange, () => {
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

	.options-list-group {
		width: 95%;
		margin: 15px auto;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.options-item {
		width: 45%;
	}

	.options-item-lg {
		width: 90%;
		margin: 0px auto;
	}
</style>