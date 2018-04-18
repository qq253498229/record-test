import {Component, OnInit} from '@angular/core';
import {AudioApiService} from "../audio-api.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
  providers: [AudioApiService]
})
export class ChartsComponent implements OnInit {

  title = '测试图表'

  timer: any;

  analyser: any
  /**
   * 当前音量
   */
  voiceSize: number
  /**
   * 音量最大值
   * @type {number}
   */
  maxSize: number = 0
  /**
   * 音量最小值
   * @type {number}
   */
  minSize: number = 99999

  constructor(private AudioAPI: AudioApiService) {
  }

  ngOnInit() {
  }


  startWatchVoice() {
    if (!this.analyser) {
      this.AudioAPI.start().then(a => {
        this.analyser = a
        this.getVoice()
      })
    } else {
      this.getVoice()
    }

  }

  stopWatchVoice() {
    clearInterval(this.timer)
  }

  getVoice() {
    this.timer = setInterval(() => {
      this.voiceSize = this.AudioAPI.getVoiceSize(this.analyser)
      if (this.voiceSize > 0 && this.voiceSize > this.maxSize) this.maxSize = this.voiceSize
      if (this.voiceSize > 0 && this.voiceSize < this.minSize) this.minSize = this.voiceSize
      console.log(this.voiceSize)
    }, 100)
  }


  ngOnDestroy() {
    clearInterval(this.timer);
  }


}
