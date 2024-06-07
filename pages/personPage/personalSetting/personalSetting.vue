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
						label="昵称"
						prop="nickname"
						borderBottom
					>
						<uv-input
							v-model="form.nickname"
							border="none"
							placeholder="请输入您的昵称"
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
						label="账号"
						prop="account"
						borderBottom
					>
						<uv-input
							v-model="form.account"
							border="none"
							disabled
						></uv-input>
					</uv-form-item>
				</uv-form>
				<uv-button
					type="primary"
					text="修改资料"
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
				nickname: '原始昵称',
				email: 'example@example.com',
				account: '12345678'  // 8位数字账号
			},
			rules: {
				nickname: [
					{ required: true, message: '请填写昵称', trigger: ['blur', 'change'] },
					{ pattern: /^[a-zA-Z0-9]{6,12}$/, message: '昵称格式不正确', trigger: ['blur', 'change'] }
				],
				email: [
					{ required: true, message: '请填写邮箱', trigger: ['blur', 'change'] },
					{ type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] }
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
					toast('资料修改成功');
					// 成功提交后跳转回personPage页面
					uni.navigateBack({
						url: '/pages/personPage/personPage/personPage'
					});
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
