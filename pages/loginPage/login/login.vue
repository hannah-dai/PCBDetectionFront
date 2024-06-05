<template>
	<view>
		<text>Login Page</text>
		<button @tap="goRegister()">Register</button>
		<button @tap="goHome()">Home Page</button>
	</view>
</template>

<script setup>
	const goRegister = () => {
		uni.navigateTo({
			url:"/pages/loginPage/register/register"
		})
	}
	
	const goHome = () => {
		uni.navigateTo({
			url:"/pages/CamaraTest/CamaraTest"
		})
	}
</script>

<style>

</style>
