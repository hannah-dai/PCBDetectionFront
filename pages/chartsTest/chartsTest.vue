<template>
	<view>
		<text>Chart!</text>
		<view class="charts-box">
			<qiun-data-charts type="column" :chartData="chartData" :opts="opts" :ontouch="true"></qiun-data-charts>
		</view>
	</view>
	<bottomBar/>
</template>

<script setup>
	import { reactive, ref } from 'vue';
	import { onReady } from '@dcloudio/uni-app'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'

	const chartData = ref({})
	const opts = reactive({
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [15, 15, 0, 5],
		touchMoveLimit: 24,
		enableScroll: true,
		legend: {},
		xAxis: {
			disableGrid: true,
			scrollShow: true,
			itemCount: 4
		},
		yAxis: {
			data: [{
				min: 0
			}]
		},
		extra: {
			column: {
				type: "group",
				width: 30,
				activeBgColor: "#000000",
				activeBgOpacity: 0.08
			}
		}
	})

	const getServerData = () => {
		//模拟从服务器获取数据时的延时
		setTimeout(() => {
			let res = {
				categories: ["2018", "2019", "2020", "2021", "2022", "2023"],
				series: [{
						name: "目标值",
						data: [35, 36, 31, 33, 13, 34]
					},
					{
						name: "完成量",
						data: [18, 27, 21, 24, 6, 28]
					}
				]
			};
			chartData.value = JSON.parse(JSON.stringify(res));
		}, 500);
	}

	onReady(() => {
		getServerData()
	})
</script>

<style>
	.charts-box {
		width: 100%;
		height: 300px;
	}
</style>