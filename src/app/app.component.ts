import {Component, OnInit} from '@angular/core';
import {Web3Service} from './util/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  state = 'ready';

  constructor(
    private web3Service: Web3Service
  ) { }

  ngOnInit() {
    this.web3Service.isWeb3Connected().then((res) => {
      if (!res) {
        this.state = 'noWeb3';
      }
    });
  }

}
