const audio = document.getElementById('beep')

class App extends React.Component {
    state = {
        breakCount: 5,
        sessionCount: 25,
        currentTimer: 'Session',
        clockCount: 25 * 60,
        isPlaying: false
    }

    constructor(props) {
        super(props)
        this.loop = undefined
    }

    // function to convert total seconds to time format
    convertToTime = (totalSeconds) => {
        let minutes = Math.floor(totalSeconds / 60)
        let seconds = totalSeconds % 60

        minutes = minutes < 10 ? '0' + minutes : minutes
        seconds = seconds < 10 ? '0' + seconds : seconds
        return `${minutes}:${seconds}`
    }

    // single function to handle te length change of break and session counts
    handleLengthChange = (count, setTimerType) => {
        const { breakCount, sessionCount, isPlaying, currentTimer, clockCount } = this.state

        let newCount;

        // clicking the button of the respective setTimer would set the 'argument' setTimerType equal to that of the button
        if (setTimerType === 'session') {
            newCount = sessionCount + count
        }
        else {
            newCount = breakCount + count
        }

        // the buttons don't work when the timer is running and the values of the span are 1 and 60
        if (newCount > 0 && newCount < 61 && !isPlaying) {
            // when the timer is not running the newCount value is put inside the button span
            this.setState({
                [`${setTimerType}Count`]: newCount
            })
            // when the clock is not running, it is checked which button in being clicked, then the value of the span is set inside the timer for that particular value of currentTimer
            if (currentTimer.toLowerCase() === setTimerType) {
                this.setState({
                    clockCount: newCount * 60
                })
            }
        }
    }

    /*
    handleBreakDecrease = () => {
        const { breakCount, isPlaying, currentTimer, clockCount } = this.state

        // break length will only decrease till the value is 1
        if (breakCount > 1) {
            // when the timer is not running and the currentTimer is 'Break', the clockCount is set to the 'breakCount' time
            if (!isPlaying && currentTimer === 'Break') {
                this.setState({
                    breakCount: breakCount - 1,
                    clockCount: (breakCount - 1) * 60
                })
            } else {
                this.setState({
                    breakCount: breakCount - 1
                })
            }
        }
    }

    handleBreakIncrease = () => {
        const { breakCount, isPlaying, currentTimer, clockCount } = this.state

        if (breakCount < 60) {
            // when the timer is not running and the currentTimer is 'Break', the clockCount is set to the 'breakCount' time
            if (!isPlaying && currentTimer === 'Break') {
                this.setState({
                    breakCount: breakCount + 1,
                    clockCount: (breakCount + 1) * 60
                })
            } else {
                this.setState({
                    breakCount: breakCount + 1
                })
            }
        }
    }

    handleSessionDecrease = () => {
        const { sessionCount, isPlaying, currentTimer, clockCount } = this.state

        if (sessionCount > 1) {
            // when the timer is not running and the currentTimer is 'Session', the clockCount is set to the 'sessionCount' time
            if (!isPlaying && currentTimer === 'Session') {
                this.setState({
                    sessionCount: sessionCount - 1,
                    clockCount: (sessionCount - 1) * 60
                })
            } else {
                this.setState({
                    sessionCount: sessionCount - 1
                })
            }
        }
    }

    handleSessionIncrease = () => {
        const { sessionCount, isPlaying, currentTimer, clockCount } = this.state

        if (sessionCount < 60) {
            // when the timer is not running and the currentTimer is 'Session', the clockCount is set to the 'sessionCount' time
            if (!isPlaying && currentTimer === 'Session') {
                this.setState({
                    sessionCount: sessionCount + 1,
                    clockCount: (sessionCount + 1) * 60
                })
            } else {
                this.setState({
                    sessionCount: sessionCount + 1
                })
            }
        }
    }
    */

    // function to start and pause the timer
    handlePlayPause = () => {
        // state used in this function to setup the timer function
        const { isPlaying } = this.state

        if (isPlaying) {
            // if clock running already, clicking will clear the variable loop and stop the clock
            clearInterval(this.loop)

            this.setState({
                isPlaying: false
            })
        }
        else {
            this.setState({
                isPlaying: true
            })

            // loop is a variable that takes in the function of setInterval decreasing the second count in the clock after the button is clicked
            this.loop = setInterval(() => {
                // states used in this loop variable 
                const { clockCount, currentTimer, breakCount, sessionCount } = this.state

                if (clockCount === 0) {
                    this.setState({
                        // when the sessionCount reaches zero, the state of the currentTimer is changed to 'Break' from 'Session'
                        // when the breakCount reaches zero, the state of the currentTimer is changed to 'Session' to 'Break'
                        currentTimer: (currentTimer === 'Session') ? 'Break' : 'Session',

                        // when the sessionCount reaches zero, the state of the clockCount is changed to the minutes put in the 'Break Length' section
                        // when the breakCount reaches zero, the state of the clockCount is changed to the minutes put in the 'Session Length' section
                        clockCount: (currentTimer === 'Session') ? (breakCount * 60) : (sessionCount * 60)
                    })
                    audio.play()
                }
                else {
                    this.setState({
                        clockCount: clockCount - 1
                    })
                }
            }, 1000)
        }
    }

    handleReset = () => {
        this.setState({
            breakCount: 5,
            sessionCount: 25,
            currentTimer: 'Session',
            clockCount: 25 * 60,
            isPlaying: false
        })

        clearInterval(this.loop)
        audio.pause()
        //returns the audio playback to the start
        audio.currentTime = 0
    }

    render() {
        const { breakCount, sessionCount, clockCount, currentTimer, isPlaying } = this.state

        // object defined for Break Length to be used in <SetTimer> element
        const breakProps = {
            title: 'Break',
            count: breakCount,
            handleDecrease: () => this.handleLengthChange(-1, 'break'),
            handleIncrease: () => this.handleLengthChange(1, 'break')
        }

        // object defined for Session Length to be used in <SetTimer> element
        const sessionProps = {
            title: 'Session',
            count: sessionCount,
            handleDecrease: () => this.handleLengthChange(-1, 'session'),
            handleIncrease: () => this.handleLengthChange(1, 'session')
        }

        return (
            <div>
                <div className='flex'>
                    <SetTimer {...breakProps} />
                    <SetTimer {...sessionProps} />
                </div>
                <div className='clock-container'>
                    <h4 id="timer-label">{currentTimer}</h4>
                    <span id="time-left">{this.convertToTime(clockCount)}</span>

                    <div className='flex'>
                        <button id="start_stop" onClick={this.handlePlayPause}>
                            <i className={`fa-solid fa-${isPlaying ? 'pause' : 'play'}`}></i>
                        </button>
                        <button id="reset" onClick={this.handleReset}>
                            <i className="fa-solid fa-arrows-rotate"></i>
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const SetTimer = (props) => {
    const id = props.title.toLowerCase()

    return (< div className='timer-container' >
        <h5 id={`${id}-label`}>{props.title} Length</h5>
        <div className='flex'>
            <button id={`${id}-decrement`} onClick={props.handleDecrease}>
                <i className="fa-sharp fa-solid fa-angle-down"></i>
            </button>
            <span id={`${id}-length`}>{props.count}</span>
            <button id={`${id}-increment`} onClick={props.handleIncrease}>
                <i className="fa-sharp fa-solid fa-angle-up"></i>
            </button>
        </div>
    </div >)
}

ReactDOM.render(<App />, document.getElementById('app'))