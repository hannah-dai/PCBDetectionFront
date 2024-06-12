import { defineStore } from 'pinia'
import { ref } from 'vue'
import { format, subDays } from 'date-fns'

export const useProductLineStore = defineStore('productLine', () => {
	const productLineList = ref([])
	const timeRange = ref([format(subDays(new Date(), 7), 'yyyy-MM-dd'), format(subDays(new Date(), 1), 'yyyy-MM-dd')])
	
	return {
		productLineList,
		timeRange,
	}
})