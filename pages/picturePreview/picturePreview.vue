<template>
		<view>
			<view class="uni-padding-wrap uni-common-mt">
				<view v-if="imageSrc" class="image-container">
					<image class="img" :src="imageSrc" mode="center" />
				</view>
			</view>
		</view>
		<bottomBar/>
</template>

<script setup>
	import { ref } from 'vue';
	import { onLoad } from '@dcloudio/uni-app'
	import bottomBar from '@/components/bottomBar/bottomBar.vue'
	
	const title = ref('downloadFile')
	const imageSrc = ref('')
	
	onLoad(() => {
		imageSrc.value = ''
		downloadImage()
	})
	
	const downloadImage = () => {
		uni.showLoading({
			title:'下载中'
		})
		uni.downloadFile({
			url:'http://10.0.2.2:8000/getPicture/',
			success: (res) => {
				console.log("download file successfully!")
				imageSrc.value = res.tempFilePath
				uni.hideLoading()
			},
			fail: (err) => {
				console.log("download fail for err ", err)
			}
		})
	}
</script>

<style>

</style>
