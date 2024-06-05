import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserAuthStore = defineStore('userAuth', () => {
	const authType = ref(1)
	
	return {
		authType,
	}
})