const idleTimeout = 20000
const states = {
  'default': 0,
  'wake': 1,
  'idle': 2
}

class IdleDetector {
  constructor(onIdle, onWakeup) {
    this.onIdle = onIdle
    this.onWakeup = onWakeup
    this.timoutTimer = null
    this.state = states.default
    this.resetTimer()
    this.registerTimerReset()
  }

  idleDetected() {
    this.state = states.idle
    this.onIdle()
  }

  wakeUpDetected() {
    this.state = states.wake
    this.onWakeup()
  }

  resetTimer() {
    if(this.timoutTimer) {
      clearTimeout(this.timoutTimer)
    }

    if(this.state == states.idle) {
      this.wakeUpDetected()
    }

    this.timoutTimer = setTimeout(() => this.idleDetected(), idleTimeout);
  }

  disableTimer() {
    if(this.timoutTimer) {
      clearTimeout(this.timoutTimer)
      this.timoutTimer = null
    }
  }

  registerTimerReset() {
    document.addEventListener("pause", () => this.disableTimer(), false);
    window.addEventListener('onblur', () => this.disableTimer(), false);
    document.addEventListener('onblur', () => this.disableTimer(), false);
    window.addEventListener('onfocus', () => this.resetTimer(), false);

    document.addEventListener("resume", () => this.resetTimer(), false);

    window.addEventListener('touchstart', () => this.resetTimer())
    window.addEventListener('scroll', () => this.resetTimer())
    window.addEventListener('click', () => this.resetTimer())
  }
}

export default IdleDetector
