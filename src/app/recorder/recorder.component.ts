import {Component, OnInit, ElementRef, OnDestroy} from '@angular/core';
import {RecorderService} from "../recorder.service";
import {AudioApiService} from "../audio-api.service";

declare var HZRecorder: any

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css'],
  providers: [RecorderService, AudioApiService]

})
export class RecorderComponent implements OnInit, OnDestroy {
  title = '测试录音';

  /**
   * 录音列表
   * @type {any[]}
   */
  audioList: any[] = []

  /**
   * 当前录音索引
   * @type {number}
   */
  currentAudioIdx: number = 0

  /**
   * 声音检测标记
   */
  audioFlag: any
  /**
   *分析器
   */
  analyser: any
  /**
   * 录制时间
   */
  recorderTime: any
  /**
   * 超时时间，默认60秒
   * @type {number}
   */
  expireTime: number = 60 * 1000
  /**
   * 每次录制最短时间，默认1秒
   * @type {number}
   */
  minTime: number = 1000
  /**
   * 开始录音标记
   * @type {boolean}
   */
  startFlag: boolean = false
  /**
   * 音量最大值
   * @type {number}
   */
  maxSize: number = 0

  /**
   * 同步录音机标志
   */
  syncFlag: boolean = false

  constructor(private ref: ElementRef,
              private recService: RecorderService,
              private AudioAPI: AudioApiService) {
  }

  ngOnInit() {
  }

  /**
   * 判断是否超时
   * @returns {boolean}
   */
  checkIsExpire(): boolean {
    if (!this.recorderTime) {
      this.recorderTime = new Date()
      return false
    } else {
      return (new Date().getTime() - this.recorderTime.getTime()) > (this.expireTime - 1000)
    }
  }

  /**
   * 判断是否超过最短时间
   * @returns {boolean}
   */
  checkIsMinTime(): boolean {
    if (!this.recorderTime) {
      return false
    } else {
      return (new Date().getTime() - this.recorderTime.getTime()) > this.minTime
    }
  }

  /**
   * 判断音量是否过低
   */
  checkVoiceSizeLow(voiceSize: number): boolean {
    return voiceSize < this.maxSize * 0.1
  }

  /**
   * 判断是否有人说话
   */
  checkIsTalk(): boolean {
    return this.audioList[this.audioList.length - 1]['maxSize'] > this.maxSize * 0.5
      && this.syncFlag
  }

  /**
   * 调整最大最小值
   * @param {number} size
   */
  changeSize(size: number) {
    if (!this.syncFlag) return
    if (size > 0 && size > this.maxSize) this.maxSize = size
    let maxSize = this.audioList[this.audioList.length - 1]['maxSize'] || 0
    if (size > 0 && size > maxSize) this.audioList[this.audioList.length - 1]['maxSize'] = size
  }

  /**
   * 获取音量
   */
  getVoice() {
    this.audioFlag = setInterval(() => {
      let voiceSize = this.AudioAPI.getVoiceSize(this.analyser)
      this.changeSize(voiceSize)
      if (!this.startFlag) {
        this.startRecording()
        this.recorderTime = new Date()
        this.startFlag = true
      }
      let stopRecordingFlag = this.checkIsExpire() || (this.checkIsMinTime() && !this.checkVoiceSizeLow(voiceSize) && this.checkIsTalk())
      if (stopRecordingFlag) {
        this.stopRecording()
        this.recorderTime = null
        this.startFlag = false
      }
    }, 100)
  }

  /**
   * 开始监测音量
   */
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

  /**
   * 结束检测音量
   */
  stopWatchVoice() {
    this.stopRecording()
    clearInterval(this.audioFlag)
  }


  /**
   * 离开页面时清空检测
   */
  ngOnDestroy() {
    clearInterval(this.audioFlag);
  }

  /**
   * 开始单条录音
   */
  startRecording() {
    if (this.syncFlag) return
    this.audioList.push({})
    this.currentAudioIdx = this.audioList.length - 1
    this.syncFlag = false
    HZRecorder.get(rec => {
      this.audioList[this.currentAudioIdx]['recorder'] = rec
      this.audioList[this.currentAudioIdx]['recorder'].start()
      this.syncFlag = true
    })
  }

  /**
   * 结束单条录音
   */
  stopRecording() {
    if (!this.syncFlag) return
    let recorder = this.audioList[this.currentAudioIdx]['recorder']
    if (!recorder) return
    recorder.stop();
    this.syncFlag = false
    let audios = this.ref.nativeElement.querySelectorAll('audio')
    recorder.play(audios[this.currentAudioIdx])
    this.audioToText(this.currentAudioIdx)
  }

  /**
   * 单条录音转文字
   * @param {number} idx
   */
  audioToText(idx: number) {
    // return new FileReader().readAsText(this.recorder.getBlob())
    let myReader: FileReader = new FileReader();
    myReader.readAsDataURL(this.audioList[idx]['recorder'].getBlob());
    myReader.onloadend = () => {
      let base64 = myReader.result;
      this.recService.asr(base64, this.audioList[idx]['recorder'].getBlob().size).subscribe(res => {
        console.log(res)
        this.audioList[idx]['result'] = res.result
      })
    }
  }


  upload() {

  }
}
