import {Component, OnInit, ElementRef} from '@angular/core';
import {RecorderService} from "../recorder.service";

declare var HZRecorder: any

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.css'],
  providers: [RecorderService]

})
export class RecorderComponent implements OnInit {
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

  constructor(private ref: ElementRef,
              private recService: RecorderService) {
  }

  ngOnInit() {
  }

  /**
   * 播放单挑录音
   * @param idx
   */
  play(idx) {
    let audio = this.ref.nativeElement.querySelectorAll('audio')[idx]
    audio.play()
  }

  /**
   * 开始单条录音
   */
  startRecording() {
    this.audioList.push({})
    this.currentAudioIdx = this.audioList.length - 1
    HZRecorder.get(rec => {
      this.audioList[this.currentAudioIdx]['recorder'] = rec
      this.audioList[this.currentAudioIdx]['recorder'].start()
    })
  }

  /**
   * 结束单条录音
   */
  stopRecording() {
    let recorder = this.audioList[this.currentAudioIdx]['recorder']
    recorder.stop();
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
