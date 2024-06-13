<template>
	<view class="uv-page" style="background-color: #fff;">
		<view class="uv-demo-block">
			<view class="uv-demo-block__content">
				<uv-form labelPosition="left" :model="loginModel" :rules="rules" ref="form" labelWidth="80">
					<uv-form-item label="账号" prop="userInfo.name" borderBottom>
						<uv-input v-model="loginModel.userInfo.name" placeholder="请输入账号" border="None">
						</uv-input>
					</uv-form-item>
					<uv-form-item label="密码" prop="userInfo.passward" borderBottom>
						<uv-input v-model="loginModel.userInfo.passward" placeholder="请输入密码" border="None" password
							clearable></uv-input>
					</uv-form-item>

					<uv-button type="primary" text="登录" customStyle="margin-top: 50px" @click="submit()"></uv-button>
				</uv-form>
				<uv-button type="primary" text="注册" :plain="true" @click="goRegister()"
					customStyle="margin-top: 10px"></uv-button>
			</view>
		</view>
	</view>
</template>
<script setup>
	import {
		ErrorCodes,
		ref
	} from 'vue';
	import {
		useUserInfoStore
	} from '@/stores/userInfoStore'
	import { useTabBarNavigateStore } from '@/stores/tabBarNavigateStore.js'

	const tabBarNavigateStore = useTabBarNavigateStore()

	const loginModel = ref({
		userInfo: {
			name: '',
			passward: ''
		},
	})

	const rules = ref({
		'userInfo.name': [{
				required: true,
				message: '账号不能为空',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{6,12}$/,
				message: '6~12位字符且不包含特殊字符',
				trigger: ['blur', 'change'],
			}
		],
		'userInfo.passward': [{
				type: 'string',
				required: true,
				message: '密码不能为空',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[a-zA-Z0-9]{6,12}$/,
				message: '密码格式不正确',
				trigger: ['blur', 'change'],
			}
		],
	})

	const radio = ref('')
	const switchVal = ref(false)
	const userInfoStore = useUserInfoStore()
	const form = ref(null)

	const submit = () => {
		// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
		form.value.validate().then(res => {
			uni.request({
				url: 'http://10.0.2.2:8000/login/',
				method: 'POST',
				data: {
					'userName': loginModel.value.userInfo.name,
					'password': loginModel.value.userInfo.passward
				},
				success: (res) => {
					if (res.data['errorInfo'] === undefined) {
						let data = res.data
						const token = data['token']
						uni.setStorageSync('token', token)

						userInfoStore.username = data['username']
						userInfoStore.fullName = data['fullName']
						userInfoStore.email = data['email']
						userInfoStore.role = data['role']
						userInfoStore.empNo = data['empno']

						uni.showToast({
							title: '登录成功',
							icon: 'success',
							duration: 1000
						})

						if(data['role'] === 'worker'){
							goWorkerHome()
						}else{
							goHome()
						}
					} else {
						uni.showToast({
							title: res.data['errorInfo'],
							icon: "error",
							duration: 1000
						})
					}
				},
				fail: (err) => {
					uni.showToast({
						title: "请求失败",
						icon: "error",
						duration: 1000
					})
				}
			})
		}).catch(errors => {
			uni.showToast({
				icon: 'error',
				title: '登录信息有误'
			})
		})
	}

	const goRegister = () => {
		uni.navigateTo({
			url: '/pages/loginPage/register/register'
		})
	}

	const hideKeyboard = () => {
		uni.hideKeyboard()
	}

	const goHome = () => {
		tabBarNavigateStore.tabBarValue = 0
		uni.reLaunch({
			url: '/pages/dataShow/dataDisplay/dataDisplay'
		})
	}

	const goWorkerHome = () => {
		tabBarNavigateStore.tabBarValue = 0
		uni.reLaunch({
			url: '/pages/workerTask/workerTaskControl/workerTaskControl'
		})
	}
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
</style>
