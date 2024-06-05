<template>
	<view class="uv-page" style="background-color: #fff;">
		<view class="uv-demo-block">
			<text class="uv-demo-block__title">注册表单</text>
			<view class="uv-demo-block__content">
				<uv-form
					labelPosition="left"
					labelWidth="80"
					:model="form"
					:rules="rules"
					ref="form"
				>
					<uv-form-item
						label="用户名"
						prop="username"
						borderBottom
					>
						<uv-input
							v-model="form.username"
							border="none"
							placeholder="6~12位数字或字母,不允许包含特殊符号"
						></uv-input>
					</uv-form-item>
					<uv-form-item
						label="邮箱"
						prop="email"
						borderBottom
					>
						<uv-input
							v-model="form.email"
							border="none"
							placeholder="请输入您的邮箱"
						></uv-input>
					</uv-form-item>
					<uv-form-item
						label="密码"
						prop="password"
						borderBottom
					>
						<uv-input
							v-model="form.password"
							border="none"
							placeholder="6~12位数字或字母,不允许包含特殊符号"
							password
							clearable
						></uv-input>
					</uv-form-item>
					<uv-form-item
						label="确认密码"
						prop="confirmPassword"
						borderBottom
					>
						<uv-input
							v-model="form.confirmPassword"
							border="none"
							placeholder="请确认您的密码"
							password
							clearable
						></uv-input>
					</uv-form-item>
				</uv-form>
				<uv-button
					type="primary"
					text="注册"
					customStyle="margin-top: 50px"
					@click="submitForm"
				></uv-button>

			</view>
		</view>
	</view>
</template>

<script>
import { toast } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

export default {
	data() {
		return {
			form: {
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			},
			rules: {
				username: [
					{ required: true, message: '请填写用户名', trigger: ['blur', 'change'] },
					{ pattern: /^[a-zA-Z0-9]{6,12}$/, message: '用户名格式不正确', trigger: ['blur', 'change'] }
				],
				email: [
					{ required: true, message: '请填写邮箱', trigger: ['blur', 'change'] },
					{ type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
				],
				password: [
					{ required: true, message: '请填写密码', trigger: ['blur', 'change'] },
					{ pattern: /^[a-zA-Z0-9]{6,12}$/, message: '密码格式不正确', trigger: ['blur', 'change'] }
				],
				confirmPassword: [
					{ required: true, message: '请确认您的密码', trigger: ['blur', 'change'] },
					{ validator: (rule, value, callback) => {
						if (value !== this.form.password) {
							callback(new Error('两次密码输入不一致'));
						} else {
							callback();
						}
					}, trigger: ['blur', 'change'] }
				]
			}
		};
	},
	methods: {
		submitForm() {
			this.$refs.form.validate().then(() => {
				// 模拟提交表单
				uni.showLoading({
					title: '正在提交'
				});
				setTimeout(() => {
					uni.hideLoading();
					toast('注册成功');
				}, 2000);
			}).catch(errors => {
				toast('请填写完整信息');
			});
		},
		resetForm() {
			this.$refs.form.resetFields();
		}
	},
	onReady() {
		this.$refs.form.setRules(this.rules);
	}
};
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
