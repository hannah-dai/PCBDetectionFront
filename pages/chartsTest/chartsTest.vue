<template>
	<view class="content">
		<view class="chart-con">
			<!-- 时间筛选框开始 -->
			<view><uni-row class="uni-row" :width="timeSelectWidth">
					<uni-col :span="8">
						<view><uni-section class=uni-wrap title="'时间选择'" type="circle"></uni-section>
						</view>
					</uni-col>
					<uni-col :span="16">
						<!-- span调整两列的占比，可任意调整 -->
						<uni-datetime-picker v-model="range" type="daterange"/>
					</uni-col>
				</uni-row></view>
			<!-- 时间筛选框结束 -->

			<!-- 饼环-开始 -->
			<view class="chart-wrap">
				<view class="title">
					<view class="ver-line"></view>
					<view class="title-desc">缺陷种类占比</view>
				</view>
				<view class="ring-chart">
					<l-echart ref="ringChart"></l-echart>
				</view>
			</view>
		</view>
		<!-- 饼环-结束 -->

		<!-- 缺陷数量折线开始 -->
		<view class="chart-con gap">
			<view class="chart-wrap">
				<view class="title">
					<view class="ver-line"></view>
					<view class="title-desc">缺陷数量<text class="t-sm">(缺陷数量随时间变化)</text></view>
				</view>
				<view class="line-chart-con">
					<uni-section>
						<uni-data-select :title="生产线选择" v-model="selectedLines" :localdata="productionLines" @change="onSelectChange"
							multiple label="选择生产线" placeholder="选择生产线"></uni-data-select>
					</uni-section>

					<l-echart class="line-chart" ref="lineChart1"></l-echart>
				</view>
			</view>
		</view>
		<!-- 缺陷数量折线-结束 -->

		<!-- 良品率随时间变化折线 -开始-->
		<view class="chart-con gap">
			<view class="chart-wrap">
				<view class="title">
					<view class="ver-line"></view>
					<view class="title-desc">良品率<text class="t-sm">(良品率随时间变化)</text></view>
				</view>
				<view class="line-chart-con">
					<l-echart class="line-chart" ref="lineChart2"></l-echart>
				</view>
			</view>
		</view>
		<!-- 良品率随时间变化折现-结束 -->
	</view>
	<bottomBar/>
</template>

