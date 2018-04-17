import {Injectable} from '@angular/core';

const navigator = window.navigator
navigator.getUserMedia = <any>navigator.getUserMedia

@Injectable()
export class AudioApiService {

  isSupport: any
  context: any

  constructor() {


    this.isSupport = !!(navigator.getUserMedia && AudioContext)
    this.context = this.isSupport && new AudioContext()
  }


  start() {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext  AudioContent API
    return new Promise((resolve, reject) => {
      navigator.getUserMedia({audio: true}, stream => {
        const source = this.context.createMediaStreamSource(stream)
        const analyser = this.context.createAnalyser()
        source.connect(analyser)
        analyser.fftSize = 2048

        let bufferSize = 4096;
        const recorder = this.context.createScriptProcessor(bufferSize, 2, 2);
        recorder.connect(this.context.destination)
        resolve(analyser)
      }, () => {
        reject()
      })
    })
  }

  getVoiceSize(analyser) {
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(dataArray)
    // console.log(dataArray)
    const data = dataArray.slice(100, 1000)
    return data.reduce((a, b) => a + b)
  }
}
