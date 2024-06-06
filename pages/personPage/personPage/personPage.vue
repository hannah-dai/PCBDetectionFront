<template>
	<view class="uv-page">
		<view class="uv-demo-block">
			<view class="uv-demo-block__content">
				<uv-avatar :src="src1" size="80"></uv-avatar>
				<view class="uv-text-content">
					<text class="nickname">昵称: {{ nickname }}</text>
					<text class="account">账号: {{ account }}</text>
				</view>
			</view>
		</view>
		<view class="list-wrap">
			<uv-cell-group title-bg-color="rgb(243, 244, 246)">
				<uv-cell :titleStyle="{fontWeight: 500}"
					title="个人信息"
					isLink
					@click="goToPage('personalSetting')">
					<template v-slot:icon>
						<uv-icon name="file-text-fill" size="30" color="#909399"></uv-icon>
					</template>
				</uv-cell>
				<uv-cell :titleStyle="{fontWeight: 500}"
					title="账号与安全"
					isLink
					@click="goToPage('accountManagement')">
					<template v-slot:icon>
						<uv-icon name="setting" size="30" color="#909399"></uv-icon>
					</template>
				</uv-cell>
			</uv-cell-group>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src1: 'https://cdn.uviewui.com/uview/album/1.jpg',
				nickname: '用户昵称',
				account: '1234567890',
			}
		},
		methods: {
			goToPage(page) {
				uni.navigateTo({
					url: `/pages/personPage/${page}/${page}`
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.uv-page {
		padding: 15px;
	}

	.uv-demo-block {
		text-align: center;
		width: 100%;
		display: flex;
		align-items: center;
	}

	.uv-demo-block__content {
		display: flex;
		align-items: center;
	}

	.uv-avatar {
		margin-right: 20px;
	}

	.uv-text-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.nickname {
		font-size: 18px;
		color: #333;
		margin-bottom: 5px;
	}

	.account {
		font-size: 14px;
		color: #666;
	}

	.list-wrap {
		margin-top: 20px;
	}

	.uv-cell-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}
</style>
