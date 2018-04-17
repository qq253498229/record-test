import {Component, OnInit, ElementRef} from '@angular/core';
import {RecorderService} from "../recorder.service";

declare var HZRecorder: any

@Component({
  selector: 'app-done',
  templateUrl: './done.component.html',
  styleUrls: ['./done.component.css'],
  providers: [RecorderService]
})
export class DoneComponent implements OnInit {

  title = '测试录音';

  audioSrc: any
  recorder: any

  constructor(private ref: ElementRef,
              private recService: RecorderService) {
  }

  ngOnInit() {

    console.log(1)
  }

  toBase64() {
    // return new FileReader().readAsText(this.recorder.getBlob())
    let myReader: FileReader = new FileReader();
    myReader.readAsDataURL(this.recorder.getBlob());
    myReader.onloadend = () => {
      let base64 = myReader.result;

      console.log(base64)
      this.recService.asr(base64, this.recorder.getBlob().size).subscribe(res => {
        console.log(res)
      })
    }
  }

  startRecording() {
    HZRecorder.get(rec => {
      this.recorder = rec
      this.recorder.start()
    })
  }

  stopRecording() {
    this.recorder.stop();
    let audio = this.ref.nativeElement.querySelector('audio')
    this.recorder.play(audio)
    this.toBase64()
  }

  upload() {

  }

  /**
   * 分隔语音
   */
  cut() {

  }


}
