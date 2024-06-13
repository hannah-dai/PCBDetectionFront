<template>
	<view class="uv-page">
		<!-- PCB缺陷拍摄图展示 -->
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">PCB缺陷拍摄图</text>
			<view class="uv-demo-block__content">
				<uv-album :urls="pcbDefectPhotos" :multipleSize="62" rowCount="4" maxCount="10"></uv-album>
			</view>
		</view>

		<!-- 任务详细信息展示 -->
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">任务详细信息</text>
			<view class="uv-demo-block__content">
				<view class="task-info">
					<text class="label">任务编号:</text>
					<text>{{ task.id }}</text>
				</view>
				<view class="task-info">
					<text class="label">流水线编号:</text>
					<text>{{ task.pipelineNumber }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成状态:</text>
					<text>{{ task.status }}</text>
				</view>
				<view class="task-info">
					<text class="label">出现时间:</text>
					<text>{{ task.appearanceTime }}</text>
				</view>
				<view class="task-info">
					<text class="label">完成时间:</text>
					<text>{{ task.status === '已完成' ? task.completionTime : '未完成' }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配时间:</text>
					<text>{{ task.assignment === '已分配' ? task.assignmentTime : '未分配' }}</text>
				</view>
				<view class="task-info">
					<text class="label">分配人员编号:</text>
					<text @click="task.assignment === '已分配' ? showPersonnelInfo(task.assignmentNumber) : null"
						:class="{'link-text': task.assignment === '已分配', 'unassigned': task.assignment !== '已分配'}">
						{{ task.assignment === '已分配' ? task.assignmentNumber : '未分配' }}
					</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷类别:</text>
					<text>{{ task.defectCategory }}</text>
				</view>
				<view class="task-info">
					<text class="label">缺陷数量:</text>
					<text>{{ task.defectCount }}</text>
				</view>
			</view>

			<!-- 上传修复好的pcb照片 -->
			<view class="uv-demo-block">
				<text class="uv-demo-block__title">上传修复好的PCB图片</text>
				<view class="uv-demo-block__content">
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
										<!-- 加了一个删除图片的按钮 -->
										<view @click.stop="delImg(i, imageList)" style="display: inline;">
											<uni-icons type="closeempty" class="closeClass" size="20"></uni-icons>
										</view>
									</view>
								</block>
								<!-- 可以选择图片来源type:相册或相机 -->
								<view class="uni-uploader__input-box" v-if="VideoOfImagesShow">
									<view class="uni-uploader__input" @tap="chooseImages"></view>
								</view>
							</view>
						</view>
						<!-- 保存图片按钮，保存后上传 -->
						<view class="task-actions">
							<uv-button @click="uploadPicture()" type="success">上传图片</uv-button>
							
						</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>
<script>
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import {
		ref
	} from 'vue';
	import permission from '@/common/permission.js'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'


	export default {
		data() {
			return {
				task: {
					id: 1,
					pipelineNumber: '123',
					status: '未完成',
					assignment: '未分配',
					appearanceTime: '2024-01-01 12:00',
					assignmentNumber: '无',
					assignmentTime: '无',
					completionTime: '无',
					defectCategory: '焊接缺陷',
					defectCount: 5
				},
				pcbDefectPhotos: [
					'https://via.placeholder.com/100x200.png/3c9cff/fff',
					'https://via.placeholder.com/200x200.png/3c9cff/fff',
					'https://via.placeholder.com/300x200.png/3c9cff/fff',
					'https://via.placeholder.com/280x200.png/3c9cff/fff',
					'https://via.placeholder.com/240x200.png/3c9cff/fff',
					'https://via.placeholder.com/180x200.png/3c9cff/fff',
					'https://via.placeholder.com/140x200.png/3c9cff/fff',
					'https://via.placeholder.com/150x200.png/3c9cff/fff',
					'https://via.placeholder.com/90x200.png/3c9cff/fff',
					'https://via.placeholder.com/220x200.png/3c9cff/fff'
				],

				selectedTaskIndex: null,

				// 上传图片
				imageList: [], //图片
				src: "", //视频存放
				sourceTypeIndex: 2,
				sourceType: ['拍摄', '相册', '拍摄或相册'],
				VideoOfImagesShow: true,
			};
		},
		methods: {
			showPersonnelInfo(assignmentNumber) {
				uni.showToast({
					title: `分配人员编号: ${assignmentNumber}`,
					icon: 'none'
				});
			},
			showPicker() {
				this.$refs.picker.open();
			},
			changePicker(e) {
				console.log('changePicker', e);
			},
			confirmPicker(e) {
				this.task.assignment = '已分配';
				this.task.assignmentNumber = e.value[0];
				this.task.assignmentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
			},
			cancelPicker() {
				this.selectedTaskIndex = null;
			},

			// 选择从相册或相机读取,展示一个Actionsheet
			chooseType() {
				uni.showActionSheet({

					itemList: ['从相册选择', '拍照'],
					success: (res) => {
						console.log(res)
						if (res.tapIndex == 0) {
							this.chooseImages()
						} else {
							this.chooseCamera()
						}
					}
				})
			},


			chooseImages() {
				uni.chooseImage({
					count: 9 - this.imageList.length, // 最多可以选择的图片张数
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
						this.temoFilePath = res.tempFilePaths[0]
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
			},

			delImg(i, imgList, imgsID) {
				uni.showModal({
					title: '提示',
					content: '确定要删除照片吗？',
					cancelText: '取消',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imageList.splice(i, 1);

							this.curTotal--;
						}
					}
				})
			},


			handleChooseImageError(err) {
				// #ifdef APP-PLUS
				if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
					this.checkPermission(err.code);
				}
				// #endif

				// #ifdef MP
				if (err.errMsg.indexOf('cancel') !== '-1') {
					return;
				}
				uni.getSetting({
					success: (res) => {
						let authStatus = this.getAuthStatus(res.authSetting);
						if (!authStatus) {
							this.promptForSetting();
						}
					}
				});
				// #endif
			},
			getAuthStatus(authSetting) {
				switch (this.sourceTypeIndex) {
					case 0:
						return authSetting['scope.camera'];
					case 1:
						return authSetting['scope.album'];
					case 2:
						return authSetting['scope.album'] && authSetting['scope.camera'];
					default:
						return false;
				}
			},
			promptForSetting() {
				uni.showModal({
					title: '授权失败',
					content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
					success: (res) => {
						if (res.confirm) {
							uni.openSetting();
						}
					}
				});
			},
			isFullImg() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false);
							}
						},
						fail: () => {
							res(false);
						}
					});
				});
			},
			previewImage(e) {
				var current = e.target.dataset.src;
				uni.previewImage({
					current: current,
					urls: this.imageList
				});
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(this.sourceType[type][0]) : await permision
					.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
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
					});
				}

				return status;
			},
			uploadPicture() {
				uni.uploadFile({
					url: 'http://10.0.2.2:8000/testPicture/',
					filePath: this.temoFilePath,
					name: 'file',
					success: (res) => {
						console.log(res.data);
					}
				});
			},

		}
	}
</script>
<style scoped lang="scss">
	.uv-page {
		padding: 15px;
	}

	.uv-demo-block {
		margin-bottom: 20px;
	}

	.uv-demo-block__title {
		font-weight: bold;
		margin-bottom: 10px;
	}

	.uv-demo-block__content {
		background: #fff;
		padding: 30px;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.album {
		width: 100%;
		display: flex;
		flex-wrap: wrap;

		&__avatar {
			margin-bottom: 10px;
		}
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
		margin-top: 10px;
		gap: 10px;
	}

	.delete-button {
		position: absolute;
		top: 5px;
		right: 5px;

	}
</style>