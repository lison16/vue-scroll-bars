<template>
	<div ref="wraper" :class="wraperClasses" @mousewheel="handleMouseWheel">
		<div 
			ref="content"
			:class="`${prefix}-content`"
			:style="contentStyles"
			>
			<slot></slot>
		</div>
		<div v-show="percentY < 1" :class="scrollYClasses" :style="scrollYStyle">
			<div :class="[`${prefix}-scroll-bar`, `${prefix}-scroll-bar-y`]" :style="scrollBarYStyles" @mousedown="handleMousedownScrollBarY"></div>
		</div>
		<div :class="`${prefix}-scroll-x`"></div>
	</div>
</template>

<script>
export default {
	name: 'scrollBar',
	props: {
		speed: {
			type: Number,
			default: 20
		},
		scrollYStyle: {
			type: Object,
			default () {
				return {};
			}
		},
		scrollYType: {
			type: String,
			default: 'cover'
		},
		showAll: {
			type: Boolean,
			default: false
		}
	},
	data () {
		return {
			prefix: 'vue-scroller-bars',
			scrollX: 0,
			scrollY: 0,
			contentSize: {
				width: 0,
				height: 0
			},
			wraperSize: {
				width: 0,
				height: 0
			},
			scrollBarYHeight: 0,
			initY: 0
		}
	},
	computed: {
		wraperClasses () {
			return [
				`${this.prefix}-wraper`,
				this.showAll ? '' : 'show-when-hover'
			]
		},
		contentStyles () {
			return {
				transform: `translate3d(${this.scrollX}px, -${this.scrollY}px, 0px)`
			}
		},
		percentY () {
			return this.wraperSize.height / this.contentSize.height;
		},
		scrollBarYStyles () {
			let height = this.percentY * (this.wraperSize.height - 2);
			return {
				transform: `translate3d(${this.scrollX}px, ${this.scrollY * (height / this.wraperSize.height)}px, 0px)`,
				height: `${height}px`
			}
		},
		scrollYClasses () {
			return [
				`${this.prefix}-scroll`,
				`${this.prefix}-scroll-y`,
				this.scrollYType === 'cover' ? 'scroll-y-cover' : ''
			]
		},
		gapY () {
			return this.contentSize.height - this.wraperSize.height;
		}
	},
	methods: {
		resize () {
			this.$nextTick(() => {
				let wraperRect = this.$refs.wraper.getBoundingClientRect();
				let contentRect = this.$refs.content.getBoundingClientRect();
				this.contentSize = {
					width: contentRect.width,
					height: contentRect.height
				};
				this.wraperSize = {
					width: wraperRect.width,
					height: wraperRect.height
				};
				if (this.contentSize.height <= this.wraperSize.height) { // if content's height shorter than wraper's height
					this.scrollY = 0;
				};
				if ((wraperRect.bottom > contentRect.bottom) && (this.scrollY > 0)) { // if content's bottom upper wraper's bottom
					this.scrollY += contentRect.bottom - wraperRect.bottom
				};
			})
		},
		handleMouseWheel (e) {
			this.scrollY += e.deltaY;
			if (this.scrollY >= this.gapY) {
				this.scrollY = Math.min(this.gapY, this.scrollY);
			} else if (this.scrollY <= 0) {
				this.scrollY = Math.max(this.scrollY, 0);
			}
		},
		handleMousemoveY (e) {
			console.log(e.pageY - this.initY)
			this.scrollY = (e.pageY - this.initY) / (this.percentY * (this.wraperSize.height - 2) / this.wraperSize.height);
			if (this.scrollY >= this.gapY) {
				this.scrollY = Math.min(this.gapY, this.scrollY);
			} else if (this.scrollY <= 0) {
				this.scrollY = Math.max(this.scrollY, 0);
			}
			e.preventDefault();
		},
		handleMouseup (e) {
			document.removeEventListener('mousemove', this.handleMousemoveY);
			document.removeEventListener('mousemove', this.handleMouseup);
		},
		handleMousedownScrollBarY (e) {
			if (this.initY === 0) this.initY = e.pageY;
			// this.initY = e.pageY;
			document.addEventListener('mousemove', this.handleMousemoveY);
			document.addEventListener('mouseup', this.handleMouseup);
		}
	},
	mounted () {
		this.resize();
	}
}
</script>

<style lang="less">
@import './scroll-bar.less';
</style>
