import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabBarNavigateStore = defineStore('tabBarNavigate', () => {
	const tabBarValue = ref(0)
	
	return {
		tabBarValue,
	}
})