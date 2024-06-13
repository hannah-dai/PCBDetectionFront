<template>
	<view class="uv-page">
		<view class="uv-demo-block">
			<view class="uv-demo-block__content">
				<uv-avatar :src="src" size="80"></uv-avatar>
				<view class="uv-text-content">
					<text class="nickname">{{ nickname }}</text>
					<text class="account">用户名: {{ account }}</text>
				</view>
			</view>
		</view>
		<view class="personInfoBlock">
			<view class="personInfoList">
				<view class="personInfoListItem">
					<text>姓名：</text>
					<text>{{ nickname }}</text>
				</view>
				<view class="personInfoListItem">
					<text>工号：</text>
					<text>{{ empNo }}</text>
				</view>
				<view class="personInfoListItem">
					<text>身份：</text>
					<text>{{ role }}</text>
				</view>
				<view class="personInfoListItem">
					<text>用户名：</text>
					<text>{{ account }}</text>
				</view>
				<view class="personInfoListItem">
					<text>邮箱：</text>
					<text>{{ email }}</text>
				</view>
			</view>
		</view>
		<view class="list-wrap">
			<uv-cell-group title-bg-color="rgb(243, 244, 246)" :border="false">
				<uv-cell :titleStyle="{fontWeight: 500}" title="修改个人信息" isLink @click="goToPage('personalSetting')">
					<template v-slot:icon>
						<uv-icon name="file-text-fill" size="30" color="#909399"></uv-icon>
					</template>
				</uv-cell>
				<uv-cell :titleStyle="{fontWeight: 500}" title="账号与安全" isLink @click="goToPage('accountManagement')" :border="false">
					<template v-slot:icon>
						<uv-icon name="/static/icon/security.png" size="30" color="#909399"></uv-icon>
					</template>
				</uv-cell>
			</uv-cell-group>
		</view>
		<view>
			<uv-button text="退出登录" shape="circle" type="error" class="button-style" @tap="logout()"></uv-button>
		</view>
	</view>
	<bottomBar />
</template>

<script setup>
	import {
		computed,
		ref
	} from 'vue'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	import {
		useUserInfoStore
	} from '@/stores/userInfoStore'
	import { useTabBarNavigateStore } from '@/stores/tabBarNavigateStore'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	const userInfoStore = useUserInfoStore()
	const tabBarNavigateStore = useTabBarNavigateStore()
	const src = ref('')
	const nickname = ref('')
	const account = ref('')
	const email = ref('')
	const role = ref('')
	const empNo = ref('')

	const buttonStyle = computed(() => {
		return {

		}
	})

	const goToPage = (page) => {
		uni.navigateTo({
			url:`/pages/personPage/${page}/${page}`
		})
	}

	const logout = () => {
		uni.setStorageSync('token', '')
		tabBarNavigateStore.tabBarValue = 0
		uni.reLaunch({
			url:'/pages/loginPage/login/login'
		})
	}

	onLoad(() => {
		if (userInfoStore.role === 'admin') {
			src.value = '/static/icon/admin.png'
		} else {
			src.value = '/static/icon/worker.png'
		}

		nickname.value = userInfoStore.fullName
		account.value = userInfoStore.username
		email.value = userInfoStore.email
		role.value = userInfoStore.role
		empNo.value = userInfoStore.empNo
	})
</script>

<style scoped lang="scss">
	.uv-page {
		background-color: #f1f3f2;
		min-height: 100%;
		padding-top: 18px;
	}

	.uv-demo-block {
		width: 95%;
		height: 100px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: auto;
		margin-right: auto;
		padding-top: 25px;
		padding-bottom: 25px;
		background-color: #fff;
		border-radius: 0.5rem;
	}

	.uv-demo-block__content {
		display: flex;
		align-items: center;
	}

	.uv-avatar {
		margin-left: 20px;
		margin-right: 30px;
	}

	.uv-text-content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;
	}

	.nickname {
		font-size: 24px;
		color: #333;
		margin-bottom: 6px;
	}

	.account {
		font-size: 16px;
		color: #666;
	}

	.list-wrap {
		margin-top: 18px;
		padding-top: 5px;
		padding-bottom: 5px;
		margin-left: auto;
		margin-right: auto;
		width: 95%;
		background-color: #fff;
		border-radius: 0.5rem;
	}

	.uv-cell-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
	}

	.personInfoBlock {
		margin-top: 18px;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-left: auto;
		margin-right: auto;
		width: 95%;
		background-color: #fff;
		border-radius: 0.5rem;
	}

	.personInfoList {
		margin-left: 10px;
	}

	.personInfoListItem {
		padding-top: 5px;
		padding-bottom: 5px;
		padding-right: 15px;
		padding-left: 15px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.button-style {
		margin-top: 24px;
		width: 95%;
		margin-left: auto;
		margin-right: auto;
	}
</style>
