<template>
  <div class="col-4 col-xl-3 user-select-none"
       :class="[{'pointer': !isCurrent && !isDisabled}]"
       @click="checkClick()"
  >
    <div class="step d-flex flex-column align-items-center">
      <h3 class="text-center text-nowrap"
          :class="(isSuccess) ? 'text-success' : 'text-info'"
      >{{ header }}</h3>
      <div class="step-round text-white rounded-circle d-flex justify-content-center align-items-center mb-3"
           :class="[{'active': isCurrent}, (isSuccess) ? 'bg-success' : 'bg-info', {'disabled': isDisabled && !isCurrent}]"
      >
        <span>{{ step }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['header', 'step', 'isCurrent', 'isSuccess', 'isDisabled'],
  name: "ActionCircle",
  data() {
    return {}
  },
  methods: {
    checkClick() {
      console.log(1)
      if (!this.isCurrent && !this.isDisabled)
        this.$emit('checkClick')
    }
  }
}
</script>

<style scoped>
.step-round {
  width: 100px;
  height: 100px;
}

.step-round span {
  line-height: 100%;
  font-size: 2rem;
}

.active {
  animation: pulse 2s ease-in-out infinite;
}

.disabled {
  opacity: 0.5;
}

@keyframes pulse {
  from {
    transform: scale(.95);
  }
  50% {
    transform: scale(1);
  }
  to {
    transform: scale(.95);
  }
}

@media screen and (max-width: 867px) {
  .step h3 {
    display: none;
  }

  .step-round:not(.active) span {
    font-size: 1rem;
  }

  .step-round:not(.active) {
    width: 50px;
    height: 50px;
  }
}

</style>
