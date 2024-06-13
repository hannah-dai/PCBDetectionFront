<template>
	<view class="uv-page">
		<!-- PCB缺陷拍摄图展示 -->
		<view class="pcb-picture-block">
			<view class="pcb-picture-title-block">
				<view class="ver-line"></view>
				<text class="pcb-picture-title">PCB缺陷拍摄图</text>
			</view>
			<view class="pcb-picture-image">
				<image :src="imageSrc" mode="aspectFit" @click="previewPicture" />
			</view>
		</view>

		<!-- 任务详细信息展示 -->
		<view class="task-detail-block">
			<view class="task-detail-title-block">
				<view class="ver-line"></view>
				<text class="task-detail-title">任务详细信息</text>
			</view>
			<view class="task-detail-info-list">
				<view class="task-info">
					<text class="label">任务编号:</text>
					<text>{{ task.id }}</text>
				</view>
				<view class="task-info">
					<text class="label">生产线编号:</text>
					<text>{{ task.pipelineNumber }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成状态:</text>
					<text>{{ task.assignTime === null ? '未分配' : task.finishTime === null ? '未完成' : '已完成' }}</text>
				</view>
				<view class="task-info">
					<text class="label">创建时间:</text>
					<text>{{ task.createTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成时间:</text>
					<text>{{ task.finishTime === null ? '未完成' : task.finishTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配时间:</text>
					<text>{{ task.assignTime === null ? '未分配' : task.assignTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配人员编号:</text>
					<text>{{ task.assignWorkerEmpno === null ? '无' : task.assignWorkerEmpno }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺孔缺陷:</text>
					<text>{{ task.mhCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">鼠咬缺陷:</text>
					<text>{{ task.mbCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">开路缺陷:</text>
					<text>{{ task.ocCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">短路缺陷:</text>
					<text>{{ task.shCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">尖角线缺陷:</text>
					<text>{{ task.spCount }}</text>
				</view>
				<view class="task-info">
					<text class="label">多余铜缺陷:</text>
					<text>{{ task.spcCount }}</text>
				</view>
			</view>
		</view>

		<view v-if="task.finishTime === null">
			<view class="upload-picture-block">
				<view class="upload-picture-title-block">
					<view class="ver-line"></view>
					<text class="upload-picture-title">上传修复后PCB</text>
				</view>
				<view class="upload-picture">
					<view v-if="uploadImageSrc === ''">
						<uv-image src="/static/icon/camera-placeholder.png" width="120px" height="120px"
							@tap="chooseImage"></uv-image>
					</view>
					<view v-else>
						<image :src="uploadImageSrc" mode="aspectFit" @tap="previewImage"></image>
					</view>
				</view>

				<view v-if="isUploaded === false">
					<view class="upload-button">
						<view v-if="uploadImageSrc !== ''">
							<uv-button type="primary" text="重新选择图片" @tap="chooseImage"
								style="margin-bottom: 15px;"></uv-button>
						</view>
						<uv-button type="primary" :plain="true" text="上传" :disabled="uploadImageSrc === ''" @tap="uploadPicture"></uv-button>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import {
		onLoad,
		onShow
	} from '@dcloudio/uni-app'

	const taskId = ref(null)
	const task = ref({})
	const imageSrc = ref('')
	const isUploaded = ref(false)

	const uploadImageSrc = ref('')
	const sourceTypeIndex = ref(2)
	const sourceType = ['拍照', '相册', '拍照或相册']
	const sizeTypeIndex = ref(2)
	const sizeType = ['压缩', '原图', '压缩或原图']
	const countIndex = ref(8)
	const count = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const temoFilePath = ref('')

	const downloadImage = () => {
		uni.showLoading({
			title: '加载中'
		})

		uni.downloadFile({
			url: `http://10.0.2.2:8000/task/getTaskPicture/?id=${taskId.value}`,
			success: (res) => {
				imageSrc.value = res.tempFilePath
				uni.hideLoading()
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			fail: (err) => {
				console.log("download fail for err ", err)
			}
		})
	}

	const previewPicture = () => {
		uni.previewImage({
			urls: [imageSrc.value]
		})
	}

	const getTaskDetail = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/task/getTaskDetail/',
			method: 'GET',
			data: {
				'id': taskId.value
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				task.value = res.data
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

	const chooseImage = async function() {
		// #ifdef APP-PLUS
		// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
		if (sourceTypeIndex.value !== 2) {
			let status = await checkPermission();
			if (status !== 1) {
				return;
			}
		}
		// #endif

		if (uploadImageSrc.value !== '') {
			let isContinue = await isFullImg();
			if (!isContinue) {
				return;
			}
		}
		uni.chooseImage({
			sourceType: sourceType[sourceTypeIndex.value],
			sizeType: sizeType[sizeTypeIndex.value],
			count: 1,
			success: (res) => {
				uploadImageSrc.value = res.tempFilePaths[0]
				temoFilePath.value = res.tempFilePaths[0]
			},
			fail: (err) => {
				// #ifdef APP-PLUS
				if (err['code'] && err.code !== 0 && sourceTypeIndex.value === 2) {
					checkPermission(err.code);
				}
				// #endif
				// #ifdef MP
				if (err.errMsg.indexOf('cancel') !== '-1') {
					return;
				}
				uni.getSetting({
					success: (res) => {
						let authStatus = false;
						switch (sourceTypeIndex.value) {
							case 0:
								authStatus = res.authSetting['scope.camera'];
								break;
							case 1:
								authStatus = res.authSetting['scope.album'];
								break;
							case 2:
								authStatus = res.authSetting['scope.album'] && res
									.authSetting['scope.camera'];
								break;
							default:
								break;
						}
						if (!authStatus) {
							uni.showModal({
								title: '授权失败',
								content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
								success: (res) => {
									if (res.confirm) {
										uni.openSetting()
									}
								}
							})
						}
					}
				})
				// #endif
			}
		})
	}

	const isFullImg = () => {
		return new Promise((res) => {
			uni.showModal({
				content: "已经上传图片了，是否重新上传",
				success: (e) => {
					if (e.confirm) {
						uploadImageSrc.value = ''
						res(true)
					} else {
						res(false)
					}
				},
				fail: () => {
					res(false)
				}
			})
		})
	}

	const previewImage = (e) => {
		var current = e.target.dataset.src
		uni.previewImage({
			current: current,
			urls: [uploadImageSrc.value]
		})
	}

	const checkPermisson = async (code) => {
		let type = code ? code - 1 : sourceTypeIndex.value;
		let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
			await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
				'android.permission.READ_EXTERNAL_STORAGE');

		if (status === null || status === 1) {
			status = 1;
		} else {
			uni.showModal({
				content: "没有开启权限",
				confirmText: "设置",
				success: function(res) {
					if (res.confirm) {
						permision.gotoAppSetting();
					}
				}
			})
		}

		return status;
	}

	const uploadPicture = () => {
		uni.uploadFile({
			url: 'http://10.0.2.2:8000/task/uploadTaskPicture/',
			filePath: temoFilePath.value,
			name: 'file',
			formData: {
				'taskId': taskId.value
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				isUploaded.value = true
				uni.showToast({
					title: '上传成功',
					icon: 'success',
					duration: 1000
				})
			}
		})
	}

	onLoad((options) => {
		taskId.value = options.id

		downloadImage()
		getTaskDetail()
	})

	onShow(() => {
		getTaskDetail()
	})
</script>

<style>
	.uv-page {
		padding: 15px 0px;
		background-color: #f1f3f2;
	}

	.pcb-picture-block {
		background-color: #fff;
		width: 95%;
		margin: 0px auto;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.pcb-picture-title-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
		margin-top: 10px;
	}

	.ver-line {
		height: 20px;
		width: 4px;
		border-radius: 10px;
		background-color: #0081CF;
	}

	.pcb-picture-title {
		margin-left: 10px;
		font-size: 20px;
		font-weight: bold;
	}

	.pcb-picture-image {
		margin: 0px auto;
	}

	.task-detail-block {
		width: 95%;
		background-color: #fff;
		margin: 0 auto;
		margin-top: 15px;
		border-radius: 0.5rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.task-detail-title-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-left: 15px;
		margin-bottom: 10px;
		padding: 10px 0px;
	}

	.task-detail-title {
		margin-left: 10px;
		font-size: 20px;
		font-weight: bold;
	}

	.task-detail-info-list {
		width: 90%;
		margin: 0px auto;
	}

	.task-info {
		display: flex;
		align-items: center;
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

	.upload-picture-block {
		background-color: #fff;
		border-radius: 0.5rem;
		width: 95%;
		margin: 0px auto;
		margin-top: 15px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.upload-picture-title-block {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 0px 15px;
		padding: 10px 0px;
	}

	.upload-picture-title {
		font-size: 20px;
		margin-left: 10px;
		font-weight: bold;
	}

	.upload-picture {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.upload-button {
		width: 90%;
		margin: 15px auto;
	}
</style>