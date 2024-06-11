<template>
	<view class="uv-page" style="background-color: #fff;">
		<view class="uv-demo-block">
			<view class="uv-demo-block__content">
				<uv-form labelPosition="left" labelWidth="80" :model="form" :rules="rules" ref="formRef">
					<uv-form-item label="原密码" prop="currentPassword" borderBottom>
						<uv-input v-model="form.currentPassword" border="none" placeholder="请输入原密码" password
							clearable></uv-input>
					</uv-form-item>
					<uv-form-item label="新密码" prop="newPassword" borderBottom>
						<uv-input v-model="form.newPassword" border="none" placeholder="请输入新密码" password
							clearable></uv-input>
					</uv-form-item>
					<uv-form-item label="确认新密码" prop="confirmNewPassword" borderBottom>
						<uv-input v-model="form.confirmNewPassword" border="none" placeholder="请确认新密码" password
							clearable></uv-input>
					</uv-form-item>
				</uv-form>
				<uv-button type="primary" text="确认修改" customStyle="margin-top: 50px" @click="submitForm"></uv-button>
				<uv-button type="primary" text="注销账号" customStyle="margin-top: 20px" :plain="true"
					@click="openLogout"></uv-button>
			</view>
		</view>
	</view>
	<view>
		<uv-popup ref='popupRef' mode="center" :round="5">
			<view class="popup-body">
				<view class="popup-text-block">
					<text class="popup-text">
						确定要注销账号？
					</text>
				</view>
				<view class="popup-buttom-group">
					<uv-button type="default" text="取消" shape="circle" color="rgb(148 163 184)" :plain="true" class="popup-bottom" @tap="cancelLogout" />
					<uv-button type="primary" text="确定" shape="circle" class="popup-bottom" @tap="logout" />
				</view>
			</view>
		</uv-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import {
		onReady
	} from '@dcloudio/uni-app'
	import {
		useUserInfoStore
	} from '@/stores/userInfoStore.js'

	const userInfoStore = useUserInfoStore()
	const formRef = ref(null)
	const popupRef = ref(null)

	const form = ref({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: ''
	})
	const rules = ref({
		currentPassword: [{
			required: true,
			message: '请输入原密码',
			trigger: ['blur', 'change']
		}, ],
		newPassword: [{
				required: true,
				message: '请输入新密码',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[a-zA-Z0-9]{6,12}$/,
				message: '新密码格式不正确',
				trigger: ['blur', 'change']
			}
		],
		confirmNewPassword: [{
				required: true,
				message: '请确认新密码',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					if (value !== form.value.newPassword) {
						callback(new Error('两次新密码输入不一致'));
					} else {
						callback();
					}
				},
				trigger: ['blur', 'change']
			}
		]
	})

	const submitForm = () => {
		formRef.value.validate().then(() => {
			uni.request({
				url: 'http://10.0.2.2:8000/userInfo/modifyUserPassword/',
				method: 'POST',
				data: {
					'username': userInfoStore.username,
					'originalPassword': form.value.currentPassword,
					'newPassword': form.value.newPassword
				},
				success: (res) => {
					let data = res.data
					if (data['errorInfo'] === undefined) {
						uni.setStorageSync('token', '')
						uni.showToast({
							title: '修改密码成功',
							icon: 'success',
							duration: 1000
						})
						goHomePage()
					} else {
						uni.showToast({
							title: data['errorInfo'],
							icon: 'error',
							duration: 1000
						})
					}
				},
				fail: (err) => {
					uni.showToast({
						title: '请求失败',
						icon: 'error',
						duration: 1000
					})
				}
			})
		}).catch(errors => {
			toast('请填写完整信息');
		});
	}

	const resetForm = () => {
		formRef.value.resetFields();
	}

	const openLogout = () => {
		popupRef.value.open()
	}

	const cancelLogout = () => {
		popupRef.value.close()
	}

	const logout = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/userInfo/logout/',
			method:'POST',
			data:{
				'username': userInfoStore.username
			},
			success: (res) => {
				let data = res.data
				if(data['errorInfo'] === undefined){
					uni.showToast({
						title:'注销成功',
						icon:'success',
						duration:1000
					}),
					goHomePage()
				}else{
					uni.showToast({
						title:data['errorInfo'],
						icon:'error',
						duration:1000
					})
				}
			},
			fail:(err) => {
				uni.showToast({
					title:'请求失败',
					icon:'error',
					duration:1000
				})
			}
		})
	}

	const goHomePage = () => {
		uni.reLaunch({
			url: '/pages/loginPage/login/login'
		})
	}

	onReady(() => {
		formRef.value.setRules(rules.value);
	})
</script>

<style lang="scss">
	.uv-page {
		padding: 20px;
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
		padding: 10px;
		border-radius: 5px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.popup-style {
		border-radius: 0.5rem;
	}

	.popup-body {
		width: 300px;
		height: 125px;
	}

	.popup-text-block {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.popup-text {
		font-size: 16px;
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.popup-buttom-group {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.popup-bottom {
		width: 100px;
	}
</style>
