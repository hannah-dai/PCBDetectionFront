<template>
	<view>
		<text>Camara</text>
	</view>
	<view class="uni-common-mt">
		<form>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title">点击可预览选好的图片</view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file">
										<image class="uni-uploader__img" :src="image" :data-src="image"
											@tap="previewImage">
										</image>
									</view>
								</block>
								<view class="uni-uploader__input-box">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<button @tap="uploadPicture">Upload</button>
		</form>
	</view>
	<bottomBar/>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import permission from '@/common/permission.js'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'

	const imageList = ref([])
	const sourceTypeIndex = ref(2)
	const sourceType = ['拍照', '相册', '拍照或相册']
	const sizeTypeIndex = ref(2)
	const sizeType = ['压缩', '原图', '压缩或原图']
	const countIndex = ref(8)
	const count = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	const temoFilePath = ref('')

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

		if (imageList.value.length === 9) {
			let isContinue = await isFullImg();
			console.log("是否继续?", isContinue);
			if (!isContinue) {
				return;
			}
		}
		uni.chooseImage({
			sourceType: sourceType[sourceTypeIndex.value],
			sizeType: sizeType[sizeTypeIndex.value],
			count: imageList.value.length + count[countIndex.value] > 9 ? 9 - imageList.value.length :
				count[countIndex.value],
			success: (res) => {
				imageList.value = imageList.value.concat(res.tempFilePaths);
				temoFilePath.value = res.tempFilePaths[0]
				console.log(temoFilePath.value)
			},
			fail: (err) => {
				console.log("err: ", err);
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
				content: "已经有9张图片了,是否清空现有图片？",
				success: (e) => {
					if (e.confirm) {
						imageList.value = [];
						res(true);
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
			urls: imageList.value
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
			url: 'http://10.0.2.2:8000/testPicture/',
			filePath: temoFilePath.value,
			name: 'file',
			success: (res) => {
				console.log(res.data)
			}
		})
	}
</script>

<style>
	.cell-pd {
		padding: 22rpx 30rpx;
	}

	.list-pd {
		margin-top: 50rpx;
	}
</style>