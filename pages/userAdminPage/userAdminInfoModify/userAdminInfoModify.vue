<template>
	<view class="backgroud">
		<view class="title-block">
			<text>
				修改信息
			</text>
			<view class="ver-line"></view>
		</view>
		<view class="form-block">
			<uv-form labelPosition="left" labelWidth="80" :model="form" :rules="rules" ref="formRef"
				label-align="right">
				<uv-form-item label="姓名:" prop="fullName" :borderBottom="false">
					<view class="input-content">
						<uv-input v-model="form.fullName" placeholder="1~10位字符串,不允许包含特殊字符" customStyle="customStyle" />
					</view>
				</uv-form-item>
				<uv-form-item label="邮箱:" prop="email" :borderBottom="false">
					<view class="input-content">
						<uv-input v-model="form.email" placeholder="请输入新的邮箱"></uv-input>
					</view>
				</uv-form-item>
				<uv-form-item label="新密码:" prop="password" :borderBottom="false">
					<view class="input-content">
						<uv-input v-model="form.password" placeholder="6~12位数字或字母,不允许包含特殊符号" password
							clearable></uv-input>
					</view>
				</uv-form-item>
				<uv-form-item label="确认密码:" prop="confirmPassword" :borderBottom="false">
					<view class="input-content">
						<uv-input v-model="form.confirmPassword" placeholder="请确认新的密码" password clearable></uv-input>
					</view>
				</uv-form-item>
			</uv-form>
		</view>
		
		<view class="buttom-group">
			<view>
				<uv-button type="primary" shape="circle" text="修改信息" style="margin-bottom: 15px;" @tap="modifyUserInfo" />
			</view>
			<view>
				<uv-button type="error" :plain="true" shape="circle" text="注销账号" @tap="openLogout" />
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
	<uv-toast ref="toastRef"></uv-toast>
</template>

<script setup>
	import {
		ref
	} from 'vue';
	import {
		toast
	} from '@/uni_modules/uv-ui-tools/libs/function/index.js';
	import {
		onReady,
		onLoad
	} from '@dcloudio/uni-app'

	const formRef = ref(null)
	const popupRef = ref(null)
	const toastRef = ref(null)
	const userUUID = ref(null)

	const form = ref({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const rules = ref({
		fullName: [{
				require: true,
				message: '请填写姓名',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[\u4e00-\u9fa5a-zA-Z0-9]{1,10}$/,
				message: '姓名格式不正确',
				trigger: ['blur', 'change']
			}
		],
		email: [{
				required: true,
				message: '请填写邮箱',
				trigger: ['blur', 'change']
			},
			{
				type: 'email',
				message: '邮箱格式不正确',
				trigger: ['blur', 'change']
			}
		],
		password: [{
				required: true,
				message: '请填写密码',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[a-zA-Z0-9]{6,12}$/,
				message: '密码格式不正确',
				trigger: ['blur', 'change']
			}
		],
		confirmPassword: [{
				required: true,
				message: '请确认您的密码',
				trigger: ['blur', 'change']
			},
			{
				validator: (rule, value, callback) => {
					if (value !== this.form.password) {
						callback(new Error('两次密码输入不一致'));
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
				url: '',
				method: 'POST',
				data: {
					'password': form.value.password,
					'fullName': form.value.fullName,
					'email': form.value.email
				},
				success: (res) => {
					if (res.statusCode === 200) {
						let data = res.data
						const token = data['token']

						uni.showToast({
							title: '注册成功',
							icon: 'success',
							duration: 1000
						})
					} else {
						uni.showToast({
							title: res.data['errorInfo'],
							icon: 'error',
							duration: 1000
						})
					}
				}
			})
		}).catch(errors => {
			toast('修改信息有误');
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
			url: 'http://10.0.2.2:8000/userAdmin/logoutUUID/',
			method:'POST',
			data:{
				'UUID': userUUID.value
			},
			success: (res) => {
				if(res.statusCode === 200){
					uni.showToast({
						title: '注销成功',
						icon: 'success',
						duration: 1000
					})
					goUserAdmin()
				}else{
					uni.showToast({
						title: res.data.errorInfo,
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
	}
	
	const modifyUserInfo = () => {
		uni.request({
			url: 'http://10.0.2.2:8000/userAdmin/modifyInfoUUID/',
			method: 'POST',
			data:{
				'UUID': userUUID.value,
				'fullName': form.value.fullName,
				'email': form.value.email,
				'password': form.value.password
			},
			success: (res) => {
				uni.showToast({
					title: '修改成功',
					icon: 'success',
					duration: 1000
				})
				goUserAdmin()
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
	
	const goUserAdmin = () => {
		uni.reLaunch({
			url: '/pages/userAdminPage/userAdmin/userAdmin'
		})
	}
	
	const showTip = () => {
		toastRef.value.show({
			type: 'default',
			message: '修改密码为可选项',
			duration: 1500,
			position: 'top'
		})
	}

	onReady(() => {
		formRef.value.setRules(rules.value);
		showTip()
	})
	
	onLoad((options) => {
		userUUID.value = options.UUID
		
		uni.request({
			url: 'http:10.0.2.2:8000/userAdmin/getUserInfoUUID/',
			method:'GET',
			data:{
				'UUID': userUUID.value
			},
			success: (res) => {
				if(res.data.errorInfo === undefined){
					form.value.fullName = res.data.fullName
					form.value.email = res.data.email
				}else{
					uni.showToast({
						title: res.data.errorInfo,
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
	})
</script>

<style>
	.backgroud {
		background-color: #f1f3f2;
		min-height: 100%;
		padding: 10px 0px;
	}

	.form-block {
		background-color: #fff;
		width: 95%;
		margin: 0px auto;
		border-radius: 0.5rem;
		padding: 10px 0px;
	}

	.input-content {
		width: 90%;
		margin-left: 15px;
	}
	
	.title-block {
		margin: 15px 16px;
		margin-top: 0px;
	}
	
	.ver-line {
		height: 4px;
		width: 72px;
		border-radius: 10px;
		background-color: #0081CF;
		margin-top: 2px;
	}
	
	.buttom-group {
		margin: 20px auto;
		width: 95%;
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