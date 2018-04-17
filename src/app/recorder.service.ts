import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Observable';

@Injectable()
export class RecorderService {

  appId: string = '11106339'
  apiKey: string = '0hC9G6s7KDlzLb211LQLzE5l'
  secretKey: string = 'TYQH3PGg2dYN2WTGQiGc0T2VRXzBdna5'

  url: string = "/oauth/2.0/token"
  asrUrl: string = "/server_api"
  token: string

  constructor(private http: HttpClient) {
    this.refresh().subscribe(res => {
      console.log(res)
      this.token = res.access_token
    })
  }

  refresh(): Observable<any> {
    let getTokenURL = this.url + "?grant_type=client_credentials"
      + "&client_id=" + encodeURIComponent(this.apiKey)
      + "&client_secret=" + encodeURIComponent(this.secretKey);
    return this.http.get(getTokenURL)
  }

  asr(base64: string, length: number): Observable<any> {
    // let length
    // let base64

    let body = {
      'lan': 'zh',
      // 'dev-pid': 1537,
      'format': 'wav',
      'rate': 16000,
      'token': this.token,
      'channel': 1,
      'cuid': '1234567JAVA',
      'speech': base64.replace('data:audio/wav;base64,', ''),
      'len': length
    }
    return this.http.post(this.asrUrl, JSON.stringify(body))
  }
}
