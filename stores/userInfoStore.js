import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
	const username = ref('Paranoid')
	const role = ref('admin')
	const fullName = ref('李四')
	const email = ref('123456@qq.com')
	const empNo = ref('W0000')
	
	return {
		username,
		role,
		fullName,
		email,
		empNo
	}
})
