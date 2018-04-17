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

  audioList: any[] = []

  currentAudioIdx: number = 0

  constructor(private ref: ElementRef,
              private recService: RecorderService) {
  }

  ngOnInit() {
  }

  play(idx) {
    let audio = this.ref.nativeElement.querySelectorAll('audio')[idx]
    audio.play()
  }

  startRecording() {
    this.audioList.push({})
    this.currentAudioIdx = this.audioList.length - 1
    HZRecorder.get(rec => {
      this.audioList[this.currentAudioIdx]['recorder'] = rec
      this.audioList[this.currentAudioIdx]['recorder'].start()
    })
  }

  stopRecording() {
    let recorder = this.audioList[this.currentAudioIdx]['recorder']
    recorder.stop();
    let audios = this.ref.nativeElement.querySelectorAll('audio')
    recorder.play(audios[this.currentAudioIdx])
    this.audioToText(this.currentAudioIdx)
  }

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
