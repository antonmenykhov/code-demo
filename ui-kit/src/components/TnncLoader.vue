<template>
	<Teleport
		v-if="isLoaderMounted"
		:to="target"
		:disabled="disableTeleport"
	>
		<div
			class="tnnc-preloader"
			:class="[cssClass]"
		>
			<div class="preloader-item">
				<div class="pr-line-y pr-line-y1"></div>
				<div class="pr-line-y pr-line-y2"></div>
				<div class="pr-line-y pr-line-y3"></div>
				<div class="pr-line-b pr-line-b1"></div>
				<div class="pr-line-b pr-line-b2"></div>
				<div class="pr-line-b pr-line-b3"></div>
				<div class="pr-line-b pr-line-b4"></div>
				<div class="pr-line-b pr-line-b5"></div>
				<div class="pr-line-b pr-line-b6"></div>
				<div class="pr-line-b pr-line-b7"></div>
			</div>
			<div class="preloader-text">
				{{ title }}
			</div>
		</div>
	</Teleport>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, ref } from "vue";

const props = withDefaults(
	defineProps<{
		title?: string;
		target?: string;
		cssClass?: string;
		disableTeleport?: boolean;
	}>(),
	{ target: "body" }
);
const isLoaderMounted = ref(false);
function mountLoader() {
	const target = document.querySelector(props.target);
	if (target) {
		isLoaderMounted.value = true;
		if (!props.disableTeleport)
			(target as HTMLElement).style.overflow = "hidden";
	} else {
		setTimeout(() => {
			mountLoader();
		}, 10);
	}
}
mountLoader();
onBeforeUnmount(() => {
	const target = document.querySelector(props.target);
	if (target) {
		(target as HTMLElement).style.overflow = "auto";
	}
});
</script>
<style>
.tnnc-preloader {
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
    height: 100%;
	padding: 0;
	margin: 0;
	box-sizing: border-box;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	z-index: 100000;
	background: #fff;
	color: #fff;
	opacity: 0.96;
}
.tnnc-preloader .preloader-item {
	width: 95px;
	height: 150px;
	box-sizing: border-box;
	position: relative;
	clear: both;
	margin: 300px auto 0 auto;
}
.tnnc-preloader .preloader-text {
	color: #3c4549;
	font-size: 20px;
	font-weight: 600;
	clear: both;
	margin: auto;
    margin-top: 0;
}
.tnnc-preloader .pr-line-y {
	width: 10px;
	background: #ffd500;
	position: absolute;
}
.tnnc-preloader .pr-line-y1 {
	top: 82px;
	left: 30px;
	height: 50px;
}
.tnnc-preloader .pr-line-y2 {
	top: 72px;
	left: 42px;
	height: 60px;
}
.tnnc-preloader .pr-line-y3 {
	top: 82px;
	left: 54px;
	height: 50px;
}
.tnnc-preloader .pr-line-b {
	width: 10px;
	background: #000;
	position: absolute;
}
.tnnc-preloader .pr-line-b1 {
	top: 40px;
	left: 6px;
	height: 30px;
	width: 0;
	background: transparent;
	border-right: 10px solid #000;
	border-bottom: 10px solid transparent;
	animation: rotate 2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
	transform-style: preserve-3d;
}
.tnnc-preloader .pr-line-b2 {
	top: 30px;
	left: 18px;
	height: 50px;
	width: 0;
	background: transparent;
	border-right: 10px solid #000;
	border-bottom: 10px solid transparent;
	animation: rotate 2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
	transform-style: preserve-3d;
}
.tnnc-preloader .pr-line-b3 {
	top: 20px;
	left: 30px;
	height: 60px;
	animation: glide 0.9s linear infinite;
}
.tnnc-preloader .pr-line-b4 {
	top: 10px;
	left: 42px;
	height: 60px;
	animation: glide 0.7s linear infinite;
}
.tnnc-preloader .pr-line-b5 {
	top: 20px;
	left: 54px;
	height: 60px;
	animation: glide 1s linear infinite;
}
.tnnc-preloader .pr-line-b6 {
	top: 30px;
	left: 66px;
	height: 50px;
	width: 0;
	background: transparent;
	border-left: 10px solid #000;
	border-bottom: 10px solid transparent;
	animation: rotate 2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
	transform-style: preserve-3d;
}
.tnnc-preloader .pr-line-b7 {
	top: 40px;
	left: 78px;
	height: 30px;
	width: 0;
	background: transparent;
	border-left: 10px solid #000;
	border-bottom: 10px solid transparent;
	animation: rotate 2s cubic-bezier(0.3, 0, 0.3, 1) infinite;
	transform-style: preserve-3d;
}
@keyframes glide {
	0% {
		height: 60px;
		animation-timing-function: ease-out;
	}
	25% {
		height: 70px;
		animation-timing-function: ease-in;
	}
	50% {
		height: 80px;
		animation-timing-function: ease-out;
	}
	75% {
		height: 70px;
		animation-timing-function: ease-in;
	}
	100% {
		height: 60px;
		animation-timing-function: ease-in;
	}
}
</style>
