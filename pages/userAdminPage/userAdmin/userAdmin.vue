<template>
	<view class="backgroud">
		<uv-drop-down ref="dropDownRef" sign="dropDown_1" text-active-color="#3c9cff"
			:extra-icon="{name:'arrow-down-fill',color:'#666',size:'26rpx'}"
			:extra-active-icon="{name:'arrow-up-fill',color:'#3c9cff',size:'26rpx'}" :defaultValue="defaultValue"
			:custom-style="{padding: '0 110rpx'}" @click="selectMenu">
			<uv-drop-down-item name="userType" type="2" :label="dropItem('userType').label"
				:value="dropItem('userType').value">
			</uv-drop-down-item>
			<uv-drop-down-item name="userStatus" type="2" :label="dropItem('userStatus').label"
				:value="dropItem('userStatus').value">
			</uv-drop-down-item>
		</uv-drop-down>
		<uv-drop-down-popup sign="dropDown_1" :click-overlay-on-close="true" :currentDropItem="currentDropItem"
			@clickItem="clickItem"></uv-drop-down-popup>
		<view class="user-list">
			<view v-for="item in userList" v-bind:key="item.UUID">
				<view class="user-list-item">
					<view class="user-list-item-content">
						<view v-if="item.role === 'worker'">
							<uv-avatar :src="workerIconSrc" size="80"></uv-avatar>
						</view>
						<view v-else>
							<uv-avatar :src="adminIconSrc" size="80"></uv-avatar>
						</view>
						<view class="user-list-item-text-content">
							<view style="margin-bottom: 4px;">
								<text>姓名：</text>
								<text>{{ item.fullName }}</text>
							</view>
							<view>
								<text>身份：</text>
								<text>{{ item.role }}</text>
							</view>
						</view>
						<view v-if="item.isDelete">
							<uv-icon size="82" name="/static/icon/logouted.png"></uv-icon>
						</view>
						<view v-else-if="item.role === 'admin'">
							<uv-icon size="82" name="/static/icon/no-access.png"></uv-icon>
						</view>
						<view v-else>
							<uv-button type="primary" text="修改信息" :plain="true" class="user-list-button"
								@tap="goInfoModifyPage(item.UUID)" />
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view>
			<uni-fab :pattern="pattern" :content="content" :horizontal="horizontal" :vertical="vertical"
				:direction="direction" style="bottom: 100px;" @trigger="trigger"></uni-fab>
		</view>
		
		<view>
			<uv-popup ref='popupRef' mode="center" :round="5" :close-on-click-overlay="false">
				<view class="popup-body">
					<view class="popup-title-block">
						<view class="popup-title">
							<text>
								添加工人账号
							</text>
							<view class="ver-line"></view>
						</view>

					</view>

					<view class="form-block">
						<uv-form labelPosition="left" labelWidth="80" :model="form" :rules="rules" ref="formRef"
							label-align="right">
							<uv-form-item label="用户名:" prop="username" :borderBottom="false">
								<view class="input-content">
									<uv-input v-model="form.username" placeholder="6~12位数字或字母"></uv-input>
								</view>
							</uv-form-item>
							<uv-form-item label="姓名:" prop="fullName" :borderBottom="false">
								<view class="input-content">
									<uv-input v-model="form.fullName" placeholder="1~10位字符串" />
								</view>
							</uv-form-item>
							<uv-form-item label="邮箱:" prop="email" :borderBottom="false">
								<view class="input-content">
									<uv-input v-model="form.email" placeholder="请输入您的邮箱"></uv-input>
								</view>
							</uv-form-item>
							<uv-form-item label="密码:" prop="password" :borderBottom="false">
								<view class="input-content">
									<uv-input v-model="form.password" placeholder="6~12位数字或字母" password
										clearable></uv-input>
								</view>
							</uv-form-item>
							<uv-form-item label="确认密码:" prop="confirmPassword" :borderBottom="false">
								<view class="input-content">
									<uv-input v-model="form.confirmPassword" placeholder="请确认您的密码" password
										clearable></uv-input>
								</view>
							</uv-form-item>
						</uv-form>
					</view>

					<view class="popup-buttom-group">
						<view class="popup-bottom">
							<uv-button type="default" text="取消" shape="circle" color="rgb(148 163 184)"
								:plain="true" @tap="cancelAddWorker"></uv-button>
						</view>
						<view class="popup-bottom">
							<uv-button type="primary" text="确定" shape="circle" @tap="submitForm"></uv-button>
						</view>
					</view>
				</view>
			</uv-popup>
		</view>
		<bottomBar />
	</view>
</template>

