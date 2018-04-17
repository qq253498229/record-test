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

  audioSrc: any
  recorder: any

  base64: string

  constructor(private ref: ElementRef,
              private recService: RecorderService) {
  }

  ngOnInit() {
  }

  toBase64() {
    let myReader: FileReader = new FileReader();
    myReader.readAsDataURL(this.recorder.getBlob());
    myReader.onloadend = () => {
      this.base64 = myReader.result;
      console.log(this.base64)
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
    // console.log(this.recorder.getBlob())
  }

  upload() {

  }
}
