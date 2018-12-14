import { Injectable } from '@angular/core';
import {Web3Service} from '../util/web3.service';


declare let require: any;
const token_artifacts = require('../../../build/contracts/RootsToken.json');

@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private Token: any;

    constructor(
        private web3Service: Web3Service
    ) {

    }

    async setToken() {
        if (!this.Token) {
            const TokenContract: any = await this.getContractPromise(token_artifacts);
            this.Token = await TokenContract.deployed();
        }
    }

    public async send(to, value) {
        await this.setToken();

        try {
            await this.Token.transfer(to, this.web3Service.web3.utils.toWei(value, 'ether'), {from: this.web3Service.accounts[0]});

            return true;

        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    private getContractPromise(artifacts) {
        const self = this;
        return new Promise(async (resolve) => {
            await self.web3Service.artifactsToContract(artifacts)
                .then((ContractAbstraction) => {
                    resolve(ContractAbstraction);
                });
        });
    }
}