<script setup>
	import {
		computed,
		ref,
		watch
	} from 'vue'
	import {
		onPageScroll,
		onLoad
	} from '@dcloudio/uni-app'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'

	const userList = ref([])

	const dropDownRef = ref(null)
	const popupRef = ref(null)

	const defaultValue = ref(['all'])

	const result = ref([])

	const activeName = ref('userType')

	const selections = ref({
		userType: {
			label: '所有用户',
			value: 'all',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
				label: '所有用户',
				value: 'all'
			}, {
				label: '管理员',
				value: 'admin'
			}, {
				label: '工人',
				value: 'worker'
			}]
		},
		userStatus: {
			label: '用户状态',
			value: 'all',
			activeIndex: 0,
			color: '#333',
			activeColor: '#2878ff',
			child: [{
				label: '全部',
				value: 'all'
			}, {
				label: '正常',
				value: 'normal'
			}, {
				label: '注销',
				value: 'logout'
			}]
		}
	})

	const dropItem = computed((name) => {
		return (name) => {
			const result1 = {}
			const find = result.value.find(item => item.name === name)
			if (find) {
				result1.label = find.label
				result1.value = find.value
			} else {
				result1.label = selections.value[name].label
				result1.value = selections.value[name].value
			}
			return result1
		}
	})

	const currentDropItem = computed(() => {
		return selections.value[activeName.value]
	})

	const selectMenu = (e) => {
		const {
			name,
			active,
			type
		} = e
		activeName.value = name
		const find = result.value.find(item => item.name == activeName.value)
		if (find) {
			const findIndex = selections.value[activeName.value].child.findIndex(item => item.label == find.label &&
				item.value == find.value)
			selections.value[activeName.value].activeIndex = findIndex
		} else {
			selections.value[activeName.value].activeIndex = 0
		}
	}

	const clickItem = (e) => {
		let {
			label,
			value
		} = e
		const findIndex = result.value.findIndex(item => item.name == activeName.value)
		if (defaultValue.value.indexOf(value) > -1 && selections.value[activeName.value].label) {
			label = selections.value[activeName.value].label;
		}
		// 已经存在筛选项
		if (findIndex > -1) {
			result.value[findIndex] = {
				name: activeName.value,
				label,
				value
			}
		} else {
			result.value.push({
				name: activeName.value,
				label,
				value
			})
		}
		result.value = result.value.filter(item => defaultValue.value.indexOf(item.value) == -1)
	}

	const goInfoModifyPage = (UUID) => {
		uni.navigateTo({
			url: `/pages/userAdminPage/userAdminInfoModify/userAdminInfoModify?UUID=${UUID}`
		})
	}

	watch(result, () => {
		let userType = ''
		let userStatus = ''

		for (let item of result.value) {
			if (item.name === 'userType') {
				userType = item.value
			} else {
				userStatus = item.value
			}
		}

		uni.request({
			url: 'http://10.0.2.2:8000/userAdmin/getUserList/',
			method: 'GET',
			data: {
				'userType': userType,
				'userStatus': userStatus
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				const data = res.data
				let list = []
				for (let item of data['userInfoList']) {
					list.push(item)
				}
				userList.value = list
			},
			fial: (err) => {
				uni.showToast({
					title: '请求失败',
					icon: 'error',
					duration: 1000
				})
			}
		})
	})

	onPageScroll(() => {
		dropDownRef.value.init()
	})

	onLoad(() => {
		uni.request({
			url: 'http://10.0.2.2:8000/userAdmin/getUserList/',
			method: 'GET',
			data: {
				'userType': '',
				'userStatus': ''
			},
			header: {
				'Authorization': uni.getStorageSync('token')
			},
			success: (res) => {
				const data = res.data
				let list = []
				for (let item of data['userInfoList']) {
					list.push(item)
				}
				userList.value = list
			},
			fial: (err) => {
				uni.showToast({
					title: '请求失败',
					icon: 'error',
					duration: 1000
				})
			}
		})
	})

	const workerIconSrc = ref('/static/icon/worker.png')
	const adminIconSrc = ref('/static/icon/admin.png')

	const horizontal = 'right'
	const vertical = 'bottom'
	const direction = 'horizontal'
	const pattern = {
		color: '#7A7E83',
		backgroundColor: '#fff',
		selectedColor: '#007AFF',
		buttonColor: '#007AFF',
		iconColor: '#fff'
	}

	const content = ref([{
		iconPath: '/static/icon/add-worker.png',
		selectedIconPath: '/static/icon/add-worker-active.png',
		text: '工人',
		active: false
	}])

	const openAddWorker = () => {
		popupRef.value.open()
	}

	const cancelAddWorker = () => {
		content.value[0].active = false
		popupRef.value.close()
	}

	const trigger = (e) => {
		content.value[0].active = true
		openAddWorker()
	}

	const formRef = ref(null)

	const form = ref({
		username: '',
		fullName: '',
		email: '',
		password: '',
		confirmPassword: ''
	})

	const rules = ref({
		username: [{
				required: true,
				message: '请填写用户名',
				trigger: ['blur', 'change']
			},
			{
				pattern: /^[a-zA-Z0-9]{6,12}$/,
				message: '用户名格式不正确',
				trigger: ['blur', 'change']
			}
		],
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
				url: 'http://10.0.2.2:8000/userAdmin/addWorker/',
				method: 'POST',
				data: {
					'username': form.value.username,
					'password': form.value.password,
					'fullName': form.value.fullName,
					'email': form.value.email
				},
				header: {
					'Authorization': uni.getStorageSync('token')
				},
				success: (res) => {
					if (res.statusCode === 200) {
						uni.showToast({
							title: res.data.info,
							icon: 'success',
							duration: 1000
						})
						cancelAddWorker()
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
			toast('添加信息有误');
		});
	}

	const resetForm = () => {
		formRef.value.resetFields();
	}
</script>

<style>
	.backgroud {
		background-color: #f1f3f2;
		min-height: 100%;
	}

	.user-list {
		padding: 12px 0px;
	}

	.user-list-item {
		background-color: #FFF;
		width: 95%;
		border-radius: 0.5rem;
		margin: 0px auto;
		margin-bottom: 12px;
	}

	.user-list-item-content {
		padding: 18px 0px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
	}

	.user-list-item-text-content {
		margin-left: -5%;
	}

	.user-list-button {
		margin-left: 5%;
	}

	.user-list-logout-icon {
		margin-left: 5%;
	}

	.popup-style {
		border-radius: 0.5rem;
	}

	.popup-body {
		width: 380px;
	}

	.popup-title-block {
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	
	.popup-title {
		margin-top: 10px;
	}

	.ver-line {
		height: 4px;
		width: 105px;
		border-radius: 10px;
		background-color: #0081CF;
		margin-top: 4px;
	}

	.popup-buttom-group {
		margin-bottom: 15px;
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.popup-bottom {
		width: 125px;
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
</style>