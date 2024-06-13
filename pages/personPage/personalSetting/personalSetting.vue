<template>
  <view class="uv-page" style="background-color: #fff;">
    <view class="uv-demo-block">
      <view class="uv-demo-block__content">
        <uv-form
            labelPosition="left"
            labelWidth="80"
            :model="form"
            :rules="rules"
            ref="formRef"
        >
          <uv-form-item
              label="用户名"
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

<script setup>
import {ref} from 'vue';
import {toast} from '@/uni_modules/uv-ui-tools/libs/function/index.js'
import {useUserInfoStore} from '@/stores/userInfoStore'
import {onLoad, onReady} from '@dcloudio/uni-app'

const userInfoStore = useUserInfoStore()
const formRef = ref(null)

const form = ref({
  nickname: '',
  email: ''
})

const rules = ref({
  nickname: [
    {required: true, message: '请填写昵称', trigger: ['blur', 'change']},
    {pattern: /^[a-zA-Z0-9]{6,12}$/, message: '昵称格式不正确', trigger: ['blur', 'change']}
  ],
  email: [
    {required: true, message: '请填写邮箱', trigger: ['blur', 'change']},
    {type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change']}
  ]
})

const submitForm = () => {
  formRef.value.validate().then(() => {
	  console.log(form.value)
    uni.request({
    	url: 'http://10.0.2.2:8000/userInfo/modifyUserInfo/',
		method: 'POST',
		data: {
			'fullName': form.value.nickname,
			'email': form.value.email
		},
		header: {
			'Authorization': uni.getStorageSync('token')
		},
		success: (res) => {
			if (res.data['errorInfo'] !== undefined){
				uni.showToast({
					title: res.data['errorInfo'],
					icon: 'error',
					duration: 1000
				})
			}else{
				let data = res.data
				userInfoStore.fullName = data['newFullName']
				userInfoStore.email = data['newEmail']

				uni.showToast({
					title: '修改成功',
					icon: 'success',
					duration: 1000
				})

				uni.navigateBack()
			}
		}
    })
  }).catch(errors => {
    toast('请填写完整信息');
  });
}

const resetForm = () => {
  formRef.value.resetFields();
}

onLoad(() => {
	form.value.account = userInfoStore.username
	form.value.nickname = userInfoStore.fullName
	form.value.email = userInfoStore.email
})

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
</style>
