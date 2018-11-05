import {Injectable} from '@angular/core';
import * as contract from 'truffle-contract';
import {Subject} from 'rxjs';
declare let require: any;
const Web3 = require('web3');


declare let window: any;

@Injectable()
export class Web3Service {
  public web3: any;
  public isWeb3Ready = false;
  public accounts: string[];
  public ready = false;
  public accountsObservable = new Subject<string[]>();

  constructor() {
    window.addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      this.isWeb3Ready = true;
      this.startRefreshAccounts();
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      try {
        // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
        Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

        this.web3.eth.isSyncing().then(() => {
          this.isWeb3Ready = true;
          this.startRefreshAccounts();
        }).catch(() => {
          console.error('Couldn\'t connect to web3 provider');
        });
      } catch (e) {
        console.error('Couldn\'t connect to web3 provider');
      }
    }
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private startRefreshAccounts() {
    setInterval(() => this.refreshAccounts(), 100);
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      //console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');

        this.accountsObservable.next(accs);
        this.accounts = accs;
      }

      this.ready = true;
    });
  }

  public isWeb3Connected() {
    return new Promise((resolve, reject) => {
      if (this.isWeb3Ready) {
        resolve(true);
      } else {
        let tryCount = 0;
        let interval = setInterval(() => {
            tryCount++;
            if (tryCount > 30) {
              clearInterval(interval);
              resolve(false);
            }

            if (this.isWeb3Ready) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);
      }
    });
  }
}
