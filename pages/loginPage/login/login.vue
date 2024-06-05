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
						<uv-input v-model="loginModel.userInfo.passward" placeholder="请输入密码" border="None" password clearable></uv-input>
					</uv-form-item>

					<uv-button type="primary" text="登录" customStyle="margin-top: 50px" @click="submit"></uv-button>
				</uv-form>
				<uv-button type="primary" text="注册" plain="True" @click="goRegister()"
					customStyle="margin-top: 10px"></uv-button>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				loginModel: {
					userInfo: {
						name: '',
						passward: ''
					},
				},
				rules: {
					'userInfo.name': [{
							required: true,
							message: '账号不能为空',
							trigger: ['blur', 'change']
						},
						{
							validator(rule, value, callback) {
								const reg = /^[1-9][0-9]{7}$/;
								if (!reg.test(value)) {
									callback(new Error('账号必须是八位数字且首位不为0'));
								} else {
									callback();
								}
							},
							trigger: ['blur', 'change']
						}
					],
					'userInfo.passward': {
						type: 'string',
						required: true,
						message: '密码不能为空',
						trigger: ['blur', 'change']
					},
				},
				radio: '',
				switchVal: false
			}
		},
		methods: {
			// 提交
			submit() {
				// 如果有错误，会在catch中返回报错信息数组，校验通过则在then中返回true
				this.$refs.form.validate().then(res => {
					uni.showToast({
						icon: 'success',
						title: '校验通过'
					})
				}).catch(errors => {
					uni.showToast({
						icon: 'error',
						title: '请填写完整信息'
					})
				})
			},
			goRegister() {
				uni.navigateTo({
					url: '/pages/loginPage/register/register'
				})
			},
			hideKeyboard() {
				uni.hideKeyboard()
			}
		},
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