<script>
	//若开发者工具上传时提示包太大，在hbuilder中点击发行后进行预览上传
	//如果你使用的是vue2（当前使用的是vue2和vue3都兼容的方式），包可以更小，优化方式如下：
	//1.删除项目根目录node_moudules文件夹；
	//2.在https://echarts.apache.org/zh/builder.html链接定制相应图标，例如按默认的下载大概500kb左右，名称为echarts.min.js；
	//3.将echarts.min.js放入到uni_modules/lime-echart/static目录下，通过这样引入：
	//import * as echarts from '@/uni_modules/lime-echart/static/echarts.min.js';
	//4.删除从本行的下一行开始到export default {之间的代码，其他不变。
	import * as echarts from 'echarts/core';
	import {
		LineChart,
		PieChart
	} from 'echarts/charts';
	import {
		TooltipComponent,
		GridComponent,
	} from 'echarts/components';
	import {
		CanvasRenderer
	} from 'echarts/renderers';
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	// 注册必须的组件
	echarts.use([
		TooltipComponent,
		GridComponent,
		LineChart,
		PieChart,
		CanvasRenderer
	]);
	export default {
		data() {
			return {
				// 时间选择
				datetimesingle: '',
				range: ['2022-01-1', '2025-01-1'],
				datetimerange: [],
				start: Date.now() - 1000000000,
				end: Date.now() + 1000000000,
				timeSelectWidth: 100,

				// 生产线
				selectedLines: null,
				productionLines: [{
						value: 1,
						text: '生产线1'
					},
					{
						value: 2,
						text: '生产线2'
					},
					{
						value: 3,
						text: '生产线3'
					}
				],
				dataMap: {
					1: {
						xData: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17'],
						yData: [100, 120, 150, 220, 180, 500, 130]
					},
					2: {
						xData: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17'],
						yData: [50, 120, 150, 220, 180, 300, 130]
					},
					3: {
						xData: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17'],
						yData: [50, 12, 15, 22, 180, 300, 130]
					}
				}

			}
		},
		mounted() {
			this.$nextTick(() => {

				//加载饼环数据
				this.loadRingData();
				//加载良品率折线图数据
				this.loadLineData_quality();
				//加载缺陷的折线图数据
				this.loadLineData(this.dataMap[1])
			})

			//时间选择范围默认选择从今日到前一周时间内
			const endDate = new Date();
			// 获取一周前的日期
			const startDate = new Date();
			startDate.setDate(endDate.getDate() - 7);
			// 格式化日期为 YYYY-MM-DD
			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			};

			// 设置默认范围
			this.range = [formatDate(startDate), formatDate(endDate)];

		},


		methods: {
			// 生产线选择加载数据

			onSelectChange(e) {

				const selectedData = this.dataMap[e];

				this.loadLineData(selectedData)


			},


			//加载良品率数据,这里可以去请求服务器获取数据
			loadLineData_quality() {
				let res = {
					//x轴数据
					xData: ['6/11', '6/12', '6/13', '6/14', '6/15', '6/16', '6/17', '6/18', '6/19', '6/20'],
					//y轴数据
					yData: [50, 120, 150, 220, 180, 300, 130, 150, 200, 600],
				}

				//这里option配置参考文档：https://echarts.apache.org/zh/option.html
				let option = {
					xAxis: {
						type: 'category',
						// x轴数据文字颜色
						axisLabel: {
							color: '#a7a7a7'
						},
						// x轴那天坐标轴线的颜色
						axisLine: {
							lineStyle: {
								color: '#f1f1f1',
							}
						},
						//x轴上面刻度线隐藏
						axisTick: {
							show: false,
						},
						//这里是x轴数据
						data: res.xData
					},
					//设置网格
					grid: {
						top: 40,
						bottom: 30,
					},
					//y轴设置
					yAxis: {
						type: 'value',
						//y轴标签文字颜色
						axisLabel: {
							color: '#a7a7a7'
						},
						// y轴分割线设置为虚线
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					//设置提示为点击时
					tooltip: {
						trigger: 'axis',
						triggerOn: 'click',
						formatter: '{b} \n 数据: {c}'
					},
					//设置曲线的颜色
					color: ['#4e9d77'],
					series: [{
						//这里是数据
						data: res.yData,
						type: 'line',
						//设置为平滑，默认为折线
						smooth: false,
					}]
				};

				this.$refs.lineChart2.init(echarts, chart => {
					chart.setOption(option);
				});
			},


			//加载饼环数据,这里可以去请求服务器获取数据
			loadRingData() {
				//这里请求服务器得到数据
				let data = [{
						name: '缺陷1',
						value: 2000
					},
					{
						name: '缺陷2',
						value: 1500
					},
					{
						name: '缺陷3',
						value: 900
					},
					{
						name: '缺陷4',
						value: 300
					},
					{
						name: '缺陷5',
						value: 2001
					}
				];

				//这里option配置参考文档：https://echarts.apache.org/zh/option.html
				this.$refs.ringChart.init(echarts, chart => {
					chart.setOption({
						series: [{
							type: 'pie',
							// selectedMode: 'single',
							// selectedOffset: 0,
							// hoverAnimation: false,
							radius: [50, 80],
							left: 'center',
							width: '98%',
							//隐藏默认白边
							itemStyle: {
								borderColor: '#fff',
								borderWidth: 0
							},
							//格式化label显示
							label: {
								alignTo: 'edge',
								formatter: '{name|{b}}\n{time|{c} 人}',
								minMargin: 5,
								edgeDistance: 20,
								lineHeight: 24,
								rich: {
									time: {
										fontSize: 10,
										color: '#999'
									}
								}
							},
							//指向label的线设置
							labelLine: {
								length: 15,
								length2: 0,
								maxSurfaceAngle: 80
							},
							//布局样式
							labelLayout: function(params) {
								const isLeft = params.labelRect.x < chart.getWidth() /
									2;
								const points = params.labelLinePoints;

								points[2][0] = isLeft ?
									params.labelRect.x :
									params.labelRect.x + params.labelRect.width;
								return {
									labelLinePoints: points
								};
							},

							//数据
							data: data
						}]
					});
					//默认突出高亮显示，可以放开下面注释
					// chart.dispatchAction({
					// 	type: 'highlight',
					// 	seriesIndex: 0,
					// 	dataIndex: 0
					// });
					//监听图标项点击事件
					chart.on("click", function(e) {
						for (var i = 0; i < data.length; i++) {
							if (i != e.dataIndex) {
								chart.dispatchAction({
									type: 'downplay', //取消高亮显示;
									seriesIndex: 0,
									dataIndex: i
								});
							} else {
								chart.dispatchAction({
									type: 'highlight', //突出高亮显示;
									seriesIndex: 0,
									dataIndex: i
								});
							}
						}
					});
				});
			},
			//加载折线图数据
			loadLineData(data) {
				//这里请求服务器拿到数据
				let res = data

				//这里option配置参考文档：https://echarts.apache.org/zh/option.html
				let option = {
					xAxis: {
						type: 'category',
						// x轴数据文字颜色
						axisLabel: {
							color: '#a7a7a7'
						},
						// x轴那天坐标轴线的颜色
						axisLine: {
							lineStyle: {
								color: '#f1f1f1',
							}
						},
						//x轴上面刻度线隐藏
						axisTick: {
							show: false,
						},
						//这里是x轴数据
						data: res.xData
					},
					//设置网格
					grid: {
						top: 40,
						bottom: 30,
					},
					//y轴设置
					yAxis: {
						type: 'value',
						//y轴标签文字颜色
						axisLabel: {
							color: '#a7a7a7'
						},
						// y轴分割线设置为虚线
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					//设置提示为点击时
					tooltip: {
						trigger: 'axis',
						triggerOn: 'click',
						formatter: '{b} \n 数据: {c}'
					},
					//设置曲线的颜色
					color: ['#4e9d77'],
					series: [{
						//这里是数据
						data: res.yData,
						type: 'line',
						//设置为平滑，默认为折线
						smooth: true,
					}]
				};

				this.$refs.lineChart1.init(echarts, chart => {
					chart.setOption(option);
				});
			}
		},
	}
</script>

<style lang="scss" scoped>
	.content {
		width: 100%;
		min-height: 100vh;
		background-color: #f1f3f2;
		padding: 20rpx 0rpx 100rpx;
	}

	.t-sm {
		font-size: 22rpx;
		color: #6e6e6e;
		padding-left: 10rpx;
	}

	.chart-con {
		width: 100%;
		box-sizing: border-box;
		padding: 0rpx 28rpx;

		.chart-wrap {
			width: 100%;
			box-sizing: border-box;
			background-color: #ffffff;
			padding: 32rpx 0rpx;
			border-radius: 20rpx;

			.title {
				box-sizing: border-box;
				width: 100%;
				padding: 0rpx 28rpx;
				display: flex;
				flex-direction: row;
				justify-content: flex-start;
				align-items: center;
			}

			.ver-line {
				height: 30rpx;
				width: 8rpx;
				border-radius: 10rpx;
				background-color: #4e9d77;
			}

			.title-desc {
				font-size: 30rpx;
				color: #222222;
				margin-left: 22rpx;
				font-weight: bold;
			}

			.ring-chart {
				height: 400rpx;
				width: 100%;
				box-sizing: border-box;
				padding: 0rpx 28rpx;
				margin-top: 32rpx;
			}

			.process-con {
				padding: 50rpx 28rpx 18rpx;
				box-sizing: border-box;
				width: 100%;

				.process-item:not(:last-child) {
					margin-bottom: 50rpx;
				}

				.process-item {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					align-items: center;

					.pay-img {
						width: 65rpx;
						height: 65rpx;
					}

					.percent-con {
						display: flex;
						flex-direction: column;
						justify-content: flex-start;
						align-items: center;
						flex: 1;
						padding-left: 28rpx;

						.top {
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							font-size: 28rpx;
							color: #222222;
							width: 100%;

						}

						.bot {
							width: 100%;
							height: 12rpx;
							background-color: #f5f5f5;
							border-radius: 10rpx;
							position: relative;
							margin-top: 14rpx;

							.percent-num {
								background-color: #4e9d77;
								position: absolute;
								height: 100%;
								top: 0;
								left: 0;
								z-index: 1;
								border-radius: 10rpx;
								transition: width .5s ease-in;
							}
						}
					}
				}
			}

			.line-chart-con {
				width: 100%;
				box-sizing: border-box;
				padding: 0rpx 28rpx;

				.fun-tabs {
					margin-top: 42rpx;
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-self: center;
					width: 100%;
					box-sizing: border-box;

					.tab-item {
						width: 200rpx;
						height: 120rpx;
						border-radius: 10rpx;
						padding-left: 20rpx;
						background: #ffffff;
						border: 1rpx solid #ececec;
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: flex-start;
						box-sizing: border-box;

						.item-name {
							color: #6e6e6e;
							font-size: 20rpx;
						}

						.item-val {
							color: #222222;
							font-size: 24rpx;
							font-weight: bold;
							margin-top: 20rpx;
						}
					}

					.selected {
						background: #edf5f1 !important;
						border: 1rpx solid #4e9d77 !important;

						.item-name {
							color: #4e9d77 !important;
						}

						.item-val {
							color: #4e9d77 !important;
						}
					}
				}

				.line-chart {
					margin-top: 30rpx;
					height: 380rpx;
				}
			}
		}
	}


	.gap {
		margin-top: 30rpx;
	}

	.t-items {
		width: 690rpx;
		box-sizing: border-box;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
		background: #fff;
		margin: 10rpx auto;

		.t-item {
			font-size: 28rpx;
			color: #222222;
			height: 80rpx;
			line-height: 80rpx;
			font-weight: bold;
		}


	}

	.uni-wrap {
		flex-direction: column;

		height: 35px;
		flex: 1;
	}
</style>
