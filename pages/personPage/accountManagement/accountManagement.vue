<template>
	<view class="uv-page" style="background-color: #fff;">
		<view class="uv-demo-block">
			<view class="uv-demo-block__content">
				<uv-form
					labelPosition="left"
					labelWidth="80"
					:model="form"
					:rules="rules"
					ref="form"
				>
					<uv-form-item
						label="原密码"
						prop="currentPassword"
						borderBottom
					>
						<uv-input
							v-model="form.currentPassword"
							border="none"
							placeholder="请输入原密码"
							password
							clearable
						></uv-input>
					</uv-form-item>
					<uv-form-item
						label="新密码"
						prop="newPassword"
						borderBottom
					>
						<uv-input
							v-model="form.newPassword"
							border="none"
							placeholder="请输入新密码"
							password
							clearable
						></uv-input>
					</uv-form-item>
					<uv-form-item
						label="确认新密码"
						prop="confirmNewPassword"
						borderBottom
					>
						<uv-input
							v-model="form.confirmNewPassword"
							border="none"
							placeholder="请确认新密码"
							password
							clearable
						></uv-input>
					</uv-form-item>
				</uv-form>
				<uv-button
					type="primary"
					text="确认修改"
					customStyle="margin-top: 50px"
					@click="submitForm"
				></uv-button>
				<uv-button
					type="default"
					text="注销账号"
					customStyle="margin-top: 20px"
					@click="logout"
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
				currentPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			},
			rules: {
				currentPassword: [
					{ required: true, message: '请输入原密码', trigger: ['blur', 'change'] },
				],
				newPassword: [
					{ required: true, message: '请输入新密码', trigger: ['blur', 'change'] },
					{ pattern: /^[a-zA-Z0-9]{6,12}$/, message: '新密码格式不正确', trigger: ['blur', 'change'] }
				],
				confirmNewPassword: [
					{ required: true, message: '请确认新密码', trigger: ['blur', 'change'] },
					{ validator: (rule, value, callback) => {
						if (value !== this.form.newPassword) {
							callback(new Error('两次新密码输入不一致'));
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
				// 假设默认原始密码是“123456”
				if (this.form.currentPassword === '123456') {
					uni.showLoading({
						title: '正在提交'
					});
					setTimeout(() => {
						uni.hideLoading();
						toast('密码修改成功');
						// 重置表单
						this.resetForm();
					}, 2000);
				} else {
					toast('原密码错误');
				}
			}).catch(errors => {
				toast('请填写完整信息');
			});
		},
		resetForm() {
			this.$refs.form.resetFields();
		},
		logout() {
			uni.navigateTo({
				url: '/pages/index/index'
			});
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
